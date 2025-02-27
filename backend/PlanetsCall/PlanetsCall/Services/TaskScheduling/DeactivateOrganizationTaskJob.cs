using Data.Repository.Task;
using Quartz;

namespace PlanetsCall.Services.TaskScheduling;

public class DeactivateOrganizationTaskJob(ITasksRepository tasksRepository) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine("EXEC");
        var taskId = (int)context.JobDetail.JobDataMap.Get("taskId");
        var task = tasksRepository.GetTaskById(taskId);

        if (task != null)
        {
            tasksRepository.DeactivateTask(task);
        }
        Console.WriteLine("COMPLETE");
    }
}