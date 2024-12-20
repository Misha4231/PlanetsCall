using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Data.Models;
using Microsoft.IdentityModel.Tokens;

namespace PlanetsCall.Helper;

public class JwtTokenManager
{
    private readonly IConfiguration _configuration;
    
    public JwtTokenManager(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Users user)
    {
        var jwtIssuer = _configuration.GetSection("Jwt:Issuer").Get<string>();
        var jwtAudience = _configuration.GetSection("Jwt:Audience").Get<string>();
        var jwtKey = _configuration.GetSection("Jwt:Key").Get<string>();
            
        var jwtSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(jwtSecurityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user!.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
        };
            
        var securityToken = new JwtSecurityToken(jwtIssuer, jwtAudience, claims, expires: DateTime.Now.AddDays(2),
            signingCredentials: credentials);
        var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
        
        return token;
    }
}