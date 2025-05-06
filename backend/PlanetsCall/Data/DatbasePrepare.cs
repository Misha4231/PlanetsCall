using Data.Models;
using Data.Repository.User;
using Microsoft.Extensions.DependencyInjection;
using Data.Context;

namespace Data;

// service that will update the database and add admin user to Users table if not exist
public static class DatabasePrepare
{
    public static IServiceCollection CreateDefaultAdmin(this IServiceCollection services)
    {
        var isMigrationMode = Environment.GetEnvironmentVariable("RUNNING_MIGRATIONS");
        if (isMigrationMode == "true")
        {
            return services;
        }
        using (var scope = services.BuildServiceProvider().CreateScope())
        {
            // create default admin
            var adminUsername = Environment.GetEnvironmentVariable("POSTGRES_USER");
            var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
            if (adminUsername != null && password != null) // app have default admin
            {
                var userRepo = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
                var existingAdmin = userRepo.GetUserByUsername(adminUsername);
                if (existingAdmin == null)
                {
                    // insert admin
                    userRepo.InsertUser(new Users()
                    {
                        Username = adminUsername,
                        Password = password,
                        Email = "admin@admin.com",
                        PreferredLanguage = "en",
                        AccountType = 0,
                        Status = "online",
                        IsAdmin = true,
                        IsActivated = true
                    });
                }
            }
        }
        
        return services;
    }

    public static IServiceCollection SeedData(this IServiceCollection services) {
        var isMigrationMode = Environment.GetEnvironmentVariable("RUNNING_MIGRATIONS");
        if (isMigrationMode == "true")
        {
            return services;
        }
        using (var scope = services.BuildServiceProvider().CreateScope()) {
            var context = scope.ServiceProvider.GetRequiredService<PlatensCallContext>(); // get full context to add data to multiple tables
            var userRepo = scope.ServiceProvider.GetRequiredService<IUsersRepository>();

            // add users
            var users = new List<Users>
            {
                new Users
                {
                    Email = "example_mail@gmail.com",
                    Username = "rediter",
                    AccountType = 0,
                    IsActivated = true,
                    IsBlocked = false,
                    FirstName = "Mark",
                    LastName = "Redditer",
                    BirthDate = new DateTime(2000, 10, 3),
                    Points = 500,
                    Password = "some_pass123",
                    ProfileImage = "profile_icons/avatar3.jpg",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    LastLogin = DateTime.Now,
                    IsAdmin = false,
                    PreferredLanguage = "pl",
                    IsNotifiable = true,
                    IsVisible = true,
                    Description = "",
                    Status = "active",
                    InstagramLink = "",
                    LinkedinLink = "",
                    YoutubeLink = "",
                    MailsSubscribed = false,
                    SingleTasksCompleted = 3,
                    GroupTasksCompleted = 2
                },
                new Users
                {
                    Email = "anna.doe@example.com",
                    Username = "annadoe",
                    AccountType = 1,
                    IsActivated = true,
                    IsBlocked = false,
                    FirstName = "Anna",
                    LastName = "Doe",
                    BirthDate = new DateTime(1995, 4, 20),
                    Points = 1200,
                    Password = "password456",
                    ProfileImage = "profile_icons/avatar1.jpg",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    LastLogin = DateTime.Now,
                    IsAdmin = false,
                    PreferredLanguage = "en",
                    IsNotifiable = true,
                    IsVisible = true,
                    Description = "Tech enthusiast",
                    Status = "active",
                    InstagramLink = "https://instagram.com/annadoe",
                    LinkedinLink = "https://linkedin.com/in/annadoe",
                    YoutubeLink = "",
                    MailsSubscribed = true,
                    SingleTasksCompleted = 5,
                    GroupTasksCompleted = 4
                },
                new Users
                {
                    Email = "john.smith@example.com",
                    Username = "johnny",
                    AccountType = 0,
                    IsActivated = true,
                    IsBlocked = false,
                    FirstName = "John",
                    LastName = "Smith",
                    BirthDate = new DateTime(1990, 12, 15),
                    Points = 800,
                    Password = "johnspass789",
                    ProfileImage = "profile_icons/avatar2.jpg",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    LastLogin = DateTime.Now,
                    IsAdmin = false,
                    PreferredLanguage = "en",
                    IsNotifiable = false,
                    IsVisible = true,
                    Description = "Loves open source",
                    Status = "active",
                    InstagramLink = "",
                    LinkedinLink = "https://linkedin.com/in/johnsmith",
                    YoutubeLink = "https://youtube.com/c/johnsmith",
                    MailsSubscribed = false,
                    SingleTasksCompleted = 7,
                    GroupTasksCompleted = 5
                },
                new Users
                {
                    Email = "karolina.kowalska@example.com",
                    Username = "karokowa",
                    AccountType = 2,
                    IsActivated = true,
                    IsBlocked = false,
                    FirstName = "Karolina",
                    LastName = "Kowalska",
                    BirthDate = new DateTime(1998, 6, 10),
                    Points = 950,
                    Password = "karosecret321",
                    ProfileImage = "profile_icons/avatar4.jpg",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    LastLogin = DateTime.Now,
                    IsAdmin = false,
                    PreferredLanguage = "pl",
                    IsNotifiable = true,
                    IsVisible = false,
                    Description = "",
                    Status = "active",
                    InstagramLink = "https://instagram.com/karokowa",
                    LinkedinLink = "",
                    YoutubeLink = "",
                    MailsSubscribed = true,
                    SingleTasksCompleted = 10,
                    GroupTasksCompleted = 6
                }
            };
            for (int i = 0; i < users.Count; i++) {
                if (!context.Users.Any(u => u.Email == users[i].Email)) {
                    var u = userRepo.InsertUser(users[i]);
                    if (u != null) users[i] = u;
                }
            }

            // add organizations
            var creator = context.Users.First(u => u.Username == "karokowa");
            var member1 = context.Users.First(u => u.Username == "johnny");
            var member2 = context.Users.First(u => u.Username == "annadoe");
            
            var organisations = new List<Organisations>
            {
                new Organisations
                {
                    Name = "EcoTech Alliance",
                    UniqueName = "ecotech-alliance",
                    Description = "Promoting sustainable technology and clean innovation.",
                    IsVerified = true,
                    OrganizationLogo = "organisations/org_logo0.png",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    InstagramLink = "https://instagram.com/ecotech",
                    LinkedinLink = "https://linkedin.com/company/ecotech",
                    YoutubeLink = "",
                    IsPrivate = false,
                    MinimumJoinLevel = 1,
                    CreatorId = creator.Id,
                    Creator = creator,
                    Members = new List<Users> { member1 }
                },
                new Organisations
                {
                    Name = "Green Youth Network",
                    UniqueName = "green-youth",
                    Description = "Empowering young people to lead local green initiatives.",
                    IsVerified = false,
                    OrganizationLogo = "organisations/org_logo1.png",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    InstagramLink = "",
                    LinkedinLink = "",
                    YoutubeLink = "",
                    IsPrivate = true,
                    MinimumJoinLevel = 0,
                    CreatorId = member1.Id,
                    Creator = member1,
                    Members = new List<Users> { member2 }
                },
                new Organisations
                {
                    Name = "Plastic-Free Future",
                    UniqueName = "plastic-free",
                    Description = "Campaigning for reduced plastic use in local communities.",
                    IsVerified = true,
                    OrganizationLogo = "organisations/org_logo2.png",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    InstagramLink = "https://instagram.com/plasticfree",
                    LinkedinLink = "",
                    YoutubeLink = "https://youtube.com/plasticfree",
                    IsPrivate = false,
                    MinimumJoinLevel = 2,
                    CreatorId = member2.Id,
                    Creator = member2,
                    Members = new List<Users> {  }
                },
                new Organisations
                {
                    Name = "ReForest Earth",
                    UniqueName = "reforest-earth",
                    Description = "Global and local tree-planting and reforestation projects.",
                    IsVerified = false,
                    OrganizationLogo = "organisations/org_logo3.png",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    InstagramLink = "",
                    LinkedinLink = "https://linkedin.com/company/reforest",
                    YoutubeLink = "",
                    IsPrivate = true,
                    MinimumJoinLevel = 1,
                    CreatorId = creator.Id,
                    Creator = creator,
                    Members = new List<Users> { member2 }
                }
            };
            for (int i = 0; i < organisations.Count; i++) {
                if (!context.Organizations.Any(o => o.UniqueName == organisations[i].UniqueName)) {
                    var o = context.Organizations.Add(organisations[i]);
                    if (o != null) organisations[i] = o.Entity;
                }
            }
            context.SaveChanges();

            // add tasks
            var tasks = new List<Tasks>
            {
                new Tasks
                {
                    Title = "Posadź drzewo",
                    Description = "Posadź drzewo w swojej okolicy lub ogrodzie i prześlij zdjęcie jako dowód.",
                    CreatedAt = DateTime.Now,
                    Reward = 100,
                    Type = 1,
                    IsGroup = false,
                    IsActive = true
                },
                new Tasks
                {
                    Title = "Sprzątanie osiedla",
                    Description = "Zorganizuj lub dołącz do lokalnej akcji sprzątania śmieci.",
                    CreatedAt = DateTime.Now,
                    Reward = 150,
                    Type = 2,
                    IsGroup = false,
                    IsActive = true
                },
                new Tasks
                {
                    Title = "Załóż kompostownik",
                    Description = "Załóż kompostownik w domu i udokumentuj jego użycie.",
                    CreatedAt = DateTime.Now,
                    Reward = 80,
                    Type = 1,
                    IsGroup = false,
                    IsActive = false
                },
                new Tasks
                {
                    Title = "Rower zamiast samochodu",
                    Description = "Korzystaj z roweru zamiast samochodu przez co najmniej 3 dni w tygodniu.",
                    CreatedAt = DateTime.Now,
                    Reward = 70,
                    Type = 2,
                    IsGroup = false,
                    IsActive = true
                },
                new Tasks
                {
                    Title = "Stwórz punkt segregacji",
                    Description = "Utwórz system segregacji odpadów w domu, szkole lub pracy.",
                    CreatedAt = DateTime.Now,
                    Reward = 90,
                    Type = 2,
                    IsGroup = false,
                    IsActive = false
                },
                new Tasks
                {
                    Title = "Tydzień bez plastiku",
                    Description = "Przeżyj cały tydzień bez używania jednorazowych tworzyw sztucznych.",
                    CreatedAt = DateTime.Now,
                    Reward = 120,
                    Type = 2,
                    IsGroup = false,
                    IsActive = false
                },
                new Tasks
                {
                    Title = "Edukacja ekologiczna",
                    Description = "Zorganizuj krótkie spotkanie online lub stwórz treść edukacyjną na temat ekologii.",
                    CreatedAt = DateTime.Now,
                    Reward = 110,
                    Type = 1,
                    IsGroup = false,
                    IsActive = false
                },
                new Tasks
                {
                    Title = "Oddaj stare ubrania",
                    Description = "Oddaj nieużywane ubrania zamiast je wyrzucać.",
                    CreatedAt = DateTime.Now,
                    Reward = 60,
                    Type = 1,
                    IsGroup = false,
                    IsActive = false
                },
                new Tasks
                {
                    Title = "Zamień na ekologiczne produkty",
                    Description = "Zastąp 3 codzienne produkty ekologicznymi odpowiednikami.",
                    CreatedAt = DateTime.Now,
                    Reward = 90,
                    Type = 1,
                    IsGroup = false,
                    IsActive = false
                },
                new Tasks
                {
                    Title = "Dołącz do akcji sadzenia drzew",
                    Description = "Weź udział w zorganizowanej akcji sadzenia drzew.",
                    CreatedAt = DateTime.Now,
                    Reward = 130,
                    Type = 2,
                    IsGroup = false,
                    IsActive = false
                }
            };
            for (int i = 0; i < tasks.Count; i++) {
                if (!context.Tasks.Any(o => o.Title == tasks[i].Title)) {
                    var t = context.Tasks.Add(tasks[i]);
                    if (t != null) tasks[i] = t.Entity;
                }
            }
            context.SaveChanges();

            // add categories
            var itemCategories = new List<ItemsCategory>
            {
                new ItemsCategory
                {
                    Title = "Hełmy",
                    CreatedAt = DateTime.Now,
                    Image = "items/helms.png"
                },
                new ItemsCategory
                {
                    Title = "Kostiumy bez hełmów",
                    CreatedAt = DateTime.Now,
                    Image = "items/partial_costumes.png"
                },
                new ItemsCategory
                {
                    Title = "Kostiumy całe",
                    CreatedAt = DateTime.Now,
                    Image = "items/full_costumes.png"
                },
                new ItemsCategory
                {
                    Title = "Koszulki",
                    CreatedAt = DateTime.Now,
                    Image = "items/shirts.png"
                },
                new ItemsCategory
                {
                    Title = "Spodnie",
                    CreatedAt = DateTime.Now,
                    Image = "items/pants.png"
                },
                new ItemsCategory
                {
                    Title = "Buty",
                    CreatedAt = DateTime.Now,
                    Image = "items/shoes.png"
                },
                new ItemsCategory
                {
                    Title = "Opaski i dodatki",
                    CreatedAt = DateTime.Now,
                    Image = "items/accessories.png"
                },
                new ItemsCategory
                {
                    Title = "Soczewki",
                    CreatedAt = DateTime.Now,
                    Image = "items/lenses.png"
                },
                new ItemsCategory
                {
                    Title = "Spódnice",
                    CreatedAt = DateTime.Now,
                    Image = "items/skirts.png"
                },
                new ItemsCategory
                {
                    Title = "Top",
                    CreatedAt = DateTime.Now,
                    Image = "items/tops.png"
                }
            };
            for (int i = 0; i < itemCategories.Count; i++) {
                if (!context.ItemsCategories.Any(o => o.Title == itemCategories[i].Title)) {
                    var t = context.ItemsCategories.Add(itemCategories[i]);
                    if (t != null) itemCategories[i] = t.Entity;
                }
            }
            context.SaveChanges();

            // add items
            var items = new List<Items>
            {
                new Items { Title = "Astronauta", Price = 166, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/helmy/astronauta.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Farmer", Price = 94, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postacie/helmy/farmer.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Helm rycerz", Price = 191, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postacie/helmy/helm_rycerz.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Robot", Price = 93, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postacie/helmy/robot.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Samuraj", Price = 79, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/helmy/samuraj.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Wiking", Price = 52, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postacie/helmy/wiking.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Farmer", Price = 162, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_bez_helmow/farmer.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Lekarz", Price = 181, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_bez_helmow/lekarz.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Robot", Price = 179, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_bez_helmow/robot.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Rycerz stroj", Price = 67, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_bez_helmow/rycerz_stroj.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Samuraj", Price = 74, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_bez_helmow/samuraj.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Spartan", Price = 149, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_bez_helmow/spartan.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Wiking", Price = 127, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_bez_helmow/wiking.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Astronauta", Price = 115, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/astronauta.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Detektyw", Price = 58, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/detektyw.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Farmer", Price = 151, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/farmer.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Japonskiekimono", Price = 134, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/japonskiekimono.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Ogrodniczki", Price = 199, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/ogrodniczki.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Robot", Price = 151, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/robot.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Rycerz", Price = 130, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/rycerz.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Samuraj", Price = 69, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/samuraj.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Wiking", Price = 141, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postacie/kostiumy_cale/wiking.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Astronauta stroj cały", Price = 131, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/astronauta_stroj_cały.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Buty bezowe", Price = 125, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/buty_bezowe.png", Category = itemCategories.First(c => c.Title == "Buty") },
                new Items { Title = "Buty niebieskie", Price = 85, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/buty_niebieskie.png", Category = itemCategories.First(c => c.Title == "Buty") },
                new Items { Title = "Buty rozowe", Price = 121, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/buty_rozowe.png", Category = itemCategories.First(c => c.Title == "Buty") },
                new Items { Title = "Buty zielone", Price = 158, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/buty_zielone.png", Category = itemCategories.First(c => c.Title == "Buty") },
                new Items { Title = "Czekoladowakurtka", Price = 172, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/czekoladowakurtka.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Gwiazdka", Price = 126, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/gwiazdka.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Helm astronauty", Price = 123, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/helm_astronauty.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Kokardka rozowa", Price = 160, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kokardka_rozowa.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Kokardka zielona", Price = 124, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kokardka_zielona.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Kolczyki uszy srebrne", Price = 112, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kolczyki_uszy_srebrne.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Kolczyki uszy zlote", Price = 119, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kolczyki_uszy_zlote.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Kombinezon czarny", Price = 93, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kombinezon_czarny.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Kombinezon rozowy", Price = 125, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kombinezon_rozowy.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Kombinezon zielony", Price = 61, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kombinezon_zielony.png", Category = itemCategories.First(c => c.Title == "Kostiumy całe") },
                new Items { Title = "Koszulka dluga bezowo brazowa", Price = 72, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_bezowo_brazowa.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga bezowo brazowa z sercem", Price = 141, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_bezowo_brazowa_z_sercem.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga brazowa", Price = 150, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_brazowa.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga brazowa z sercem", Price = 78, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_brazowa_z_sercem.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga niebieska zwykla", Price = 127, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_niebieska_zwykla.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga rozowa dziwna", Price = 167, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_rozowa_dziwna.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga rozowa dziwna z gwiazdka", Price = 77, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_rozowa_dziwna_z_gwiazdka.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga rozowa dziwna z serduszkiem", Price = 84, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_rozowa_dziwna_z_serduszkiem.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga rozowa zwykla", Price = 80, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_rozowa_zwykla.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga zielona dziwna", Price = 200, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_zielona_dziwna.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga zielona dziwna z gwiazdka", Price = 129, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_zielona_dziwna_z_gwiazdka.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga zielona dziwna z serduszkiem", Price = 160, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_zielona_dziwna_z_serduszkiem.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Koszulka dluga zwykla zielona", Price = 135, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/koszulka_dluga_zwykla_zielona.png", Category = itemCategories.First(c => c.Title == "Koszulki") },
                new Items { Title = "Krotkie spodnie crazy brazowe", Price = 70, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/krotkie_spodnie_crazy_brazowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Krotkie spodnie crazy rozowe", Price = 82, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/krotkie_spodnie_crazy_rozowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Krotkie spodnie crazy zielone", Price = 59, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/krotkie_spodnie_crazy_zielone.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Krotkie spodnie jasny roz", Price = 161, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/krotkie_spodnie_jasny_roz.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Krotkie spodnie zwykle brazowe", Price = 154, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/krotkie_spodnie_zwykle_brazowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Krotkie spodnie zwykle rozowe", Price = 175, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/krotkie_spodnie_zwykle_rozowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Krotkie spodnie zwykle zielone", Price = 81, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/krotkie_spodnie_zwykle_zielone.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Kwiatek rozowy", Price = 95, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kwiatek_rozowy.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Kwiatek zielony", Price = 164, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/kwiatek_zielony.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Okulary", Price = 178, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/okulary.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Samuraj czapka", Price = 174, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/samuraj_czapka.png", Category = itemCategories.First(c => c.Title == "Hełmy") },
                new Items { Title = "Samuraj stroj", Price = 200, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/samuraj_stroj.png", Category = itemCategories.First(c => c.Title == "Kostiumy bez hełmów") },
                new Items { Title = "Serduszko", Price = 141, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/serduszko.png", Category = itemCategories.First(c => c.Title == "Opaski i dodatki") },
                new Items { Title = "Soczewki blekitny", Price = 122, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/soczewki_blekitny.png", Category = itemCategories.First(c => c.Title == "Soczewki") },
                new Items { Title = "Soczewki ciemny zielony", Price = 164, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/soczewki_ciemny_zielony.png", Category = itemCategories.First(c => c.Title == "Soczewki") },
                new Items { Title = "Soczewki czerwony", Price = 56, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/soczewki_czerwony.png", Category = itemCategories.First(c => c.Title == "Soczewki") },
                new Items { Title = "Soczewki fioletowy", Price = 61, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/soczewki_fioletowy.png", Category = itemCategories.First(c => c.Title == "Soczewki") },
                new Items { Title = "Soczewki jasny niebieski", Price = 162, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/soczewki_jasny_niebieski.png", Category = itemCategories.First(c => c.Title == "Soczewki") },
                new Items { Title = "Soczewki jasny rozowy", Price = 151, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/soczewki_jasny_rozowy.png", Category = itemCategories.First(c => c.Title == "Soczewki") },
                new Items { Title = "Soczewki zolty", Price = 69, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/soczewki_zolty.png", Category = itemCategories.First(c => c.Title == "Soczewki") },
                new Items { Title = "Spodnica crazy", Price = 129, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnica_crazy.png", Category = itemCategories.First(c => c.Title == "Spódnice") },
                new Items { Title = "Spodnica zwykla", Price = 136, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnica_zwykla.png", Category = itemCategories.First(c => c.Title == "Spódnice") },
                new Items { Title = "Spodnie dlugie bananowe", Price = 105, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_bananowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie bezowe", Price = 123, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_bezowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie fioletowe crazy", Price = 75, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_fioletowe_crazy.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie fioletowe", Price = 115, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_fioletowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie niebieskie oceaniczne", Price = 172, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_niebieskie_oceaniczne.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie rozowe2", Price = 174, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_rozowe2.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie rozowe", Price = 61, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_rozowe.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie rozowe z serduszkami", Price = 196, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_rozowe_z_serduszkami.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie dlugie zielone crazy", Price = 88, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_dlugie_zielone_crazy.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie niebieskie", Price = 66, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_niebieskie.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie niebieskie w gwiazdki", Price = 113, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_niebieskie_w_gwiazdki.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Spodnie w gwiazki", Price = 131, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/spodnie_w_gwiazki.png", Category = itemCategories.First(c => c.Title == "Spodnie") },
                new Items { Title = "Top bananowy", Price = 70, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_bananowy.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top bananowy z gwiazdka", Price = 152, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_bananowy_z_gwiazdka.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top bananowy z serduszkiem", Price = 75, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_bananowy_z_serduszkiem.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top cielisty z gwizdka", Price = 164, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_cielisty_z_gwizdka.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top niebieski", Price = 90, Rarity = "Uncommon", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_niebieski.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top oceaniczny", Price = 68, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_oceaniczny.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top oceaniczny z gwiazdka", Price = 167, Rarity = "Epic", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_oceaniczny_z_gwiazdka.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top oceaniczny z serduszkiem", Price = 50, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_oceaniczny_z_serduszkiem.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top rozowy", Price = 118, Rarity = "Rare", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_rozowy.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top rozowy z serduszkiem", Price = 151, Rarity = "Legendary", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_rozowy_z_serduszkiem.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top zielony", Price = 128, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_zielony.png", Category = itemCategories.First(c => c.Title == "Top") },
                new Items { Title = "Top zolty", Price = 165, Rarity = "Common", CreatedAt = DateTime.Now, Image = "items/postac_ubrania/top_zolty.png", Category = itemCategories.First(c => c.Title == "Top") },
            };
            for (int i = 0; i < items.Count; i++) {
                if (!context.Items.Any(o => o.Title == items[i].Title)) {
                    var t = context.Items.Add(items[i]);
                    if (t != null) items[i] = t.Entity;
                }
            }
            context.SaveChanges();
        }

        return services;
    }
}