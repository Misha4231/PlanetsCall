using Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllersWithViews();
builder.Services.RegisterDataServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

/*
using (var scope = app.Services.CreateScope())
{
    var worldContext = scope.ServiceProvider.GetRequiredService<WorldDbContext>();
    var city = worldContext.Cities.SingleOrDefault(c => c.Id == 1);
    if (city != null)
    {
        Console.WriteLine(city.Name);
    }
    else
    {
        Console.WriteLine("City with Id 1 was not found.");
    }
}
*/

app.Run();
