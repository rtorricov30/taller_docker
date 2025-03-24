using Microsoft.EntityFrameworkCore;
using api_minimal.Models;

namespace api_minimal.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Course> Course { get; set; }
}
