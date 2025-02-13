using Data.DTO.Task;
using Data.Models;
using Data.Repository.Community;
using Data.Repository.Task;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Tasks;

/*
 * Tasks are very important part of PlanetsCall project
 * Idea: users get scheduled tasks added earlier by admin or task from organisation (verified only, one per day, fixed reward)
 * Controller here is used to get those tasks and send verification video/photo of completing it
 * so users with higher level check of user complete task correctly or no
 *
 * 1 simple task per day and 1 harder task per week come from admin side
 * admins make templates and scheduled code pick one random every day/week
 */

[ApiController]
[Route("/api/[controller]")]
public class TasksController(ITasksRepository tasksRepository, IOrganisationsRepository organisationsRepository)
    : ControllerBase
{
    [HttpPost]
      [Route("template-task/")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public IActionResult AddTemplateTask([FromBody] TemplateTask task)  // create task (as an admin)
      {
          Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
          
          if (task.Type != 1 && task.Type != 2) // allowed types - 1 or 2
          {
              return BadRequest("Available types: 1 (daily), 2 (weekly)");
          }
          tasksRepository.CreateTask(task, requestUser);

          return Ok();
      }
      
      [HttpGet]
      [Cache]
      [Route("template-task/{id}")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public IActionResult GetTask(int id) // get task by id
      {
          var task = tasksRepository.GetTaskById(id);
          if (task == null)
          {
              return NotFound();
          }
          return Ok(new FullTaskDto(task));
      }
      [HttpGet]
      [Cache]
      [Route("template-task/")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public IActionResult GetTasks() // get all tasks created by admins
      {
          var task = tasksRepository.GetAdminTasks();
          return Ok(task);
      }

      [HttpPut]
      [Route("template-task/{id}")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public IActionResult UpdateTask(int id, [FromBody] TemplateTask taskUpdate) // update admin task
      {
          var updatedTask = tasksRepository.UpdateTask(id, taskUpdate);
          if (updatedTask == null)
          {
              return NotFound();
          }
          return Ok(new FullTaskDto(updatedTask));
      }

      [HttpDelete]
      [Route("template-task/{id}")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status204NoContent)]
      public IActionResult DeleteTask(int id) // delete admin task
      {
          bool isDeleted = tasksRepository.DeleteTask(id);
          if (!isDeleted)
          {
              return NotFound();
          }
          return NoContent();
      }
      
      [HttpPost]
      [Route("organisation-task/{organizationName}/")]
      [TokenAuthorizeFilter]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public IActionResult AddOrganizationTask(string organizationName, [FromBody] TaskInfo task) // create task (as an organization member with rights)
      {
          Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
          try
          {
              Organisations organisation = organisationsRepository.GetObjOrganisation(organizationName);
              // check if user have according permissions
              organisationsRepository.EnsureUserHasPermission(requestUser, organizationName, o => o.CanAddTask);
              
              tasksRepository.CreateTask(task, requestUser, organisation);
          }
          catch (CodeException e)
          {
              return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
          }

          return Ok();
      }
}