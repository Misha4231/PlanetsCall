using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Data.Models;
using Microsoft.IdentityModel.Tokens;

namespace PlanetsCall.Helper;

public class JwtTokenManager(IConfiguration configuration)
{
    // generates access token for later use in Authorization header
    public string GenerateToken(Users user)
    {
        // reading essential data from app settings
        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? configuration.GetSection("Jwt:Issuer").Get<string>();
        var jwtAudience = Environment.GetEnvironmentVariable("WEBSITE_DOMAIN") ?? configuration.GetSection("Jwt:Audience").Get<string>();
        var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? configuration.GetSection("Jwt:Key").Get<string>();
            
        // making credentials
        var jwtSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));
        var credentials = new SigningCredentials(jwtSecurityKey, SecurityAlgorithms.HmacSha256);

        if (user.Username != null && user.Email != null)
        {
            var claims = new[] // add claims
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            };
            
            // generate token
            var securityToken = new JwtSecurityToken(jwtIssuer, jwtAudience, claims, expires: DateTime.Now.AddDays(2),
                signingCredentials: credentials);
            // write token
            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
        
            return token;
        }

        return "";
    }
}