using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Community;

public class FullRoleDto (OrganisationRoles role)
{
    public int Id { get; set; } = role.Id;
    public string? Title { get; set; } = role.Title;
    public bool CanDeleteOrganization { get; set; } = role.CanDeleteOrganization;
    public bool CanRemoveUsers { get; set; } = role.CanRemoveUsers;
    public bool CanAcceptUsers { get; set; } = role.CanAcceptUsers;
    public bool CanConfigureOrganization { get; set; } = role.CanConfigureOrganization;
    public bool CanAddTask { get; set; } = role.CanAddTask;
    public bool CanConfigureRoles { get; set; } = role.CanConfigureRoles;
    public bool CanGivePermissions { get; set; } = role.CanGivePermissions;
    public bool CanUpdateTasks { get; set; } = role.CanUpdateTasks;
    public bool CanDeleteTasks { get; set; } = role.CanDeleteTasks;
    public string? Image { get; set; } = role.Image;
    public int OrganisationId { get; set; } = role.OrganisationId;
    public ICollection<MinUserDto>? UsersWithRole { get; set; } =
        (role.UsersWithRole ?? throw new InvalidOperationException()).Select(user => new MinUserDto(user)).ToList();
}