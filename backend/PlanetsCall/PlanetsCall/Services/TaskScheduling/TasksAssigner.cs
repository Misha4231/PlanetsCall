using Data.DTO.Task;
using Data.Models;
using Data.Repository.Task;
using Quartz;

namespace PlanetsCall.Services.TaskScheduling;

/*
 * Base class for assigning tasks
 */
public class TasksAssigner(ITasksRepository tasksRepository, int tasksType) : IJob
{
    private readonly int _tasksType = tasksType;
    private static readonly Random Random = new Random();
    
    public Task Execute(IJobExecutionContext context)
    {
        tasksRepository.DeactivateTasksWithType(_tasksType); // deactivate tasks
        
        List<Tasks> taskTemplates = tasksRepository.GetTasksByType(_tasksType);
        if (taskTemplates.Count > 0) // if there is a tasks with of type
        {
            int randomIdx = Random.Next(taskTemplates.Count); // get random task
            tasksRepository.ActivateTask(taskTemplates[randomIdx]); // activate picked task
        }
        
        return Task.CompletedTask;
    }
}