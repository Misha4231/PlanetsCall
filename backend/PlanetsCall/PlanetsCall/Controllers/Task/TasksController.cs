using Core.Exceptions;
using Data.DTO.Task;
using Data.Models;
using Data.Repository.Community;
using Data.Repository.Task;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Task;

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
public class TasksController(ITasksRepository tasksRepository, IOrganisationsRepository organisationsRepository, IServiceScopeFactory serviceScopeFactory)
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

          if (requestUser != null) tasksRepository.CreateTask(task, requestUser);

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
          return Ok(task);
      }
      [HttpGet]
      [Cache]
      [Route("template-task/")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public IActionResult GetTasks() // get all tasks created by admins (type 1 and 2)
      {
          var tasks = tasksRepository.GetTasksByType(1);
          tasks.AddRange(tasksRepository.GetTasksByType(2));
          return Ok(tasks);
      }
      
      [HttpGet]
      [Cache]
      [Route("organization-task/{organizationName}")]
      [TokenAuthorizeFilter]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status403Forbidden)]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      public IActionResult GetOrganizationTasks(string organizationName) // get all tasks created in organizations (type 3)
      {
          Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
          try
          {
              if (requestUser != null)
                  organisationsRepository.EnsureUserHasPermission(requestUser, organizationName,
                      role => role.CanUpdateTasks);
          }
          catch (CodeException e)
          {
              return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
          }
          
          Organisations organisation = organisationsRepository.GetObjOrganisation(organizationName);
          return Ok(tasksRepository.GetOrganizationTasks(organisation));
      }

      [HttpPut]
      [Route("template-task/{id}")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public IActionResult UpdateTask(int id, [FromBody] TemplateTask taskUpdate) // update admin task
      {
          var updatedTask = tasksRepository.UpdateTask(id, taskUpdate);
          if (updatedTask == null)
          {
              return NotFound();
          }
          return Ok(updatedTask);
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
      [Route("template-task/{id}")]
      [AdminOnlyFilter]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      public IActionResult ActivateTask(int id) // activate admin task
      {
          FullTaskDto? task = tasksRepository.GetTaskById(id);
          if (task is null) return NotFound();
          
          tasksRepository.ActivateTask(task);
          return Ok();
      }
      
      [HttpDelete]
      [Route("organization-task/{organizationName}/{id}")]
      [TokenAuthorizeFilter]
      [ProducesResponseType(StatusCodes.Status403Forbidden)]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      [ProducesResponseType(StatusCodes.Status204NoContent)]
      public IActionResult DeleteOrganizationTask(string organizationName, int id) // delete organization task
      {
          Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
          try
          {
              if (requestUser != null)
                  organisationsRepository.EnsureUserHasPermission(requestUser, organizationName,
                      role => role.CanUpdateTasks);
          }
          catch (CodeException e)
          {
              return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
          }
          
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
      public async Task<IActionResult> AddOrganizationTask(string organizationName, [FromBody] TaskInfo task) // create task (as an organization member with rights)
      {
          Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
          try
          {
              Organisations organisation = organisationsRepository.GetObjOrganisation(organizationName);
              // check if user have according permissions
              if (requestUser != null)
              {
                  organisationsRepository.EnsureUserHasPermission(requestUser, organizationName, o => o.CanAddTask);

                  FullTaskDto newTask = tasksRepository.CreateTask(task, requestUser, organisation); // create task
                  // add background function that will deactivate task after 3 days
                  await ScheduleDeactivateTask(newTask.Id);
              }
          }
          catch (CodeException e)
          {
              return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
          }

          return Ok();
      }
      [HttpPost]
      [Route("organisation-task/{organizationName}/{id}")]
      [TokenAuthorizeFilter]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      public Task<IActionResult> ActivateOrganizationTask(string organizationName, int id) // activate existing task
      {
          Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
          try
          {
              organisationsRepository.GetObjOrganisation(organizationName);
              // check if user have according permissions
              if (requestUser != null)
                  organisationsRepository.EnsureUserHasPermission(requestUser, organizationName, o => o.CanAddTask);

              FullTaskDto? task = tasksRepository.GetTaskById(id);
              if (task is null) return System.Threading.Tasks.Task.FromResult<IActionResult>(NotFound());
              
              tasksRepository.ActivateTask(task); // activate task
              
              // add background function that will deactivate task after 3 days
              ThreadPool.QueueUserWorkItem(async void (_) => await ScheduleDeactivateTask(task.Id));
          }
          catch (CodeException e)
          {
              return System.Threading.Tasks.Task.FromResult<IActionResult>(StatusCode(e.Code ,new ErrorResponse(
                  [e.Message], e.Code, HttpContext.TraceIdentifier)));
          }

          return System.Threading.Tasks.Task.FromResult<IActionResult>(Ok());
      }

      // add background job to deactivate organization task
      private async System.Threading.Tasks.Task ScheduleDeactivateTask(int taskId, CancellationToken token = default(CancellationToken))
      {
          try
          {
              await System.Threading.Tasks.Task.Delay(TimeSpan.FromDays(3), token); // wait 3 days

              using var scope = serviceScopeFactory.CreateScope();
              var repo = scope.ServiceProvider.GetService<ITasksRepository>();
              if (repo == null) return;
                  
              var task = repo.GetTaskById(taskId);
              if (task != null)
              {
                  repo.DeactivateTask(task);
              }
          }
          catch(TaskCanceledException)
          {
          }
      }
}