using Data.Models;

namespace Data.Repository.Log;

public interface ILogsRepository
{
    List<Logs> GetAttendance(Users user);
    void AddAttendance(Users user);
}