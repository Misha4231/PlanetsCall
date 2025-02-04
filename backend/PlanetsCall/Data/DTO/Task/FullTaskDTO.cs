using System.ComponentModel.DataAnnotations;
using Data.DTO.Community;
using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Task;

public class FullTaskDto : TemplateTask
{
    public FullTaskDto(Tasks task)
    {
        this.Id = task.Id;
        this.CreatedAt = task.CreatedAt;
        this.IsActive = task.IsActive;
        if (task.Author is not null) this.Author = new MinUserDto(task.Author);
        if (task.Organisation is not null) this.Organisation = new MinOrganisationDto(task.Organisation);
        
        this.Title = task.Title;
        this.Description = task.Description;
        this.Reward = task.Reward;
        this.Type = task.Type;
        this.IsGroup = task.IsGroup;
    }

    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
    
    public MinUserDto? Author { get; set; }
    public MinOrganisationDto? Organisation { get; set; }
}

public class TemplateTask : TaskInfo
{
    public int Reward { get; set; }
    public int Type { get; set; }
}

public class TaskInfo
{
    [MaxLength(250)] 
    public string? Title { get; set; }
    [MaxLength(500)] 
    public string? Description { get; set; }
    public bool IsGroup { get; set; }
}