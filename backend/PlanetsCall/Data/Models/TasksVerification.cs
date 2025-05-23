﻿using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace Data.Models;

public class TasksVerification
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(300)]
    public required string Proof { get; set; }
    public DateTime CompletedAt { get; set; }
    
    public int ExecutorId { get; set; }
    public required Users Executor { get; set; }
    public int? InspectorId { get; set; }
    public Users? Inspector { get; set; }
    
    public DateTime CheckedAt { get; set; }
    public bool IsApproved { get; set; }
    [MaxLength(300)]
    public string? Message { get; set; }
    
    public int TaskId { get; set; }
    public required Tasks Task { get; set; }
}