import React, { useState } from 'react';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import NewItemModal from './components/NewItemModal';
import FavoritesModal from './components/FavoritesModal';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewItem = () => {
    setShowNewItemModal(true);
  };

  const handleShowFavorites = () => {
    setShowFavoritesModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={handleSearch}
        onNewItem={handleNewItem}
        onShowFavorites={handleShowFavorites}
      />

      <ProductsPage searchQuery={searchQuery} />

      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
      />

      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
      />
    </div>
  );
}

export default App;
