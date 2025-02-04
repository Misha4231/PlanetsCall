using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Data.Context;

public sealed class PlatensCallContext : DbContext
{
    public DbSet<Users> Users { get; set; }
    public DbSet<Organisations> Organizations { get; set; }
    public DbSet<OrganisationRoles> OrganizationRoles { get; set; }
    public DbSet<Achievements> Achievements { get; set; }
    public DbSet<UserAchievements> UserAchievement { get; set; }
    public DbSet<Tasks> Tasks { get; set; }
    public DbSet<TasksVerification> TasksVerification { get; set; }
    public DbSet<Topics> Topics { get; set; }
    public DbSet<TopicComments> TopicComments { get; set; }
    public DbSet<Items> Items { get; set; }
    public DbSet<ItemsCategory> ItemsCategories { get; set; }
    public DbSet<Logs> Logs { get; set; }
    public DbSet<Cities> Cities { get; set; }
    public DbSet<Countries> Countries { get; set; }
    public DbSet<Regions> Regions { get; set; }
    public DbSet<States> States { get; set; }
    public DbSet<Subregions> Subregions { get; set; }
    public DbSet<OrganizationVerificationRequests> OrganizationVerificationRequests { get; set; }

    public PlatensCallContext(DbContextOptions<PlatensCallContext> options) : base(options)
    { 
        //Database.EnsureCreated();
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }
    
    // Configures the entity relationships and database schema using Fluent API.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Autor organizacji
        modelBuilder.Entity<Organisations>()
            .HasOne<Users>(o => o.Creator)
            .WithMany(u => u.OwnedOrganizations)
            .HasForeignKey(o => o.CreatorId)
            .OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder.Entity<Users>()
            .HasMany(u => u.Friends)
            .WithMany(u => u.FriendsOf)
            .UsingEntity(j => j.ToTable("Friends"));

        // Uprawnienia w zespołach
        modelBuilder.Entity<OrganisationRoles>()
            .HasOne<Organisations>(o => o.Organisation)
            .WithMany(o => o.Roles)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<OrganisationRoles>()
            .HasMany<Users>(o => o.UsersWithRole)
            .WithMany(o => o.OrganizationRoles)
            .UsingEntity(t => t.ToTable("OrganizationUserRoles"));
        modelBuilder.Entity<Organisations>()
            .HasMany<Users>(o => o.Requests)
            .WithMany(u => u.RequestedOrganizations)
            .UsingEntity(t => t.ToTable("OrganizationRequests"));
        modelBuilder.Entity<Organisations>()
            .HasMany<Users>(o => o.Members)
            .WithMany(u => u.MyOrganisation)
            .UsingEntity(t => t.ToTable("OrganizationUsers"));
        modelBuilder.Entity<OrganizationVerificationRequests>()
            .HasOne<Organisations>(o => o.Organisation)
            .WithOne(o => o.VerificationRequest);

        // Osiągnięcia
        modelBuilder.Entity<UserAchievements>()
            .HasOne<Achievements>(u => u.Achievement)
            .WithMany(a => a.UserAchievementsCollection)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<UserAchievements>()
            .HasOne<Users>(a => a.User)
            .WithMany(a => a.AchievementsCollection)
            .OnDelete(DeleteBehavior.Cascade);

        // Zadania
        modelBuilder.Entity<Tasks>()
            .HasOne<Users>(t => t.Author)
            .WithMany(u => u.TasksCreatedCollection)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<Tasks>()
            .HasOne<Organisations>(t => t.Organisation)
            .WithMany(u => u.TasksCreatedCollection)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<TasksVerification>()
            .HasOne<Tasks>(v => v.Task)
            .WithMany(t => t.Verifications)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<TasksVerification>()
            .HasOne<Users>(v => v.Executor)
            .WithMany(u => u.TasksCompleted);
        modelBuilder.Entity<TasksVerification>()
            .HasOne<Users>(v => v.Inspector)
            .WithMany(u => u.TasksVerified);
        
        // Topics
        modelBuilder.Entity<Topics>()
            .HasMany<Users>(t => t.UsersLiked)
            .WithMany(u => u.LikedTopics)
            .UsingEntity(j => j.ToTable("TopicLikes"));
        modelBuilder.Entity<Topics>()
            .HasOne<Users>(t => t.Author)
            .WithMany(u => u.CreatedTopics)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<TopicComments>()
            .HasOne<Users>(t => t.Author)
            .WithMany(u => u.TopicCommentsCollection)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<TopicComments>()
            .HasOne<TopicComments>(t => t.AnswerTo)
            .WithMany(u => u.AnswersCollection)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TopicComments>()
            .HasOne<Topics>(t => t.Topic)
            .WithMany(u => u.Comments)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TopicComments>()
            .HasMany<Users>(t => t.UsersLiked)
            .WithMany(t => t.LikedCommentsCollection)
            .UsingEntity(j => j.ToTable("TopicCommentsLikes"));
        
        // Items
        modelBuilder.Entity<Items>()
            .HasMany<Users>(i => i.Owners)
            .WithMany(u => u.ItemsCollection)
            .UsingEntity(j => j.ToTable("UserItems"));
        modelBuilder.Entity<Items>()
            .HasOne<ItemsCategory>(i => i.Category)
            .WithMany(it => it.AttachedItems)
            .OnDelete(DeleteBehavior.SetNull);
        
        // Logs
        modelBuilder.Entity<Logs>()
            .HasOne<Users>(l => l.User)
            .WithMany(u => u.Actions)
            .OnDelete(DeleteBehavior.SetNull);
        
        // World
        modelBuilder.Entity<Users>()
            .HasOne<Cities>(u => u.City)
            .WithMany(c => c.UsersCollection)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<Users>()
            .HasOne<Countries>(u => u.Country)
            .WithMany(c => c.UsersCollection)
            .OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder.Entity<Cities>()
            .HasOne<States>(c => c.State)
            .WithMany(s => s.CitiesCollection)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("cities_country_id_fkey");

        modelBuilder.Entity<Cities>()
            .HasOne<Countries>(c => c.Country)
            .WithMany(co => co.CitiesCollection)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("cities_state_id_fkey");
        
        modelBuilder.Entity<Countries>()
            .HasOne<Regions>(c => c.Region)
            .WithMany(co => co.CountriesCollection)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("countries_region_id_fkey");
        
        modelBuilder.Entity<Countries>()
            .HasOne<Subregions>(c => c.Subregion)
            .WithMany(co => co.CountriesCollection)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("countries_subregion_id_fkey");
        
        modelBuilder.Entity<States>()
            .HasOne<Countries>(s => s.Country)
            .WithMany(c => c.StatesCollection)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("states_country_id_fkey");
        
        modelBuilder.Entity<Subregions>()
            .HasOne<Regions>(s => s.Region)
            .WithMany(r => r.SubregionsCollection)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("subregions_region_id_fkey");
    }
}