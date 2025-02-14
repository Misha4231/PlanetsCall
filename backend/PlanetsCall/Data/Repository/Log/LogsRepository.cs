using Core;
using Data.Context;
using Data.Models;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Log;

public class LogsRepository : RepositoryBase, ILogsRepository
{
    public LogsRepository(PlatensCallContext context, IConfiguration configuration) 
        : base(context, configuration) {}

    public List<Logs> GetAttendance(Users user) // get when user used service (used for statistics)
    {
        List<Logs> attendance = Context.Logs.Where(log => log.UserId == user.Id && log.Type == "attendance").Select(log => new Logs
        {
            Id = log.Id,
            Type = log.Type,
            UserId = log.UserId,
            Data = log.Data,
            CreatedAt = log.CreatedAt
        }).ToList();
        
        return attendance;
    }

    public void AddAttendance(Users user) // add attendance today (used for statistics)
    {
<<<<<<< HEAD
        if (!_context.Logs.Any(log =>
=======
        if (!Context.Logs.Any(log =>
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
                log.UserId == user.Id && log.Type == "attendance" && log.CreatedAt.Date == DateTime.Today)) // check if today's attendance is already marked
        {
            Context.Logs.Add(new Logs()
            {
                Type = "attendance",
                UserId = user.Id,
                Data = "{}",
                CreatedAt = DateTime.Now
            }); // add log

            Context.SaveChanges();
        }
    }
}