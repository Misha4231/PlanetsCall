// src/components/Shop.tsx
import React, { useEffect, useState } from 'react';
import { getCategories, getItemsByCategory, buyItem, addCategory } from '../../services/shopService';
import { useAuth } from '../../context/AuthContext';

const Shop: React.FC = () => {  
  const { token, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [newCategory, setNewCategory] = useState({ title: '', image: '' });

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, [token]);

  if(token != null){
    
  }
  useEffect(() => {
    if (!token) return;
    if (selectedCategory !== null && token) {
      const fetchItems = async () => {
        try {
          const data = await getItemsByCategory(token, selectedCategory, page);
          setItems(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchItems();
    }
  }, [selectedCategory, page, token]);

  const handleBuy = async (itemId: number) => {
    if (!token) {
      alert("Brak tokenu. Proszę się zalogować.");
      return;
    }
    
    try {
      await buyItem(token, itemId);
      alert('Zakupiono przedmiot!');
    } catch (error) {
      alert('Nie udało się kupić przedmiotu.');
    }
  };

  const handleAddCategory = async () => {
    if (!token) {
      alert("Brak tokenu. Proszę się zalogować.");
      return;
    }
    
    if (!newCategory.title || !newCategory.image) {
      alert('Wypełnij wszystkie pola.');
      return;
    }

    try {
      await addCategory(token, newCategory.title, newCategory.image);
      alert('Dodano kategorię!');
      setNewCategory({ title: '', image: '' });
      const updatedCategories = await getCategories(token);
      setCategories(updatedCategories);
    } catch (error) {
      console.log(error);
      alert('Nie udało się dodać kategorii.');
    }
  };

  return (
    <div>
      <h1>Sklep</h1>
      {isAuthenticated && token ? (
        <div>
          <div>
            <h2>Kategorie</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id} onClick={() => setSelectedCategory(category.id)}>
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Dodaj kategorię</h2>
            <input
              type="text"
              placeholder="Tytuł"
              value={newCategory.title}
              onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL obrazka"
              value={newCategory.image}
              onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
            />
            <button onClick={handleAddCategory}>Dodaj</button>
          </div>
          <div>
            <h2>Przedmioty</h2>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.price} waluty
                  <button onClick={() => handleBuy(item.id)}>Kup</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setPage((prev) => prev + 1)}>Załaduj więcej</button>
          </div>
        </div>
      ) : (
        <p>Proszę się zalogować, aby zobaczyć sklep.</p>
      )}
    </div>
  );
};

export default Shop;