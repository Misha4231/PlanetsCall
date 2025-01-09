using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Community;

public class OrganisationUpdateFormDto : OrganisationFormDto
{
    [Key]
    public int Id { get; set; }
}