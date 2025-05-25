import React, { useEffect, useState } from 'react';
import {
  buyItem,
   getCategories,
   getItemsByCategory,
   getUserItems,
   Items
} from '../../services/shopService';
import { getFullUser, getUser, getUserSelectedItems } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import styles from '../../stylePage/shop.module.css';
import Footer from '../../components/Footer/Footer';
import { imageUrl } from '../../services/imageConvert';
import Ecorus from '../../components/Ecorus';


interface Category {
  id: number;
  title: string;
  image: string;
}


export type RarityType = "Common" | "Rare" | "Epic"| "Uncommon";

export interface ItemShop {   
  "id": number, 
  "categoryId": number,
  "price": number,
  "image": string,
  "rarity": RarityType,
  "title": string
}

const Shop: React.FC = () => {  
  const { token, isAuthenticated, user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<RarityType[]>([]);
  const [items, setItems] = useState<ItemShop[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currency, setCurrency] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<ItemShop | null>(null);
  const [ownedItems, setOwnedItems] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [purchaseStatus, setPurchaseStatus] = useState<{success: boolean, message: string} | null>(null);


  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [categoriesData, userData] = await Promise.all([
          getCategories(token),
          getFullUser(token)
        ]);
        setCategories(categoriesData);
        setCurrency(userData.points || 0);
        
        if (categoriesData.length > 0 && selectedCategory === null) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchData();
  }, [token, selectedCategory]);

  useEffect(() => {
    if (!token || selectedCategory === null) return;

    const fetchItems = async () => {
      try {
        const data = await getItemsByCategory(token, selectedCategory, 1);
        setItems(data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchAllSelectedItems = async () => {
        if (!token || categories.length === 0) return;
      
        try {
          const allItems: Items[] = [];
      
          for (const category of categories) {
            const response = await getUserItems(token, category.id, 1);
            allItems.push(...response.items);
            
          }
           setOwnedItems(allItems.map((item:Items) => item.id));

        } catch (error) {
          console.error(error);
        }
      };
    fetchItems();
    fetchAllSelectedItems();
  }, [selectedCategory, token]);


  const handleBuyClick = (item: ItemShop) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  const confirmPurchase = async () => {
    if (!token || !selectedItem) return;
    console.log(selectedItem)
    try {
      await buyItem(token, selectedItem.id);
      const userData = await getFullUser(token);
      setCurrency(userData.points || 0);
      setPurchaseStatus({success: true, message: 'Zakupiono przedmiot!'});
      setTimeout(() => setPurchaseStatus(null), 3000);
    } catch (error: any) {
      const message = error.message || 'Nie udało się kupić przedmiotu';
      setPurchaseStatus({success: false, message});
      setTimeout(() => setPurchaseStatus(null), 3000);
    } finally {
      setShowConfirmModal(false);
      setSelectedItem(null);
    }
  };

  const cancelPurchase = () => {
    setShowConfirmModal(false);
    setSelectedItem(null);
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
        <div className={styles.content}>
        <h1 className={styles.title}>Sklep</h1>
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
              <div className={styles.currencyDisplay}>
                <h2>Twoje Monety:</h2>
                <span className={styles.currencyAmount}>{currency}</span>
              </div>
              
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
                {filteredItems.map((item) => (
                  <div key={item.id}  className={`${styles.shopItem} ${ownedItems.includes(item.id) ? styles.ownedItem : ''}`}>
                    <img src={imageUrl()+item.image} alt={item.title} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemRarity}>Rzadkość: {item.rarity}</p>
                      <p className={styles.itemPrice}>Cena: {item.price}</p>
                      <div className={styles.itemActions}>
                        {ownedItems.includes(item.id) ? (
                          <button
                            className={`${styles.actionButton} ${styles.haveButton}`}>Posiadane</button>
                        ) : (
                          <button 
                            className={`${styles.actionButton} ${styles.buyButton}`}
                            onClick={() => handleBuyClick(item)}
                          >
                            Kup
                          </button>
                        )}

                        <button 
                          className={`${styles.actionButton} ${styles.tryButton}`}
                          onClick={() => setSelectedItem(item)}
                        >
                          Sprawdź
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {showConfirmModal && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3 className={styles.modalTitle}>Potwierdzenie zakupu</h3>
            <p className={styles.modalText}>Czy na pewno chcesz kupić {selectedItem.title} za {selectedItem.price} punktów?</p>
            <div className={styles.modalButtons}>
              <button onClick={confirmPurchase} className={`${styles.actionButton} ${styles.confirmButton}`}>Potwierdź</button>
              <button onClick={cancelPurchase} className={`${styles.actionButton} ${styles.cancelButton}`}>Anuluj</button>
            </div>
          </div>
        </div>
      )}

      {purchaseStatus && (
        <div className={`${styles.notification} ${purchaseStatus.success ? styles.successNotification : styles.errorNotification}`}>
          {purchaseStatus.message}
        </div>
      )}

      {selectedItem && !showConfirmModal && (
        <div className={styles.previewPanel}>
          <h3 className={styles.previewTitle}>Widok: {selectedItem.title}</h3>
         
          <div className={`${styles.previewImage}`}>
            <div className={styles.imageWrapper}>
              
                {categories.find(c => c.id === selectedCategory)?.title == 'Hełmy' ? (
                   <Ecorus className={styles.characterBody} variant='hat' />

                ) : categories.find(c => c.id === selectedCategory)?.title == 'Kostiumy bez hełmów' ? (
                   <Ecorus className={styles.characterBody} variant='noHair' />

                ) : categories.find(c => c.id === selectedCategory)?.title == 'Kostiumy całe' ? (
                   <Ecorus className={styles.characterBody} variant='hat' />

                ) : (
                    <Ecorus className={styles.characterBody} />
                )}
              <img 
                src={imageUrl() + selectedItem.image} 
                alt={selectedItem.title} 
                className={` ${styles.characterClothes}`}
              />
            </div>
          </div>
          <button 
            className={styles.closePreview}
            onClick={() => setSelectedItem(null)}
          >
            Zamknij
          </button>
        </div>
      )}

      <Footer/>
    </div>
  );
};


export default Shop;