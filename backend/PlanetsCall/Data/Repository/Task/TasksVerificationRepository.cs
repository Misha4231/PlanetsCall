using Data.Context;
using Data.DTO.Global;
using Data.DTO.Task;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Task;

public class TasksVerificationRepository(PlatensCallContext context, IConfiguration configuration) : RepositoryBase(context, configuration), ITasksVerificationRepository
{
    public TasksVerification InsertVerification(TasksVerification tasksVerification) // insert given verification to the table
    {
        EntityEntry<TasksVerification> verification = Context.TasksVerification.Add(tasksVerification);
        Context.SaveChanges();
        
        return verification.Entity;
    }
    
    public List<TasksVerification> GetVerificationAttempts(int taskId, int executorId) // get all verifications of executorId user in taskId task
    {
        return Context.TasksVerification.Where(t => t.TaskId == taskId && t.ExecutorId == executorId).ToList();
    }

    public PaginatedList<TaskVerificationDto> GetCompletedTasks(int executorId, int page) // returns paginated list of competed and approved tasks by user
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();
        var taskVerifs = Context.TasksVerification
            .OrderBy(t => t.CompletedAt)
            .Where(t => t.ExecutorId == executorId && t.IsApproved)
            .Include(t => t.Task)
            .Select(t => new TaskVerificationDto(t));
        
        var paginated = taskVerifs.Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = taskVerifs.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<TaskVerificationDto>(paginated, page, totalPages);
    }

    public PaginatedList<TaskVerificationDto> GetPendingVerifications(int inspectorId, int page) // returns paginated list or verifications to check
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();
        var taskVerifs = Context.TasksVerification
            .OrderBy(t => t.CompletedAt)
            .Include(t => t.Executor)
            .Where(t => (t.InspectorId == null || (t.InspectorId == inspectorId && t.CheckedAt == DateTime.MinValue)) && t.ExecutorId != inspectorId)
            .Include(t => t.Task)
            .Select(t => new TaskVerificationDto(t));
        
        var paginated = taskVerifs.Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = taskVerifs.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<TaskVerificationDto>(paginated, page, totalPages);
    }

    public TasksVerification? GetVerification(int id)
    {
        return Context.TasksVerification
            .Include(t => t.Inspector)
            .Include(t => t.Executor)
            .Include(t => t.Task)
            .FirstOrDefault(t => t.Id == id);
    }

    public void AssignInspector(int verificationId, int userId) // assign user as an inspector in verification
    {
        var verif = GetVerification(verificationId);
        if (verif == null) return;
        
        verif.InspectorId = userId;
        Context.SaveChanges();
    }

    public void AddFeedback(VerificationReactionDto tasksVerification)
    {
        var verif = GetVerification(tasksVerification.VerificationId);
        if (verif == null) return;
        
        verif.Message = tasksVerification.Message;
        verif.IsApproved = tasksVerification.Reaction;
        verif.CheckedAt = DateTime.Now;
        
        Context.SaveChanges();
    }

    public void Save()
    {
        context.SaveChanges();
    }
}