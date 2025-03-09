using Data.DTO.Task;
using Data.Models;
using Data.Repository.Task;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Filters;
using Quartz.Util;

namespace PlanetsCall.Controllers.Task;

// Controller for users with higher Level and ability to check completed tasks
[ApiController]
[Route("/api/[controller]/")]
public class OverwatchController (ITasksVerificationRepository tasksVerificationRepository, IUsersRepository usersRepository) : ControllerBase
{
    [HttpPost("reaction/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult AddReaction(VerificationReactionDto verificationReaction) // add reaction to the task verification request (approve/reject)
    {
        var requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        if (requestUser!.Progress < 5 && !requestUser.IsAdmin)
        {
            return BadRequest("Only users with Level grater than 5 can check tasks.");
        }
        if (!verificationReaction.Reaction && verificationReaction.Message.IsNullOrWhiteSpace())
        {
            return BadRequest("Reaction message can't be empty in case you are rejecting.");
        }

        var taskVerification = tasksVerificationRepository.GetVerification(verificationReaction.VerificationId);
        if (taskVerification == null) return NotFound("No verification found");
        // only an assigned inspector can add reaction
        if (taskVerification.InspectorId != requestUser.Id)
        {
            return BadRequest("You are not an inspector of this verification request.");
        }
        
        var attempts = tasksVerificationRepository.GetVerificationAttempts(taskVerification.TaskId, taskVerification.ExecutorId);
        // check if one is already approved
        bool isAlreadyApproved = false;
        bool allAttemptsHasInspectorAssigned = true; // used later
        foreach (var attempt in attempts)
        {
            if (attempt.IsApproved)
            {
                isAlreadyApproved = true;
            }

            if (attempt.InspectorId == null)
            {
                allAttemptsHasInspectorAssigned = false;
            }
        }

        if (isAlreadyApproved)
        {
            return BadRequest("One of the proofs of task is already approved");
        }
        if (taskVerification.CheckedAt != DateTime.MinValue) return BadRequest("You are already checked in this task.");
        
        tasksVerificationRepository.AddFeedback(verificationReaction);

        // if user uploaded bad proofs 3 times
        if (!verificationReaction.Reaction && allAttemptsHasInspectorAssigned && attempts.Count == 2 /*not it's 3*/)
        {
            usersRepository.UpdateUserPoints(taskVerification.ExecutorId, -20);
        }
        else
        {
            usersRepository.UpdateUserPoints(taskVerification.ExecutorId, taskVerification.Task.Reward); // give reward
        }
        tasksVerificationRepository.Save();
        
        return Ok();
    }

    [HttpGet("feed/")]
    [TokenAuthorizeFilter]
    [UserCache]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetFeed([FromQuery] int page = 1) // returns paginated list of pending verifications
    {
        var requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        return Ok(tasksVerificationRepository.GetPendingVerifications(requestUser!.Id, page));
    }
    
    [HttpGet("feed/{verificationId}")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetTaskVerification(int verificationId) // returns a pending verifications and marks request user as an inspector to ensure the lack of conflicts
    {
        var requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        if (requestUser!.Progress < 5 && !requestUser.IsAdmin)
        {
            return BadRequest("Only users with Level grater than 5 can check tasks.");
        }
        
        var taskVerification = tasksVerificationRepository.GetVerification(verificationId);
        if (taskVerification == null) return NotFound("No verification found");
        
        if (taskVerification.ExecutorId == requestUser!.Id) return BadRequest("You are can't check your tasks");
        if (taskVerification.InspectorId != null && taskVerification.InspectorId != requestUser!.Id) return BadRequest("You are not an inspector of this verification request.");
        
        tasksVerificationRepository.AssignInspector(verificationId, requestUser!.Id);
        
        return Ok(new TaskVerificationDto(taskVerification));
    }
}