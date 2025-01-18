using Data.Context;
using Data.Models;

namespace Data.Repository.Log;

public class LogsRepository : ILogsRepository
{
    private readonly PlatensCallContext _context;
    public LogsRepository(PlatensCallContext context)
    {
        this._context = context;
    }

    public List<Logs> GetAttendance(Users user) // get when user used service (used for statistics)
    {
        List<Logs> attendance = _context.Logs.Where(log => log.UserId == user.Id && log.Type == "attendance").Select(log => new Logs
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
        if (!_context.Logs.Any(log =>
                log.UserId == user.Id && log.Type == "attendance" && log.CreatedAt.Date == DateTime.Today)) // check if today's attendance is already marked
        {
            _context.Logs.Add(new Logs()
            {
                Type = "attendance",
                UserId = user.Id,
                Data = "{}",
                CreatedAt = DateTime.Now
            }); // add log

            _context.SaveChanges();
        }
    }
}