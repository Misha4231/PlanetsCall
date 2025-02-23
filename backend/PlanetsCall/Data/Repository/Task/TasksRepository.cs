using Core;
using Core.User;
using Data.Context;
using Data.DTO.Task;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Task;

// CRUD repository for tasks
public class TasksRepository(PlatensCallContext context, FileService fileService, IConfiguration configuration)
    : RepositoryBase(context, configuration), ITasksRepository
{
    private readonly FileService _fileService = fileService;

    public void CreateTask(TemplateTask task, Users user) // create task (as an admin)
    {
        Context.Tasks.Add(new Tasks()
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
    }

    public void CreateTask(TaskInfo task, Users user, Organisations organisation)// create task (as an organization member with rights)
    {
        Context.Tasks.Add(new Tasks()
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
    }

    public Tasks? GetTaskById(int id) // get task
    {
        return Context.Tasks.Include(t => t.Author).Include(t => t.Organisation).FirstOrDefault(t => t.Id == id);
    }

    public List<Tasks> GetTasksByType(int type)
    {
        return Context.Tasks.Include(t => t.Author).Include(t => t.Organisation).Where(t => t.Type == type).ToList();
    }

    public Tasks? UpdateTask(int id, TemplateTask updatedTask) // update the task with given id
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
        return task;
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
        List<Tasks> tasksList = GetTasksByType(type);

        foreach (Tasks task in tasksList)
        {
            task.IsActive = false;
        }
        
        context.SaveChanges();
    }

    public void ActivateTask(Tasks task) // activate provided task
    {
        task.IsActive = true;
        context.SaveChanges();
    }
}