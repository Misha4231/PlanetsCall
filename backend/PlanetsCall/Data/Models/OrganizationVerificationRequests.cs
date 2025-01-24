using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class OrganizationVerificationRequests
{
    [Key] 
    public int Id { get; set; }
    public required int OrganisationId { get; set; }
    public Organisations? Organisation { get; set; }
    [Required]
    [MaxLength(1000)]
    public required string Description { get; set; }
}