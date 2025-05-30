﻿using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Community;

public class RolesFormDto
{
    [MaxLength(250)]
    [Required]
    public required string Title { get; set; }
    public bool CanDeleteOrganization { get; set; }
    public bool CanRemoveUsers { get; set; }
    public bool CanAcceptUsers { get; set; }
    public bool CanConfigureOrganization { get; set; }
    public bool CanAddTask { get; set; }
    public bool CanConfigureRoles { get; set; }
    public bool CanGivePermissions { get; set; }
    public bool CanUpdateTasks { get; set; }
    public bool CanDeleteTasks { get; set; }
    [MaxLength(300)]
    public string? Image { get; set; }
}