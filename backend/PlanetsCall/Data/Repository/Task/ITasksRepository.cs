using Data.DTO.Task;
using Data.Models;

namespace Data.Repository.Task;

public interface ITasksRepository
{
    Tasks CreateTask(TemplateTask task, Users user);
    Tasks CreateTask(TaskInfo task, Users user, Organisations organisation);
    public Tasks? GetTaskById(int id);
    public List<Tasks> GetTasksByType(int type);
    public List<Tasks> GetActiveTasks();
    public List<Tasks> GetOrganizationTasks(Organisations organisation);
    public Tasks? UpdateTask(int id, TemplateTask updatedTask);
    public bool DeleteTask(int id);
    public void DeactivateTasksWithType(int type);
    public void DeactivateTask(Tasks task);
    public void ActivateTask(Tasks task);
}