using System.Collections;
using System.Drawing.Imaging;
using Core;
using Data.Context;
using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Item;

public class ItemsRepository : IItemsRepository
{
    private readonly PlatensCallContext _context;
    private readonly IConfiguration _configuration;
    private readonly FileService _fileService;
    public ItemsRepository(PlatensCallContext context, IConfiguration configuration, FileService fileService)
    {
        this._context = context;
        this._configuration = configuration;
        this._fileService = fileService;
    }
    
    public List<CategoriesListMember> GetCategories()
    {
        var categoriesList = _context.ItemsCategories
            .Include(c => c.AttachedItems)
            .Select(category => new CategoriesListMember
        {
            Id = category.Id,
            Title = category.Title,
            CreatedAt = category.CreatedAt,
            Image = category.Image,
            AttachedItemsCount = category.AttachedItems != null ? category.AttachedItems.Count() : 0
        }).ToList();

        return categoriesList;
    }

    public PaginatedList<Items> GetItemsPartition(int categoryId, int page)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();

        var items = _context.Items
            .OrderBy(i => i.Id)
            .Where(i => i.CategoryId == categoryId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var count = _context.Items.Count(i => i.CategoryId == categoryId);
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<Items>(items, page, totalPages);
    }

    public Items? AddItem(MinItemDTO itemData)
    {
        if (_context.ItemsCategories.FirstOrDefault(ic => ic.Id == itemData.CategoryId) is null) return null;
        
        string imagePath;
        try
        {
            imagePath = _fileService.SaveFile(itemData.Image, "items",
                new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);
        }
        catch (InvalidOperationException e)
        {
            return null;
        }

        EntityEntry<Items> newItem = _context.Items.Add(new Items()
        {
            CategoryId = itemData.CategoryId,
            Price = itemData.Price,
            CreatedAt = DateTime.Now,
            Image = imagePath,
            Rarity = itemData.Rarity,
            Title = itemData.Title
        });
        _context.SaveChanges();

        return newItem.Entity;
    }
    public ItemsCategory AddCategory(MinCategoryDTO categoryData)
    {
        string imagePath;
        try
        {
            imagePath = _fileService.SaveFile(categoryData.Image, "items",
                new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);
        }
        catch (InvalidOperationException e)
        {
            return null;
        }

        EntityEntry<ItemsCategory> newCategory = _context.ItemsCategories.Add(new ItemsCategory()
        {
            Title = categoryData.Title,
            CreatedAt = DateTime.Now,
            Image = imagePath
        });
        _context.SaveChanges();

        return newCategory.Entity;
    }

    public bool UpdateItem(UpdateItemDTO itemData)
    {
        Items? itemToUdpate = _context.Items.FirstOrDefault(i => i.Id == itemData.Id);
        if (itemToUdpate is null) return false;
        
        string imagePath = itemToUdpate.Image;
        if (imagePath != itemData.Image)
        {
            _fileService.DeleteFile(itemToUdpate.Image);
            try
            {
                imagePath = _fileService.SaveFile(itemData.Image, "items",
                    new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);
            }
            catch (InvalidOperationException e)
            {
                return false;
            }
        }

        itemToUdpate.Image = imagePath;
        itemToUdpate.Rarity = itemData.Rarity;
        itemToUdpate.CategoryId = itemData.CategoryId;
        itemToUdpate.Price = itemData.Price;
        
        _context.Items.Update(itemToUdpate);
        _context.SaveChanges();

        return true;
    }

    public bool UpdateCategory(UpdateCategoryDto categoryData)
    {
        ItemsCategory? categoryToUdpate = _context.ItemsCategories.FirstOrDefault(i => i.Id == categoryData.Id);
        if (categoryToUdpate is null) return false;
        
        string imagePath = categoryToUdpate.Image;
        if (imagePath != categoryData.Image)
        {
            _fileService.DeleteFile(categoryToUdpate.Image);
            try
            {
                imagePath = _fileService.SaveFile(categoryData.Image, "items",
                    new ImageFormat[] { ImageFormat.Png, ImageFormat.Jpeg, ImageFormat.Gif }, 4);
            }
            catch (InvalidOperationException e)
            {
                return false;
            }
        }

        categoryToUdpate.Image = imagePath;
        categoryToUdpate.Title = categoryData.Title;
        
        _context.ItemsCategories.Update(categoryToUdpate);
        _context.SaveChanges();

        return true;
    }

    public bool DeleteItem(int itemId)
    {
        Items? itemData = _context.Items.FirstOrDefault(i => i.Id == itemId);
        if (itemData is null) return false;
        _fileService.DeleteFile(itemData.Image);
        
        _context.Items.Remove(itemData);
        _context.SaveChanges();
        return true;
    }

    public bool DeleteCategory(int categoryId)
    {
        ItemsCategory? categoryData = _context.ItemsCategories.FirstOrDefault(i => i.Id == categoryId);
        if (categoryData is null) return false;
        
        if (!string.IsNullOrEmpty(categoryData.Image)) _fileService.DeleteFile(categoryData.Image);
        
        _context.ItemsCategories.Remove(categoryData);
        _context.SaveChanges();

        return true;
    }

    public void GiveItem(Users user, int itemId)
    {
        Items? item = _context.Items.Include(i => i.Owners).FirstOrDefault(i => i.Id == itemId);
        if (item is null)
            throw new Exception("Item not exist");
        
        if (user.Points < item.Price) 
            throw new Exception("Not enough points to buy item");
            
        if (user.ItemsCollection is null) user.ItemsCollection = new List<Items>();
        if (item.Owners is null) item.Owners = new List<Users>();
        if (item.Owners.Contains(user))
            throw new Exception("You already have that item");
        
        user.Points -= item.Price;
        item.Owners.Add(user);
            
        _context.SaveChanges();
    }
}