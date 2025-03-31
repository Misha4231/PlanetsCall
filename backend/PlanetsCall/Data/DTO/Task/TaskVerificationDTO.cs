using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Task;

public class TaskVerificationDto(TasksVerification taskVerification)
{
    public int Id { get; set; } = taskVerification.Id;
    public string? Proof { get; set; } = taskVerification.Proof;
    public DateTime CompletedAt { get; set; } = taskVerification.CompletedAt;

    public int ExecutorId { get; set; } = taskVerification.ExecutorId;
    public MinUserDto? Executor { get; set; } = new MinUserDto(taskVerification.Executor);
    public int? InspectorId { get; set; } = taskVerification.InspectorId;
    public MinUserDto? Inspector { get; set; } = taskVerification.Inspector != null ? new MinUserDto(taskVerification.Inspector) : null;
    
    public DateTime CheckedAt { get; set; } = taskVerification.CheckedAt;
    public bool IsApproved { get; set; }  = taskVerification.IsApproved;
    public string? Message { get; set; } = taskVerification.Message;
    
    public int TaskId { get; set; } = taskVerification.TaskId;
    public FullTaskDto? Task { get; set; } =  new FullTaskDto(taskVerification.Task);
}