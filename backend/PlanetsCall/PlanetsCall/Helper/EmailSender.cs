using Core.User;
using Data.Models;

namespace PlanetsCall.Helper;

public class EmailSender
{
    private readonly HashManager _hashManager;
    private readonly IConfiguration _configuration;
    public EmailSender(HashManager hashManager, IConfiguration configuration)
    {
        this._hashManager = hashManager;
        this._configuration = configuration;
    }

    public void SendUserConfirmationEmail(Users user)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var userHash = _hashManager.Encrypt($"{user.Username}:{timestamp}");
        var activationLink = _configuration["WebsiteDomain"] + "/activation/?code=" + userHash;
        
        var receiver = user.Email;
        var sender = _configuration["SMTP_Email"];
        var senderPassword = _configuration["SMTP_Password"];
        
        Console.WriteLine(activationLink);
        //TODO send activation mail
    }
}