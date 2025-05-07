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


interface Category {
  id: number;
  title: string;
  image: string;
}


const ProfileItems: React.FC = () => {  
const { token, isAuthenticated, user } = useAuth();
const [categories, setCategories] = useState<Category[]>([]);
const [items, setItems] = useState<Items[]>([]);
const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
const [selectedItems, setSelectedItems] = useState<Items[]>([]);
const [selectedItem, setSelectedItem] = useState<Items | null>(null);
const [pagination, setPagination] = useState<PaginationResponse<Items> | null>(null); 
const [currentPage, setCurrentPage] = useState<number>(1); 
    


  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [categoriesData, userData] = await Promise.all([
          getCategories(token),
          getFullUser(token)
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
        if (!token || categories.length === 0) return;
      
        try {
          const allItems: Items[] = [];
      
          for (const category of categories) {
            const response = await getUserSelectedItems(token, category.id, 1);
            allItems.push(...response.items);
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



  const isItemSelected = (itemId: number) => {
    return selectedItems.some(si => si.id === itemId);
  };

 
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
                  <div className={styles.characterContainer}>
                    <div className={styles.imageWrapper}>
                      <Ecorus className={styles.characterBody} />
                      <img 
                        src={imageUrl() + category.image} 
                        alt={category.title} 
                        className={` ${styles.characterClothes}`}
                      />
                    </div>
                  </div>
                    <span>{category.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.currencyDisplay}>
                <h2>Twoje Itemy:</h2>
              </div>
              
              <h2 className={styles.title}>
                {categories.find(c => c.id === selectedCategory)?.title || 'Wybierz kategorię'}
              </h2>
              
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
                            className={`${styles.actionButton} ${styles.tryButton}`}
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
                                    const response = await getUserSelectedItems(token, category.id, 1);
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
            </div>

            <div className={styles.ecorusContent}>
                <div className={styles.currencyDisplay}>
                    <h2>Wybrane itemy:</h2>
                </div>  
                <div className={`${styles.profilePreviewImage}`}>
                    <div className={styles.profileImageWrapper}>
                        <Ecorus className={styles.profileEcorusImage} />
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
