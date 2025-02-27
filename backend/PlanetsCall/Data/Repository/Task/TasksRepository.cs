using Core;
using Core.User;
using Data.Context;
using Data.DTO.Task;
using Data.DTO.User;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Task;

// CRUD repository for tasks
public class TasksRepository(PlatensCallContext context, FileService fileService, IConfiguration configuration)
    : RepositoryBase(context, configuration), ITasksRepository
{
    private readonly FileService _fileService = fileService;

    public FullTaskDto CreateTask(TemplateTask task, Users user) // create task (as an admin)
    {
        var newTask = Context.Tasks.Add(new Tasks()
        {
            Title = task.Title,
            Description = task.Description,
            CreatedAt = DateTime.Now,
            Reward = task.Reward,
            Author = user,
            Type = task.Type,
            IsGroup = task.IsGroup,
            IsActive = false
        });

        Context.SaveChanges();
        return new FullTaskDto(newTask.Entity);
    }

    public FullTaskDto CreateTask(TaskInfo task, Users user, Organisations organisation)// create task (as an organization member with rights)
    {
        var newTask = Context.Tasks.Add(new Tasks()
        {
            Title = task.Title,
            Description = task.Description,
            CreatedAt = DateTime.Now,
            Reward = 100,
            Author = user,
            Organisation = organisation,
            Type = 3,
            IsGroup = task.IsGroup,
            IsActive = true
        });

        Context.SaveChanges();
        return new FullTaskDto(newTask.Entity);
    }

    public FullTaskDto? GetTaskById(int id) // get task
    {
        return Context.Tasks
            .Where(t => t.Id == id)
            .Include(t => t.Author)
            .Include(t => t.Organisation)
            .Select(t => new FullTaskDto(t))
            .FirstOrDefault();
    }

    public List<FullTaskDto> GetTasksByType(int type)
    {
        return Context.Tasks
            .Where(t => t.Type == type)
            .Include(t => t.Author)
            .Include(t => t.Organisation)
            .Select(t => new FullTaskDto(t))
            .ToList();
    }

    public List<FullTaskDto> GetOrganizationTasks(Organisations organisation)
    {
        return Context.Tasks.Include(t => t.Organisation)
            .Where(t => t.Organisation == organisation)
            .Select(t => new FullTaskDto(t))
            .ToList();
    }

    public FullTaskDto? UpdateTask(int id, TemplateTask updatedTask) // update the task with given id
    {
        var task = Context.Tasks.FirstOrDefault(t => t.Id == id);
        if (task == null)
        {
            return null;
        }

        task.Title = updatedTask.Title;
        task.Description = updatedTask.Description;
        task.Reward = updatedTask.Reward;
        task.Type = updatedTask.Type;
        task.IsGroup = updatedTask.IsGroup;

        Context.SaveChanges();
        return new FullTaskDto(task);
    }

    public bool DeleteTask(int id) // delete the task with given id
    {
        var task = Context.Tasks.FirstOrDefault(t => t.Id == id);
        if (task == null)
        {
            return false;
        }

        Context.Tasks.Remove(task);
        Context.SaveChanges();
        return true;
    }

    // deactivate all tasks with provided type
    public void DeactivateTasksWithType(int type)
    {
        List<FullTaskDto> tasksList = GetTasksByType(type);

        foreach (FullTaskDto task in tasksList)
        {
            task.IsActive = false;
        }
        
        context.SaveChanges();
    }

    public void DeactivateTask(Tasks task)
    {
        task.IsActive = false;
        context.SaveChanges();
    }

    public void DeactivateTask(FullTaskDto task)
    {
        Tasks? dbTask = Context.Tasks.FirstOrDefault(t => t.Id == task.Id);
        DeactivateTask(dbTask);
    }

    public void ActivateTask(Tasks task) // activate provided task
    {
        task.IsActive = true;
        context.SaveChanges();
    }

    public void ActivateTask(FullTaskDto task)
    {
        Tasks? dbTask = Context.Tasks.FirstOrDefault(t => t.Id == task.Id);
        ActivateTask(dbTask);
    }
}