using Data.Repository.Task;

namespace PlanetsCall.Services.TaskScheduling;

/*
 *  class will be called every day to deactivate old tasks and activate new random
 *  every 1 day - easy task
 */
public class DailyTasksAssigner(ITasksRepository tasksRepository) : TasksAssigner(tasksRepository, 1) // with the type = 1
{
    
}