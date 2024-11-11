using Core.User;
using Data.Models;
using System.Net;
using System.Net.Mail;

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

        SendMail(receiver, "Planet's Call - Password Reset Request for Your Account", 
            $"Hello {user.Username}!<br><br>" +
            "We received a request to reset the password for your account. If you made this request, " +
            $"please click the link below to set a new password:<br><br>" +
            $"<a href=\"{activationLink}\">{activationLink}</a><br><br>" +
            "For your security, this link will expire in 24 hours. If you didn’t request a password reset, " +
            "please ignore this email; your account remains secure.<br><br>" +
            "Best regards,<br>Planet's Call", 
            isHtml: true);
    }

    public void SendUserConfirmationMail(Users user)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var userHash = _hashManager.Encrypt($"{user.Username}:{timestamp}");
        var activationLink = _configuration["WebsiteDomain"] + "/activation/?code=" + userHash;
        var receiver = user.Email;

        SendMail(receiver, "Planet's Call - Confirm Your Account Activation", 
            $"Hello {user.Username}!<br><br>" +
            "Thank you for registering! To complete your registration, please confirm your email address " +
            "by clicking the link below:<br><br>" +
            $"<a href=\"{activationLink}\">{activationLink}</a><br><br>" +
            "Best regards,<br>Planet's Call", 
            isHtml: true);
    }

    private void SendMail(string receiver, string subject, string content, bool isHtml = false)
    {
        var sender = _configuration.GetSection("SMTP:Username").Get<string>();
        var senderPassword = _configuration.GetSection("SMTP:Password").Get<string>();
        var Hostname = _configuration.GetSection("SMTP:Hostname").Get<string>();
        var Port = _configuration.GetSection("SMTP:Port").Get<int>();

        MailMessage mailMessage = new MailMessage();
        mailMessage.From = new MailAddress(sender);
        mailMessage.To.Add(receiver);
        mailMessage.Subject = subject;
        mailMessage.Body = content;
        mailMessage.IsBodyHtml = isHtml;

        SmtpClient smtpClient = new SmtpClient();
        smtpClient.Host = Hostname;
        smtpClient.Port = Port;
        smtpClient.UseDefaultCredentials = false;
        smtpClient.Credentials = new NetworkCredential(sender, senderPassword);
        smtpClient.EnableSsl = true;

        try
        {
            smtpClient.Send(mailMessage);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}