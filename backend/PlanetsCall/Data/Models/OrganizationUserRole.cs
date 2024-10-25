using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class OrganizationUserRoles
{
    [Key] public int Id { get; set; }
    public int UserId { get; set; }
    public required Users User { get; set; }

    public int OrganizationId { get; set; }
    public required Organisations Organisation { get; set; }
    
    public int OrganizationRoleId { get; set; }
    public required OrganizationRoles OrganizationRole { get; set; }
}