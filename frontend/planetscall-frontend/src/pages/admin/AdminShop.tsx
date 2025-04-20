import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  addItems, 
  removeItems, 
  updateItem, 
  addCategory, 
  removeCategory, 
  updateCategory,
  getCategories,
  getItemsByCategory
} from '../../services/shopService';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import NotAdmin from '../Additional/NotAdmin';

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
  rarity: string;
  categoryId: number;
}

interface Category {
  id: number;
  title: string;
  image: string;
}

const AdminShop = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dane formularzy
  const [itemForm, setItemForm] = useState<Omit<Item, 'id'>>({ 
    title: '', 
    price: 0, 
    image: '',
    rarity: '',
    categoryId: 0
  });
  
  const [categoryForm, setCategoryForm] = useState<Omit<Category, 'id'>>({ 
    title: '', 
    image: ''
  });
  
  // Listy danych
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  // Pobieranie kategorii przy załadowaniu
  useEffect(() => {
    if (token && user?.isAdmin) {
      fetchCategories();
    }
  }, [token, user?.isAdmin]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(token!);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (categoryId: number) => {
    try {
      setLoading(true);
      const data = await getItemsByCategory(token!, categoryId);
      setItems(data);
      setSelectedCategory(categoryId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItemForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'categoryId' ? Number(value) : value
    }));
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      setLoading(true);
      await addItems(
        token, 
        itemForm.categoryId,
        itemForm.price,
        itemForm.image,
        itemForm.rarity,
        itemForm.title
      );
      setSuccess('Przedmiot został dodany pomyślnie');
      if (itemForm.categoryId) {
        fetchItems(itemForm.categoryId);
      }
      setItemForm({ 
        title: '', 
        price: 0, 
        image: '',
        rarity: '',
        categoryId: 0
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      setLoading(true);
      await addCategory(token, categoryForm.title, categoryForm.image);
      setSuccess('Kategoria została dodana pomyślnie');
      fetchCategories();
      setCategoryForm({ title: '', image: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!token) return;
    
    try {
      setLoading(true);
      await removeItems(token);
      // Uwaga: Twój removeItems nie przyjmuje ID, może trzeba będzie poprawić
      setSuccess('Przedmiot został usunięty pomyślnie');
      if (selectedCategory) {
        fetchItems(selectedCategory);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!token) return;
    
    try {
      setLoading(true);
      await removeCategory(token);
      // Uwaga: Twój removeCategory nie przyjmuje ID, może trzeba będzie poprawić
      setSuccess('Kategoria została usunięta pomyślnie');
      fetchCategories();
      setItems([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Header/>
        <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
        <Footer/>
      </div>
    );   
  }

  if(!user?.isAdmin) {
    return (<NotAdmin/>)  
  }

  return (
    <div className="app-container">
      <Header />
      <section>
        <div>
          <h1>Panel administracyjny sklepu</h1>
          <Link to="/admin/">Powrót do panelu admina</Link>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {loading && <p>Ładowanie...</p>}

          <div>
            <h2>Kategorie</h2>
            
            <form onSubmit={handleAddCategory}>
              <h3>Dodaj nową kategorię</h3>
              <div>
                <label>Tytuł:</label>
                <input
                  type="text"
                  name="title"
                  value={categoryForm.title}
                  onChange={handleCategoryInputChange}
                  required
                />
              </div>
              <div>
                <label>Obraz (URL):</label>
                <input
                  type="text"
                  name="image"
                  value={categoryForm.image}
                  onChange={handleCategoryInputChange}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                Dodaj kategorię
              </button>
            </form>

            <ul>
              {categories.map(category => (
                <li key={category.id}>
                  <h3>{category.title}</h3>
                  <img src={category.image} alt={category.title} style={{ maxWidth: '100px' }} />
                  <button onClick={() => fetchItems(category.id)}>
                    Pokaż przedmioty
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id)} disabled={loading}>
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Przedmioty</h2>
            
            <form onSubmit={handleAddItem}>
              <h3>Dodaj nowy przedmiot</h3>
              <div>
                <label>Tytuł:</label>
                <input
                  type="text"
                  name="title"
                  value={itemForm.title}
                  onChange={handleItemInputChange}
                  required
                />
              </div>
              <div>
                <label>Cena:</label>
                <input
                  type="number"
                  name="price"
                  value={itemForm.price}
                  onChange={handleItemInputChange}
                  required
                />
              </div>
              <div>
                <label>Obraz (URL):</label>
                <input
                  type="text"
                  name="image"
                  value={itemForm.image}
                  onChange={handleItemInputChange}
                  required
                />
              </div>
              <div>
                <label>Rzadkość:</label>
                <input
                  type="text"
                  name="rarity"
                  value={itemForm.rarity}
                  onChange={handleItemInputChange}
                  required
                />
              </div>
              <div>
                <label>Kategoria:</label>
                <select
                  name="categoryId"
                  value={itemForm.categoryId}
                  onChange={handleItemInputChange}
                  required
                >
                  <option value="0">Wybierz kategorię</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={loading}>
                Dodaj przedmiot
              </button>
            </form>

            {selectedCategory > 0 && (
              <div>
                <h3>Przedmioty w kategorii: {
                  categories.find(c => c.id === selectedCategory)?.title
                }</h3>
                <ul>
                  {items.map(item => (
                    <li key={item.id}>
                      <h4>{item.title}</h4>
                      <p>Cena: {item.price} zł</p>
                      <p>Rzadkość: {item.rarity}</p>
                      <img src={item.image} alt={item.title} style={{ maxWidth: '100px' }} />
                      <button onClick={() => handleDeleteItem(item.id)} disabled={loading}>
                        Usuń
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminShop;