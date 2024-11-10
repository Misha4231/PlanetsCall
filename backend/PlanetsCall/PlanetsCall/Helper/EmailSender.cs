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

    public void SendForgottenPasswordMail(Users user)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var userHash = _hashManager.Encrypt($"{user.Username}:{timestamp}");
        var activationLink = _configuration["WebsiteDomain"] + "/change-forgotten-password/?code=" + userHash;
        var receiver = user.Email;

        SendMail(receiver, "Planet's Call - Password Reset Request for Your Account", $"Hello {user.Username}!\n\nWe received a request to reset the password for your account. If you made this request, please click the link below to set a new password: \n\n{activationLink}\n\nFor your security, this link will expire in 24 hours. If you didn’t request a password reset, please ignore this email; your account remains secure.\n\nBest regards,\nPlanet's Call");
    }
    public void SendUserConfirmationMail(Users user)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var userHash = _hashManager.Encrypt($"{user.Username}:{timestamp}");
        var activationLink = _configuration["WebsiteDomain"] + "/activation/?code=" + userHash;
        var receiver = user.Email;

        SendMail(receiver, "Planet's Call - Confirm Your Account Activation", $"Hello {user.Username}!\n\nThank you for registering! To complete your registration, please confirm your email address by clicking the link below: \n\n{activationLink}\n\nBest regards,\nPlanet's Call");
    }

    private void SendMail(string receiver, string subject, string content)
    {
        var sender = _configuration.GetSection("SMTP:Email").Get<string>();
        var senderPassword = _configuration.GetSection("SMTP:Password").Get<string>();
        
        Console.WriteLine(subject);
        Console.WriteLine(content);
        
        //TODO send mail
        return;
    }
}