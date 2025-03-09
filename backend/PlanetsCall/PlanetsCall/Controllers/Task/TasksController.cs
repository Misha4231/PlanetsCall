using Core;
using Data.DTO.Task;
using Data.Models;
using Data.Repository.Community;
using Data.Repository.Task;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Task;

/**
 * TasksController differentiates with TasksAdministrationController by the thing that this one is used for end-user
 */
[ApiController]
[Route("/api/[controller]")]
public class TasksController (
    ITasksRepository tasksRepository,
    IOrganisationsRepository organisationsRepository,
    FileService fileService,
    ITasksVerificationRepository tasksVerificationRepository) : ControllerBase
{
    [HttpGet]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetActiveTasks() // get tasks that are need to be displayed for current user
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        var activeTasks = tasksRepository.GetActiveTasks(); // get all active tasks
        List<FullTaskDto> tasksToDisplay = new List<FullTaskDto>(); // only filtered ones
        foreach (var task in activeTasks)
        {
            if (task.Organisation != null && !organisationsRepository.IsMember(requestUser!, task.Organisation.Id))
            {
                continue;
            }
            
            tasksToDisplay.Add(new FullTaskDto(task));
        }
        
        return Ok(tasksToDisplay);
    }
    
    [HttpGet("{taskId}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetActiveTask(int taskId) // get task
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        var (task, errorResult) = GetTask(taskId, requestUser!);
        if (errorResult != null) return errorResult;

        return Ok(new FullTaskDto(task!));
    }

    [HttpPost("{taskId}/upload-proof/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult UploadProofOfTask([FromRoute] int taskId, IFormFile file)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        var (task, errorResult) = GetTask(taskId, requestUser!);
        if (errorResult != null) return errorResult;

        // check if the maximum amount of attempts was reached
        var existingVerifications = tasksVerificationRepository.GetVerificationAttempts(taskId, requestUser!.Id);
        if (existingVerifications.Count >= 3)
        {
            return BadRequest("The maximum amount of proofs for this task was already uploaded");
        }
        // there is no sense of adding more proofs if one is approved
        bool isAlreadyApproved = false;
        foreach (var attempt in existingVerifications)
        {
            if (attempt.IsApproved)
            {
                isAlreadyApproved = true;
                break;
            }
        }

        if (isAlreadyApproved)
        {
            return BadRequest("The proof of task is already approved");
        }

        string proofPath;
        try
        {
            // upload proof
            proofPath = fileService.SaveFile(file, "proofs", [".mp4", ".avi", ".png", ".jpg", ".jpeg"], 50);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        // insert data to table
        var verif = tasksVerificationRepository.InsertVerification(new TasksVerification()
        {
            Proof = proofPath,
            CompletedAt = DateTime.Now,
            ExecutorId = requestUser!.Id,
            Executor = requestUser,
            IsApproved = false,
            TaskId = taskId,
            Task = task!
        });
            
        return Ok(new TaskVerificationDto(verif));
    }
    private (Tasks?, IActionResult?) GetTask(int taskId, Users user) // helper function to remove code repetition
    {
        var task = tasksRepository.GetTaskById(taskId);
        if (task == null)
        {
            return (null, NotFound("Task not found"));
        }
        if (!task.IsActive)
        {
            return (null, BadRequest("Task is not active"));
        }
        if (task.Organisation != null && !organisationsRepository.IsMember(user, task.Organisation.Id))
        {
            return (null, BadRequest("Task is not available"));
        }

        return (task, null);
    }

    [HttpGet("completed-tasks/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCompletedTasks([FromQuery] int page = 1)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        return Ok(tasksVerificationRepository.GetCompletedTasks(requestUser!.Id, page));
    }
}