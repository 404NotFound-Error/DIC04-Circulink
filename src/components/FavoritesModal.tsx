import React, { useState, useEffect, useCallback } from 'react';
import { X, Heart, Loader, AlertCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient, Favorite } from '../lib/api';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadFavorites();
    }
  }, [isOpen, user, loadFavorites]);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFavorites();
      setFavorites(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRemoveFavorite = async (favoriteId: string, itemId: string) => {
    try {
      await apiClient.removeFavorite(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.itemId !== itemId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const handleViewItem = (itemId: string) => {
    onClose();
    navigate(`/product/${itemId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto w-full">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
            {favorites.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">({favorites.length})</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-green-600" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!loading && !error && favorites.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No favorites yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start exploring and save your favorite items!</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Browse Products
              </button>
            </div>
          )}

          {!loading && !error && favorites.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite) => {
                const item = favorite.item;
                if (!item) return null;

                // Parse images
                let imageUrl = 'https://via.placeholder.com/300';
                try {
                  const images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                  imageUrl = Array.isArray(images) ? images[0] : imageUrl;
                } catch {
                  imageUrl = item.images || imageUrl;
                }

                return (
                  <div
                    key={favorite.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="aspect-square bg-gray-100 relative cursor-pointer"
                      onClick={() => handleViewItem(item.id)}
                    >
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                          handleRemoveFavorite(favorite.id, item.id);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3
                        className="font-medium text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-green-600"
                        onClick={() => handleViewItem(item.id)}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">
                          ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                        </span>
                        <span className="text-sm text-gray-500">{item.condition}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
