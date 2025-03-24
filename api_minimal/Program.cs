using api_minimal.Data;
using api_minimal.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/// Agregar DbContext con la cadena de conexión
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

var corsPolicy = "AllowAll";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicy,
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
var app = builder.Build();
app.UseCors(corsPolicy);
app.UseHttpsRedirection();



// 📌 CRUD - Minimal API
app.MapGet("/apitest", () => Results.Ok("Hello world...!"));


// Obtener todos los productos
app.MapGet("/Course-list", async (AppDbContext db) => 
    await db.Course.ToListAsync());

// Obtener un producto por ID
app.MapGet("/Course-search/{id:int}", async (int id, AppDbContext db) =>
    await db.Course.FindAsync(id) is Course course
        ? Results.Ok(course)
        : Results.NotFound());

// Crear un nuevo producto
app.MapPost("/Course", async (Course course, AppDbContext db) =>
{
    db.Course.Add(course);
    await db.SaveChangesAsync();
    return Results.Created($"/Course/{course.Id}", course);
});

// Actualizar un producto
app.MapPut("/Course/{id:int}", async (int id, Course input, AppDbContext db) =>
{
    var course = await db.Course.FindAsync(id);
    if (course is null) return Results.NotFound();

    course.Name = input.Name;
    
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Eliminar un producto
app.MapDelete("/Course/{id:int}", async (int id, AppDbContext db) =>
{
    var course = await db.Course.FindAsync(id);
    if (course is null) return Results.NotFound();

    db.Course.Remove(course);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
