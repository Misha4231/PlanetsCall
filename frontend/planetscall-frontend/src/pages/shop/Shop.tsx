import React, { useEffect, useState } from 'react';
import {
   getCategories,
   getItemsByCategory,
   buyItem,
   addCategory,
   removeCategory,
   addItems,
   removeItems,
   updateItem,
   updateCategory
} from '../../services/shopService';
import { getFullUser, getUser } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';

const Shop: React.FC = () => {  
  const { token, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [newCategory, setNewCategory] = useState({ title: '', image: '' });
  const [currency, setCurrency] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);


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

    useEffect(() => {
      if (!token) return;
  
      const fetchCurrency = async () => {
        try {
          const userData = await getFullUser(token);
          setCurrency(userData.points);
        } catch (error) {
          console.error("Błąd pobierania waluty:", error);
        }
      };
  
      fetchCurrency();
    }, [token]);



  const handleBuy = async (itemId: number) => {
    if (!token) {
      alert("Brak tokenu. Proszę się zalogować.");
      return;
    }
    
    try {
      await buyItem(token, itemId);
      alert('Zakupiono przedmiot!');
      const userData = await getFullUser(token);
      setCurrency(userData.ponits); 
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
      setCategories(await getCategories(token));
    } catch (error) {
      console.log(error);
      alert('Nie udało się dodać kategorii.');
    }
  };


  const handleTryItem = (item: any) => {
    setSelectedItem(item);
    alert(`Próbujesz ${item.name}!`);
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setNewCategory({ ...newCategory, image: reader.result as string });
      };
    }
  };

  return (
    <div className="app-container">
      <Header/>
      <h1>Sklep</h1>
      {isAuthenticated && token ? (
        <div>
          <h2>Saldo: {currency} waluty</h2>
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
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {newCategory.image && <img src={newCategory.image} alt="Podgląd" style={{ width: 100, height: 100 }} />}
            <button onClick={handleAddCategory}>Dodaj</button>
          </div>

          <div>
            <h2>Przedmioty</h2>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.price} waluty
                  <button onClick={() => handleTryItem(item)}>Próbuj</button>
                  <button onClick={() => handleBuy(item.id)}>Kup</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setPage((prev) => prev + 1)}>Załaduj więcej</button>
          </div>

          {selectedItem && (
            <div>
              <h2>Próbujesz: {selectedItem.name}</h2>
              <img src={selectedItem.image} alt={selectedItem.name} style={{ width: 150, height: 150 }} />
            </div>
          )}
        </div>
      ) : (
        <p>Proszę się zalogować, aby zobaczyć sklep.</p>
      )}
      <Footer/>
    </div>
  );
};

export default Shop;