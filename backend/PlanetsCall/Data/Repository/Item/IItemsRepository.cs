using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;

namespace Data.Repository.Item;

public interface IItemsRepository
{
    List<CategoriesListMember> GetCategories();
    PaginatedList<MinItemDto> GetItemsPartition(int categoryId, int page);

    Items AddItem(MinItemDto itemData);
    ItemsCategory AddCategory(MinCategoryDto categoryData);
    
    void UpdateItem(MinItemDto itemData, int itemId);
    void UpdateCategory(MinCategoryDto categoryData, int categoryId);
    bool DeleteItem(int itemId);
    bool DeleteCategory(int categoryId);
    void GiveItem(Users user, int itemId);
}