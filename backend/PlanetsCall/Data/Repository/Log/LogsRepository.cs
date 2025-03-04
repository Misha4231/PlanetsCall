using Core;
using Data.Context;
using Data.Models;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Log;

public class LogsRepository(PlatensCallContext context, IConfiguration configuration)
    : RepositoryBase(context, configuration), ILogsRepository
{
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
        if (!Context.Logs.Any(log =>
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