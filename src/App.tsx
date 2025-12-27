import React, { useState } from 'react';
import Header from './components/Header';
import { LanguageProvider } from './context/LanguageContext';
import ProductsPage from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import NewItemModal from './components/NewItemModal';
import FavoritesModal from './components/FavoritesModal';

interface Product {
  id: string;
  title: string;
  price: number | string;
  image: string;
  condition?: string;
  location?: string;
  seller?: string;
  rating?: number;
  reviewCount?: number;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'about' | 'cart' | 'category'>('home');
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; products: Product[] } | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewItem = () => {
    setShowNewItemModal(true);
  };

  const handleShowFavorites = () => {
    setShowFavoritesModal(true);
  };

  const handleNavigateToProfile = () => {
    setCurrentPage('profile');
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  const handleNavigateToCart = () => {
    setCurrentPage('cart');
  };

  const handleNavigateToCategory = (categoryName: string, products: Product[]) => {
    setSelectedCategory({ name: categoryName, products });
    setCurrentPage('category');
  };

  const handleNavigateBack = () => {
    setCurrentPage('home');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={handleSearch}
          onNewItem={handleNewItem}
          onShowFavorites={handleShowFavorites}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToAbout={handleNavigateToAbout}
          onNavigateToCart={handleNavigateToCart}
        />

        {currentPage === 'home' ? (
          <>
            <ProductsPage searchQuery={searchQuery} onNavigateToCategory={handleNavigateToCategory} />

            <NewItemModal
              isOpen={showNewItemModal}
              onClose={() => setShowNewItemModal(false)}
            />
          </>
        ) : currentPage === 'profile' ? (
          <ProfilePage onNavigateBack={handleNavigateBack} />
        ) : currentPage === 'about' ? (
          <AboutPage onNavigateBack={handleNavigateBack} />
        ) : currentPage === 'cart' ? (
          <CartPage onNavigateBack={handleNavigateBack} />
        ) : currentPage === 'category' && selectedCategory ? (
          <CategoryPage
            categoryName={selectedCategory.name}
            products={selectedCategory.products}
            onNavigateBack={handleNavigateBack}
          />
        ) : null}
        
        <FavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
