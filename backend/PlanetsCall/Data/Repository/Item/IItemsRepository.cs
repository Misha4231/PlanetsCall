using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;

namespace Data.Repository.Item;

public interface IItemsRepository
{
    List<CategoriesListMember> GetCategories();
    PaginatedList<Items> GetItemsPartition(int categoryId, int page);

    Items? AddItem(MinItemDTO itemData);
    ItemsCategory AddCategory(MinCategoryDTO categoryData);
    
    bool UpdateItem(UpdateItemDTO itemData);
    bool UpdateCategory(UpdateCategoryDto categoryData);
    
    bool DeleteItem(int itemId);
    bool DeleteCategory(int categoryId);

    void GiveItem(Users user, int itemId);
}