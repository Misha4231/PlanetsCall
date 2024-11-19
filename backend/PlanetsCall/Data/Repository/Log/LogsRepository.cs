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

    public List<Logs> GetAttendance(Users user)
    {
        List<Logs> attendance = _context.Logs.Where(log => log.UserId == user.Id && log.Data == "{additionalInfo: \"sign in\"}").Select(log => new Logs
        {
            Id = log.Id,
            Type = log.Type,
            UserId = log.UserId,
            Data = log.Data,
            CreatedAt = log.CreatedAt
        }).ToList();
        
        return attendance;
    }
}