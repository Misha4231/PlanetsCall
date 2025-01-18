using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Community;

public class FullRoleDto
{
    public FullRoleDto(OrganisationRoles role)
    {
        Id = role.Id;
        Title = role.Title;
        CanDeleteOrganization = role.CanDeleteOrganization;
        CanRemoveUsers = role.CanRemoveUsers;
        CanAcceptUsers = role.CanAcceptUsers;
        CanConfigureOrganization = role.CanConfigureOrganization;
        CanAddTask = role.CanAddTask;
        CanConfigureRoles = role.CanConfigureRoles;
        CanGivePermissions = role.CanGivePermissions;
        CanUpdateTasks = role.CanUpdateTasks;
        CanDeleteTasks = role.CanDeleteTasks;
        Image = role.Image;
        OrganisationId = role.OrganisationId;
        UsersWithRole = role.UsersWithRole?.Select(user => new MinUserDto(user)).ToList() ?? new List<MinUserDto>();
    }
    
    public int Id { get; set; }
    public string? Title { get; set; }
    public bool CanDeleteOrganization { get; set; }
    public bool CanRemoveUsers { get; set; }
    public bool CanAcceptUsers { get; set; }
    public bool CanConfigureOrganization { get; set; }
    public bool CanAddTask { get; set; }
    public bool CanConfigureRoles { get; set; }
    public bool CanGivePermissions { get; set; }
    public bool CanUpdateTasks { get; set; }
    public bool CanDeleteTasks { get; set; }
    public string? Image { get; set; }
    public int OrganisationId { get; set; }
    public ICollection<MinUserDto>? UsersWithRole { get; set; }
}