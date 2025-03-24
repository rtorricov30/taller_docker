using System.ComponentModel.DataAnnotations.Schema;

namespace  api_minimal.Models;

[Table("Course")]
public class Course
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DateCreated { get; set; } = DateTime.Now;
}
