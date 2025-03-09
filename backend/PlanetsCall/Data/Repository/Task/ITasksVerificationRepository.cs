using Data.DTO.Global;
using Data.DTO.Task;
using Data.Models;

namespace Data.Repository.Task;

public interface ITasksVerificationRepository
{
    TasksVerification InsertVerification(TasksVerification tasksVerification);
    List<TasksVerification> GetVerificationAttempts(int taskId, int executorId);
    PaginatedList<TaskVerificationDto> GetCompletedTasks(int executorId, int page);
    PaginatedList<TaskVerificationDto> GetPendingVerifications(int inspectorId, int page);
    TasksVerification? GetVerification(int id);
    void AssignInspector(int verificationId, int userId);
    void AddFeedback(VerificationReactionDto tasksVerification);
    void Save();
}