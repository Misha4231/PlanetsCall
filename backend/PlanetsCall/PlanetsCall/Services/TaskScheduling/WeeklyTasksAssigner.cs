using Data.Repository.Task;

namespace PlanetsCall.Services.TaskScheduling;

/*
 *  class will be called every week to deactivate old tasks and activate new random
 *  every 7 days - hard task
 */
public class WeeklyTasksAssigner(ITasksRepository tasksRepository) : TasksAssigner(tasksRepository, 2) // with the type = 2
{
}