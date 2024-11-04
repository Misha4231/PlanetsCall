using Core.User;
using Data;
using Data.Repository.User;
using PlanetsCall.Helper;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();


builder.Services.RegisterDataServices(builder.Configuration);
builder.Services.AddScoped<HashManager>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<EmailSender>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

app.Run();
