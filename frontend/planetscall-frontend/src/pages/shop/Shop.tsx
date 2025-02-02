// src/components/Shop.tsx
import React, { useEffect, useState } from 'react';
import { getCategories, getItemsByCategory, buyItem } from '../../services/shopService';
import { useAuth } from '../../context/AuthContext';

const Shop: React.FC = () => {  
  const { token, user, isAuthenticated} = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [currency, setCurrency] = useState<number>(0);
  useEffect(() => {
    if (!token) {
      console.error('Brak tokenu. Użytkownik nie jest zalogowany.');
      return;
    }

    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (error) {
        console.error('Błąd podczas ładowania kategorii:', error);
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (selectedCategory !== null && token) {
      const fetchItems = async () => {
        try {
          const data = await getItemsByCategory(token, selectedCategory, page);
          setItems(data);
        } catch (error) {
          console.error('Błąd podczas ładowania przedmiotów:', error);
        }
      };
      fetchItems();
    }
  }, [selectedCategory, page, token]);

  useEffect(() => {
    if (token) {
      const fetchCurrency = async () => {
      };
      fetchCurrency();
    }
  }, [token]);

  

  return (
    <div>
      <h1>Sklep</h1>
      {isAuthenticated && token ? (
        <div>
          <h2>Saldo: {user?.money} waluty</h2>
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
            <h2>Przedmioty</h2>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.price} waluty
                  <button>Kup</button>
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