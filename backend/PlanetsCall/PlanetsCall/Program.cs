using System.Text;
using Core;
using Core.User;
using Data;
using Data.Context;
using Data.Repository.Community;
using Data.Repository.Item;
using Data.Repository.Log;
using Data.Repository.Task;
using Data.Repository.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PlanetsCall.Helper;
using PlanetsCall.Services.Caching;
using PlanetsCall.Services.TaskScheduling;
using Quartz;
using Quartz.Impl;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

/* Configures CORS policy to allow the front end application communicate with server
 Configuration["WebsiteDomain"] Specifies the domain where the front-end React app is hosted allowing controlled cross-origin requests
 Allows any HTTP method, any header, and credentials*/

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        // Specifies the allowed origins
        policy.WithOrigins((Environment.GetEnvironmentVariable("WEBSITE_DOMAIN") ??
                            builder.Configuration["WebsiteDomain"])!)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);


builder.Services.RegisterDataServices(builder.Configuration);


builder.Services.AddStackExchangeRedisCache(options => // connect to redis for caching purpose
{
    options.Configuration = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("REDIS_HOST")) ?
        Environment.GetEnvironmentVariable("REDIS_HOST") + ':' + Environment.GetEnvironmentVariable("REDIS_PORT")
        : builder.Configuration.GetConnectionString("RedisConnection");
    options.InstanceName = builder.Configuration["RedisInstanceName"];
});

builder.Services.AddSingleton<ISchedulerFactory, StdSchedulerFactory>();
builder.Services.AddScoped<DeactivateOrganizationTaskJob>();
builder.Services.AddScoped<IRedisCacheService, RedisCacheService>();
builder.Services.AddScoped<HashManager>();
builder.Services.AddScoped<PlatensCallContext>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ILogsRepository, LogsRepository>();
builder.Services.AddScoped<IItemsRepository, ItemsRepository>();
builder.Services.AddScoped<IFriendsRepository, FriendsRepository>();
builder.Services.AddScoped<IOrganisationsRepository, OrganisationsRepository>();
builder.Services.AddScoped<IVerificationRepository, VerificationRepository>();
builder.Services.AddScoped<ITasksRepository, TasksRepository>();
builder.Services.AddScoped<EmailSender>();
builder.Services.AddScoped<JwtTokenManager>();
builder.Services.AddScoped<FileService>();
builder.Services.PrepareDatabase();

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtAudience = Environment.GetEnvironmentVariable("WEBSITE_DOMAIN") ?? builder.Configuration.GetSection("Jwt:Audience").Get<string>();
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration.GetSection("Jwt:Key").Get<string>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    if (jwtKey != null)
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
});

// configuring tasks assignment scheduling
builder.Services.AddQuartz(opt =>
{
    var dailyJobKey = JobKey.Create("DailyTasksAssigmentJob"); // make job name
    opt.AddJob<DailyTasksAssigner>(dailyJobKey) // register job
        .AddTrigger(trigger => trigger
            .ForJob(dailyJobKey)
            .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(7, 0)) // execute every day at 7:00 am
        ); 
    
    var weeklyJobKey = JobKey.Create("WeeklyTasksAssigmentJob"); // make job name
    opt.AddJob<WeeklyTasksAssigner>(weeklyJobKey) // register job
        .AddTrigger(trigger => trigger
                .ForJob(weeklyJobKey)
                .WithSchedule(CronScheduleBuilder.WeeklyOnDayAndHourAndMinute(DayOfWeek.Monday, 7, 0)) // every monday at 7:00 am
        );
});
// create instance of job when it's triggered
builder.Services.AddQuartzHostedService(options => options.WaitForJobsToComplete = true);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var schedulerFactory = app.Services.GetService<ISchedulerFactory>();
if (schedulerFactory != null)
{
    var scheduler = await schedulerFactory.GetScheduler();
    await scheduler.Start();
}

//app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
