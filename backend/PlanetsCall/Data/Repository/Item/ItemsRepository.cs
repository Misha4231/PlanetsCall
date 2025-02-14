using System.Collections;
using System.Drawing.Imaging;
using Core;
using Data.Context;
using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using PlanetsCall.Controllers.Exceptions;

namespace Data.Repository.Item;

public class ItemsRepository : RepositoryBase, IItemsRepository
{
    private readonly FileService _fileService;
    public ItemsRepository(PlatensCallContext context, IConfiguration configuration, FileService fileService) 
        : base(context, configuration)
    {
        _fileService = fileService;
    }
    
    public List<CategoriesListMember> GetCategories() // gets all categories
    {
        var categoriesList = Context.ItemsCategories
            .Include(c => c.AttachedItems)
            .Select(category => new CategoriesListMember(category)).ToList();

        return categoriesList;
    }

    // Gets a batch of items by category and paginates them
    public PaginatedList<MinItemDto> GetItemsPartition(int categoryId, int page)
    {
<<<<<<< HEAD
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>(); // gets the number of items per batch from configuration
=======
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>(); // gets the number of items per batch from configuration
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda

        var items = Context.Items
            .OrderBy(i => i.Id)
            .Where(i => i.CategoryId == categoryId)
            .Select(i => new MinItemDto(i))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
<<<<<<< HEAD
        var count = _context.Items.Count(i => i.CategoryId == categoryId);
=======
        var count = Context.Items.Count(i => i.CategoryId == categoryId);
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinItemDto>(items, page, totalPages);
    }

    public Items AddItem(MinItemDto itemData) // adds item to database
    {
        // checks if category id is valid
<<<<<<< HEAD
        if (_context.ItemsCategories.FirstOrDefault(ic => ic.Id == itemData.CategoryId) is null)
=======
        if (Context.ItemsCategories.FirstOrDefault(ic => ic.Id == itemData.CategoryId) is null)
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        {
            throw new CodeException("No Category with provided id found", StatusCodes.Status404NotFound);
        }
        
        // saves file or throws CodeException with code 415 Unsupported Media Type 
        string imagePath = _fileService.SaveFile(itemData.Image, "items",
                new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);

<<<<<<< HEAD
        EntityEntry<Items> newItem = _context.Items.Add(new Items() // creates an instance
=======
        EntityEntry<Items> newItem = Context.Items.Add(new Items() // creates an instance
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        {
            CategoryId = itemData.CategoryId,
            Price = itemData.Price,
            CreatedAt = DateTime.Now,
            Image = imagePath,
            Rarity = itemData.Rarity,
            Title = itemData.Title
        });
        Context.SaveChanges();

        return newItem.Entity; // return newly added object
    }
    public ItemsCategory AddCategory(MinCategoryDto categoryData) // adds new category for items to database
    {
        // saves file or throws CodeException with code 415 Unsupported Media Type 
        string imagePath = _fileService.SaveFile(categoryData.Image, "items",
                new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);
        
        // add an entity
<<<<<<< HEAD
        EntityEntry<ItemsCategory> newCategory = _context.ItemsCategories.Add(new ItemsCategory()
=======
        EntityEntry<ItemsCategory> newCategory = Context.ItemsCategories.Add(new ItemsCategory()
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        {
            Title = categoryData.Title,
            CreatedAt = DateTime.Now,
            Image = imagePath
        });
        Context.SaveChanges();

        return newCategory.Entity; // return newly added object
    }

    public void UpdateItem(MinItemDto itemData, int itemId)
    {
<<<<<<< HEAD
        Items? itemToUpdate = _context.Items.FirstOrDefault(i => i.Id == itemId); // search for object that is supposed to be updated
        if (itemToUpdate is null) {
            throw new CodeException("No item with provided id found", StatusCodes.Status404NotFound);
        }
        if (_context.ItemsCategories.FirstOrDefault(ic => ic.Id == itemData.CategoryId) is null)
=======
        Items? itemToUpdate = Context.Items.FirstOrDefault(i => i.Id == itemId); // search for object that is supposed to be updated
        if (itemToUpdate is null) {
            throw new CodeException("No item with provided id found", StatusCodes.Status404NotFound);
        }
        if (Context.ItemsCategories.FirstOrDefault(ic => ic.Id == itemData.CategoryId) is null)
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        {
            throw new CodeException("No Category with provided id found", StatusCodes.Status404NotFound);
        }
        
        // updates file or throws CodeException with code 415 Unsupported Media Type 
        string? imagePath = _fileService.UpdateFile(itemToUpdate.Image, itemData.Image, "items",
            new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);

        // assign values
        itemToUpdate.Image = imagePath ?? "";
        itemToUpdate.Rarity = itemData.Rarity;
        itemToUpdate.CategoryId = itemData.CategoryId;
        itemToUpdate.Price = itemData.Price;
        
        // update
<<<<<<< HEAD
        _context.Items.Update(itemToUpdate);
        _context.SaveChanges();
=======
        Context.Items.Update(itemToUpdate);
        Context.SaveChanges();
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
    }

    public void UpdateCategory(MinCategoryDto categoryData, int categoryId)
    {
<<<<<<< HEAD
        ItemsCategory? categoryToUpdate = _context.ItemsCategories.FirstOrDefault(i => i.Id == categoryId);
=======
        ItemsCategory? categoryToUpdate = Context.ItemsCategories.FirstOrDefault(i => i.Id == categoryId);
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        if (categoryToUpdate is null) {
            throw new CodeException("No item with provided id found", StatusCodes.Status404NotFound);
        }
        
        string? imagePath = _fileService.UpdateFile(categoryToUpdate.Image,categoryData.Image, "items",
            new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);

        categoryToUpdate.Image = imagePath;
        categoryToUpdate.Title = categoryData.Title;
        
<<<<<<< HEAD
        _context.ItemsCategories.Update(categoryToUpdate);
        _context.SaveChanges();
=======
        Context.ItemsCategories.Update(categoryToUpdate);
        Context.SaveChanges();
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
    }

    public bool DeleteItem(int itemId)
    {
        Items? itemData = Context.Items.FirstOrDefault(i => i.Id == itemId);
        if (itemData is null) return false;
        _fileService.DeleteFile(itemData.Image);
        
        Context.Items.Remove(itemData);
        Context.SaveChanges();
        return true;
    }

    public bool DeleteCategory(int categoryId)
    {
        ItemsCategory? categoryData = Context.ItemsCategories.FirstOrDefault(i => i.Id == categoryId);
        if (categoryData is null) return false;
        
        if (!string.IsNullOrEmpty(categoryData.Image)) _fileService.DeleteFile(categoryData.Image);
        
        Context.ItemsCategories.Remove(categoryData);
        Context.SaveChanges();

        return true;
    }

    public void GiveItem(Users user, int itemId) // gives item to user for certain price
    {
<<<<<<< HEAD
        Items? item = _context.Items.Include(i => i.Owners).FirstOrDefault(i => i.Id == itemId);
=======
        Items? item = Context.Items.Include(i => i.Owners).FirstOrDefault(i => i.Id == itemId);
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        if (item is null) // validate existing
            throw new CodeException("Item don't exist", StatusCodes.Status404NotFound);
        
        if (user.Points < item.Price) // validate balance
            throw new CodeException("Not enough points to buy item", StatusCodes.Status400BadRequest);
        
        if (item.Owners.Contains(user)) // validate if user already have item
            throw new CodeException("You already have that item", StatusCodes.Status400BadRequest);
        
        // if everything ok, give item
        user.Points -= item.Price;
        item.Owners.Add(user);
        
<<<<<<< HEAD
        _context.SaveChanges();
=======
        Context.SaveChanges();
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
    }
}