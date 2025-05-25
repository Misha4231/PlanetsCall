import React, { useEffect, useState } from 'react';
import {
  buyItem,
   getCategories,
   getItemsByCategory, getUserItems,
   Items
} from '../../services/shopService';
import { addSelectedItem, deleteSelectedItem, getUserSelectedItems
} from '../../services/userService';
import { getFullUser, getUser } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import styles from '../../stylePage/shop.module.css';
import Footer from '../../components/Footer/Footer';
import { imageUrl } from '../../services/imageConvert';
import Ecorus from '../../components/Ecorus';
import { PaginationResponse } from '../../services/headers';
import { RarityType } from '../shop/Shop';


interface Category {
  id: number;
  title: string;
  image: string;
}


const ProfileItems: React.FC = () => {  
const { token, isAuthenticated, user } = useAuth();
const [categories, setCategories] = useState<Category[]>([]);
const [items, setItems] = useState<Items[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<RarityType[]>([]);
const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
const [selectedItems, setSelectedItems] = useState<Items[]>([]);
const [pagination, setPagination] = useState<PaginationResponse<Items> | null>(null); 
const [currentPage, setCurrentPage] = useState<number>(1); 
    


  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [categoriesData] = await Promise.all([
          getCategories(token)
        ]);
        setCategories(categoriesData);
        if (categoriesData.length > 0 && selectedCategory === null) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    

    const fetchAllSelectedItems = async () => {
        if (!token || !user?.id || categories.length === 0) return;
      
        try {
          const allItems: Items[] = [];
      
          for (const category of categories) {
            const response = await getUserSelectedItems(token, user?.id, category.id, 1);
            allItems.push(...response.items);
                  
            setPagination({
                pageIndex: response.pageIndex,
                totalPages: response.totalPages,
                hasPreviousPage: response.hasPreviousPage,
                hasNextPage: response.hasNextPage,
                items: response.items
            });
            
          }
      
          setSelectedItems(allItems);
        } catch (error) {
          console.error(error);
        }
      };

    fetchAllSelectedItems();
    fetchData();
  }, [token, selectedCategory]);

  useEffect(() => {
    if (!token || selectedCategory === null) return;
    const fetchItems = async () => {
        try {
            const response = await getUserItems(token, selectedCategory, 1);
            
            setItems(response.items);
            setPagination({
                pageIndex: response.pageIndex,
                totalPages: response.totalPages,
                hasPreviousPage: response.hasPreviousPage,
                hasNextPage: response.hasNextPage,
                items: response.items
            });                        
        } catch (error) {
            console.error(error);
        }
    };
    fetchItems();
  }, [selectedCategory, token]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
        setCurrentPage(page);
    }
};

  const isItemSelected = (itemId: number) => {
    return selectedItems.some(si => si.id === itemId);
  };

  const toggleRarityFilter = (rarity: RarityType) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };
  
  const filteredItems = selectedRarities.length === 0
  ? items
  : items.filter(item => selectedRarities.includes(item.rarity));

 
  return (
    <div className="app-container">
      <Header/>
      <section className="blockCode">
          <div className={styles.shopLayout}>
            <div className={styles.sidebar}>
              <h2>Kategoria:</h2>
              <div className={styles.categoryList}>
              {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  > 
                    <div className={styles.categoryContainer}>
                        <img 
                          src={imageUrl() + category.image} 
                          alt={category.title} 
                          className={`${styles.categoryIcons}`}
                        />
                    </div>
                      <span>{category.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.mainContent}>
                <h2>Twoje Itemy:</h2>
              
              <h2 className={styles.title}>
                {categories.find(c => c.id === selectedCategory)?.title || 'Wybierz kategorię'}
              </h2>
              <div className={styles.filterBar}>
              <span>Filtruj po rzadkości:</span>
              {(["Common", "Rare", "Epic", "Uncommon"] as RarityType[]).map(rarity => (
                <button
                  key={rarity}
                  className={`${styles.filterButton} ${selectedRarities.includes(rarity) ? styles.active : ''}`}
                  onClick={() => toggleRarityFilter(rarity)}
                >
                  {rarity}
                </button>
              ))}
            </div>
              
              <div className={styles.itemsGrid}>
                {items.map((item) => (
                  <div 
                  key={item.id} 
                  className={`${styles.shopItem} ${isItemSelected(item.id) ? styles.selectedItem : ''}`}
                >                
                    <img src={imageUrl()+item.image} alt={item.title} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <div className={styles.itemActions}>
                        <button 
                            className={`${styles.actionButton} ${styles.tryButton} ${isItemSelected(item.id) ? styles.removeButton : ''}`}
                            onClick={async () => {
                                if (!token || selectedCategory === null) return;
                              
                                try {
                                  const currentItemInCategory = selectedItems.find(
                                    (si) => si.categoryId === selectedCategory
                                  );
                              
                                  if (isItemSelected(item.id)) {
                                    await deleteSelectedItem(token, item.id);
                                  } else {
                                    if (currentItemInCategory) {
                                      await deleteSelectedItem(token, currentItemInCategory.id);
                                    }
                                    await addSelectedItem(token, item.id);
                                  }
                              
                                  const allItems: Items[] = [];
                                  for (const category of categories) {
                                    const response = await getUserSelectedItems(token, user?.id ? user.id : 0, category.id, 1);
                                    allItems.push(...response.items);
                                  }
                                  setSelectedItems(allItems);
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              
                            >
                            {isItemSelected(item.id) ? 'Zdejmij' : 'Załóż'}
                            </button>

                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
              {pagination && pagination.totalPages > 1 && (
                      <div className={styles.adminPagination}>
                          <button 
                              onClick={() => goToPage(currentPage - 1)} 
                              disabled={!pagination.hasPreviousPage}
                              className={styles.adminPaginationButton}
                          >
                              Poprzednia
                          </button>
                          
                          <span>
                              Strona {pagination.pageIndex} z {pagination.totalPages}
                          </span>
                          
                          <button 
                              onClick={() => goToPage(currentPage + 1)} 
                              disabled={!pagination.hasNextPage}
                              className={styles.adminPaginationButton}
                          >
                              Następna
                          </button>
                      </div>
                    )}
            </div>

            <div className={styles.ecorusContent}>
                    <h2>Wybrane itemy:</h2>
                <div className={`${styles.profilePreviewImage}`}>
                    <div className={styles.profileImageWrapper}>                            
                          {(() => {
                            const helmetCategory = categories.find(c => c.title === 'Hełmy');
                            const costumeCategory = categories.find(c => c.title === 'Kostiumy całe');
                            const costumeWHelmetCategory = categories.find(c => c.title === 'Kostiumy bez hełmów');

                            const hasHelmet = helmetCategory && selectedItems.some(item => item.categoryId === helmetCategory.id);
                            const hasCostume = costumeCategory && selectedItems.some(item => item.categoryId === costumeCategory.id);
                            const hasCostumeWHelmet = costumeWHelmetCategory && selectedItems.some(item => item.categoryId === costumeWHelmetCategory.id);

                            if (hasHelmet || hasCostume) {
                              return <Ecorus className={styles.profileEcorusImage} variant="hat" />;
                            } else if (hasCostumeWHelmet) {
                              return <Ecorus className={styles.profileEcorusImage} variant="noHair" />;
                            } else {
                              return <Ecorus className={styles.profileEcorusImage} />;
                            }

                          })()}

                        
                        {selectedItems.map((item) => (
                        <div key={item.id}>
                            <img src={imageUrl() + item.image} alt={item.title} className={styles.profileCharacterClothes} />
                        </div>
                        ))}

                    </div>
                </div>
            </div>
          </div>
      </section>

      <Footer/>
    </div>
  );
};


export default ProfileItems;
