using Data.DTO.Task;
using Data.Models;

namespace Data.Repository.Task;

public interface ITasksRepository
{
    FullTaskDto CreateTask(TemplateTask task, Users user);
    FullTaskDto CreateTask(TaskInfo task, Users user, Organisations organisation);
    public FullTaskDto? GetTaskById(int id);
    public List<FullTaskDto> GetTasksByType(int type);
    public List<FullTaskDto> GetOrganizationTasks(Organisations organisation);
    public FullTaskDto? UpdateTask(int id, TemplateTask updatedTask);
    public bool DeleteTask(int id);
    public void DeactivateTasksWithType(int type);
    public void DeactivateTask(Tasks task);
    public void DeactivateTask(FullTaskDto task);
    public void ActivateTask(Tasks task);
    public void ActivateTask(FullTaskDto task);
}