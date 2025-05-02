using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;

namespace Data.Repository.Item;

public interface IItemsRepository
{
    List<CategoriesListMember> GetCategories();
    PaginatedList<MinItemDto> GetItemsPartition(int page, int? categoryId = null, Users? user = null, bool selectedOnly = false);

    Items AddItem(MinItemDto itemData);
    ItemsCategory AddCategory(MinCategoryDto categoryData);
    bool SelectItem(int itemId, Users user);
    bool DeselectItem(int itemId, Users user);
    
    void UpdateItem(MinItemDto itemData, int itemId);
    void UpdateCategory(MinCategoryDto categoryData, int categoryId);
    bool DeleteItem(int itemId);
    bool DeleteCategory(int categoryId);
    void GiveItem(Users user, int itemId);
}