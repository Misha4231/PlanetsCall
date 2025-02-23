using Data.DTO.Task;
using Data.Models;

namespace Data.Repository.Task;

public interface ITasksRepository
{
    void CreateTask(TemplateTask task, Users user);
    void CreateTask(TaskInfo task, Users user, Organisations organisation);
    public Tasks? GetTaskById(int id);
    public List<Tasks> GetTasksByType(int type);
    public Tasks? UpdateTask(int id, TemplateTask updatedTask);
    public bool DeleteTask(int id);
    public void DeactivateTasksWithType(int type);
    public void ActivateTask(Tasks task);
}