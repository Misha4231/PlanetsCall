using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Data.Context;

public sealed class PlatensCallContext : DbContext
{
    public DbSet<Users> Users { get; set; }
    public DbSet<Organisations> Organizations { get; set; }
    public DbSet<OrganizationRoles> OrganizationRoles { get; set; }
    public DbSet<OrganizationUserRoles> OrganizationUserRoles { get; set; }
    public DbSet<Achievements> Achievements { get; set; }
    public DbSet<UserAchievements> UserAchievement { get; set; }
    public DbSet<Tasks> Tasks { get; set; }
    public DbSet<TasksVerification> TasksVerification { get; set; }
    public DbSet<Topics> Topics { get; set; }
    public DbSet<TopicComments> TopicComments { get; set; }
    public DbSet<Items> Items { get; set; }

    public PlatensCallContext(DbContextOptions<PlatensCallContext> options) : base(options)
    { 
        Database.EnsureCreated();
    }

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
        modelBuilder.Entity<OrganizationUserRoles>()
            .HasOne<Users>(o => o.User)
            .WithMany(u => u.OrganizationRoles)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<OrganizationUserRoles>()
            .HasOne<Organisations>(o => o.Organisation)
            .WithMany(o => o.UserRolesCollection)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<OrganizationUserRoles>()
            .HasOne<OrganizationRoles>(o => o.OrganizationRole)
            .WithMany(o => o.UserRolesCollection)
            .OnDelete(DeleteBehavior.Cascade);
        
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
            .HasOne<Users>(t => t.User)
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
            .HasOne<Users>(v => v.User)
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
        
        // Logs
        modelBuilder.Entity<Logs>()
            .HasOne<Users>(l => l.User)
            .WithMany(u => u.Actions)
            .OnDelete(DeleteBehavior.SetNull);
    }
}