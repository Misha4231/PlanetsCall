using Core.User;
using Data.Models;
using System.Net;
using System.Net.Mail;

namespace PlanetsCall.Helper;

/*
 * Helper service for mails sending
 * SendForgottenPasswordMail, SendUserConfirmationMail - public methods called inside controllers
 * GenerateLink, SendMail - private helper methods
 */
public class EmailSender(HashManager hashManager, IConfiguration configuration)
{
    // used for hashing used and making code expiring
    // data for constructing mails

    public void SendForgottenPasswordMail(Users user) // sends email when user forgot password and wants to reset it
    { 
        var activationLink = GenerateLink(user, "/change-forgotten-password/?code="); // calling helper method to generate expiring link
        
        // calling helper method to send mail
        SendMail(user.Email, "Planet's Call - Password Reset Request for Your Account", 
            $"Hello {user.Username}!<br><br>" +
            "We received a request to reset the password for your account. If you made this request, " +
            $"please click the link below to set a new password:<br><br>" +
            $"<a href=\"{activationLink}\">{activationLink}</a><br><br>" +
            "For your security, this link will expire in 24 hours. If you didn’t request a password reset, " +
            "please ignore this email; your account remains secure.<br><br>" +
            "Best regards,<br>Planet's Call", 
            isHtml: true);
    }

    public void SendUserConfirmationMail(Users user) // sends email when user wants to register, hence should confirm his mail address
    {
        var activationLink = GenerateLink(user, "/activation/?code=");  // calling helper method to generate expiring link

        // calling helper method to send mail
        SendMail(user.Email, "Planet's Call - Confirm Your Account Activation", 
            $"Hello {user.Username}!<br><br>" +
            "Thank you for registering! To complete your registration, please confirm your email address " +
            "by clicking the link below:<br><br>" +
            $"<a href=\"{activationLink}\">{activationLink}</a><br><br>" +
            "Best regards,<br>Planet's Call", 
            isHtml: true);
    }
    
    
    private string GenerateLink(Users user, string endpoint)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(); // current timestamp to put it inside code and expire when needed
        var userHash = hashManager.Encrypt($"{user.Username}:{timestamp}");
        var link = configuration["WebsiteDomain"] + endpoint + userHash; // constructing link

        return link;
    }
    
    // most important helper method to actually send mails with SMTP server
    private void SendMail(string receiver, string subject, string content, bool isHtml = false)
    {
        var sender = configuration.GetSection("SMTP:Username").Get<string>();
        var senderPassword = configuration.GetSection("SMTP:Password").Get<string>();
        var Hostname = configuration.GetSection("SMTP:Hostname").Get<string>();
        var Port = configuration.GetSection("SMTP:Port").Get<int>();
        
        // Constructing mail body
        MailMessage mailMessage = new MailMessage();
        mailMessage.From = new MailAddress(sender);
        mailMessage.To.Add(receiver);
        mailMessage.Subject = subject;
        mailMessage.Body = content;
        mailMessage.IsBodyHtml = isHtml;
        
        // Configuring SMTP client
        SmtpClient smtpClient = new SmtpClient();
        smtpClient.Host = Hostname;
        smtpClient.Port = Port;
        smtpClient.UseDefaultCredentials = false;
        smtpClient.Credentials = new NetworkCredential(sender, senderPassword);
        smtpClient.EnableSsl = true;

        try
        {
            smtpClient.Send(mailMessage); // sending mail
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}