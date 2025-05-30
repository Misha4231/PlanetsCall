﻿using System.Collections;
using System.Drawing.Imaging;
using Core;
using Core.Exceptions;
using Data.Context;
using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;
using Data.Repository.User;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Item;

public class ItemsRepository(PlatensCallContext context, IConfiguration configuration, FileService fileService, IUsersRepository usersRepository)
    : RepositoryBase(context, configuration), IItemsRepository
{
    public List<CategoriesListMember> GetCategories() // gets all categories
    {
        var categoriesList = Context.ItemsCategories
            .Include(c => c.AttachedItems)
            .Select(category => new CategoriesListMember(category)).ToList();

        return categoriesList;
    }

    // Gets a batch of items by category and paginates them
    public PaginatedList<MinItemDto> GetItemsPartition(int page, int? categoryId = null, Users? user = null, bool selectedOnly = false)
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>(); // gets the number of items per batch from configuration

        var query = Context.Items.AsQueryable();
        if (categoryId.HasValue)
        {
            query = query.Where(item => item.CategoryId == categoryId.Value);
        }

        if (user is not null)
        {
            var userId = user.Id;

            query = query.Where(u => u.Owners!.Any(cs => cs.Id == userId));
            if (selectedOnly)
            {
                query = query.Where(i => i.CurrentlySelecting!.Any(cs => cs.Id == userId));
            }
        }
        
        var items = query
            .OrderBy(i => i.Id)
            .Select(i => new MinItemDto(i))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = query.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinItemDto>(items, page, totalPages);
    }

    public Items AddItem(MinItemDto itemData) // adds item to database
    {
        // checks if category id is valid
        if (Context.ItemsCategories.FirstOrDefault(ic => ic.Id == itemData.CategoryId) is null)
        {
            throw new CodeException("No Category with provided id found", StatusCodes.Status404NotFound);
        }
        
        // saves file or throws CodeException with code 415 Unsupported Media Type 
        string imagePath = fileService.SaveFile(itemData.Image, "items",
            new List<string> { "png", "jpg", "jpeg", "gif" }, 4);

        EntityEntry<Items> newItem = Context.Items.Add(new Items() // creates an instance
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
        string imagePath = fileService.SaveFile(categoryData.Image, "items",
            new List<string> { "png", "jpg", "jpeg", "gif" }, 4);
        
        // add an entity
        EntityEntry<ItemsCategory> newCategory = Context.ItemsCategories.Add(new ItemsCategory()
        {
            Title = categoryData.Title,
            CreatedAt = DateTime.Now,
            Image = imagePath
        });
        Context.SaveChanges();

        return newCategory.Entity; // return newly added object
    }

    public bool SelectItem(int itemId, Users user)
    {
        user = Context.Users
            .Include(u => u.ItemsCollection)
            .Include(u => u.ItemsSelected)
            .FirstOrDefault(u => u.Id == user.Id)!;
        
        Items? item = Context.Items.FirstOrDefault(i => i.Id == itemId);
        
        if (item is null || user.ItemsCollection == null) return false; // null exception
        if (user.ItemsCollection.All(i => i.Id != itemId)) return false;

        if (user.ItemsSelected != null)
        {
            bool itemAlreadySelected = user.ItemsSelected.Any(i => i.Id == itemId);
            if (itemAlreadySelected) return true; // item is already selected, no need to update in database
            
            // if user has selected item with the same category earlier, replace it with a new one
            var sameCategorySelected = user.ItemsSelected.FirstOrDefault(i => i.CategoryId == item.CategoryId);
            if (sameCategorySelected is not null) user.ItemsSelected.Remove(sameCategorySelected);
            
            user.ItemsSelected.Add(item); // replace with a new one
            Context.SaveChanges();
            
            return true;
        }
        
        return false;
    }

    public bool DeselectItem(int itemId, Users user)
    {
        user = Context.Users
            .Include(u => u.ItemsSelected)
            .FirstOrDefault(u => u.Id == user.Id)!;
        
        Items? item = Context.Items.FirstOrDefault(i => i.Id == itemId);
        if (item is null || user.ItemsSelected == null) return false; // null exception
        
        user.ItemsSelected.Remove(item);
        Context.SaveChanges();
        
        return true;
    }

    public void UpdateItem(MinItemDto itemData, int itemId)
    {
        Items? itemToUpdate = Context.Items.FirstOrDefault(i => i.Id == itemId); // search for object that is supposed to be updated
        if (itemToUpdate is null) {
            throw new CodeException("No item with provided id found", StatusCodes.Status404NotFound);
        }
        if (Context.ItemsCategories.FirstOrDefault(ic => ic.Id == itemData.CategoryId) is null)
        {
            throw new CodeException("No Category with provided id found", StatusCodes.Status404NotFound);
        }
        
        // updates file or throws CodeException with code 415 Unsupported Media Type 
        string? imagePath = fileService.UpdateFile(itemToUpdate.Image, itemData.Image, "items",
            new List<string> { "png", "jpg", "jpeg", "gif" }, 4);

        // assign values
        itemToUpdate.Image = imagePath ?? "";
        itemToUpdate.Rarity = itemData.Rarity;
        itemToUpdate.CategoryId = itemData.CategoryId;
        itemToUpdate.Price = itemData.Price;
        
        // update
        Context.Items.Update(itemToUpdate);
        Context.SaveChanges();
    }

    public void UpdateCategory(MinCategoryDto categoryData, int categoryId)
    {
        ItemsCategory? categoryToUpdate = Context.ItemsCategories.FirstOrDefault(i => i.Id == categoryId);
        if (categoryToUpdate is null) {
            throw new CodeException("No item with provided id found", StatusCodes.Status404NotFound);
        }
        
        string? imagePath = fileService.UpdateFile(categoryToUpdate.Image,categoryData.Image, "items",
            new List<string> { "png", "jpg", "jpeg", "gif" }, 4);

        categoryToUpdate.Image = imagePath;
        categoryToUpdate.Title = categoryData.Title;
        
        Context.ItemsCategories.Update(categoryToUpdate);
        Context.SaveChanges();
    }

    public bool DeleteItem(int itemId)
    {
        Items? itemData = Context.Items.FirstOrDefault(i => i.Id == itemId);
        if (itemData is null) return false;
        fileService.DeleteFile(itemData.Image);
        
        Context.Items.Remove(itemData);
        Context.SaveChanges();
        return true;
    }

    public bool DeleteCategory(int categoryId)
    {
        ItemsCategory? categoryData = Context.ItemsCategories.FirstOrDefault(i => i.Id == categoryId);
        if (categoryData is null) return false;
        
        if (!string.IsNullOrEmpty(categoryData.Image)) fileService.DeleteFile(categoryData.Image);
        
        Context.ItemsCategories.Remove(categoryData);
        Context.SaveChanges();

        return true;
    }

    public void GiveItem(Users user, int itemId) // gives item to user for certain price
    {
        Items? item = Context.Items.Include(i => i.Owners).FirstOrDefault(i => i.Id == itemId);
        if (item is null) // validate existing
            throw new CodeException("Item don't exist", StatusCodes.Status404NotFound);
        
        if (user.Points < item.Price) // validate balance
            throw new CodeException("Not enough points to buy item", StatusCodes.Status400BadRequest);
        
        if (item.Owners != null && item.Owners.Contains(user)) // validate if user already have item
            throw new CodeException("You already have that item", StatusCodes.Status400BadRequest);
        
        // if everything ok, give item
        usersRepository.UpdateUserPoints(user.Id, (int)item.Price * -1);
        if (item.Owners != null) item.Owners.Add(user);

        Context.SaveChanges();
    }
}