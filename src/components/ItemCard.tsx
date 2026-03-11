import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { addToFavorites, removeFromFavorites } from '../lib/backend';
import { resolveAssetUrl } from '../lib/api';
import type { Item } from '../lib/api';

interface ItemCardProps {
  item: Item;
  onItemClick: (item: Item) => void;
  isFavorited?: boolean;
  onFavoriteChange?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick, isFavorited = false, onFavoriteChange }) => {
  const { user, isAuthenticated } = useAuth();

  const getConditionColor = (condition: string) => {
    const normalized = condition.toLowerCase();
    switch (normalized) {
      case 'new':
        return 'text-green-700 bg-green-100';
      case 'like_new':
      case 'like-new':
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-700 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated || !user) return;

    try {
      if (isFavorited) {
        await removeFromFavorites(user.id, item.id);
      } else {
        await addToFavorites(user.id, item.id);
      }
      onFavoriteChange?.();
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const fallbackImage = new URL('../public/pic/school.png', import.meta.url).href;
  const imageSrc = resolveAssetUrl(item.images?.[0]) || fallbackImage;
  const sellerName = item.seller?.name ?? item.seller?.email ?? 'Unknown seller';

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={() => onItemClick(item)}
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            handleFavoriteClick(e);
          }}
          className={`absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors ${
            !isAuthenticated ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={!isAuthenticated}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'}`} />
        </button>
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
          {item.condition}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-2xl font-bold text-blue-600 mb-2">${item.price}</p>
        
        <div className="flex items-center space-x-2 mb-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=3B82F6&color=fff`}
            alt={sellerName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{sellerName}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="text-xs">{item.category?.name}</span>
          <span className="text-xs">{formatDate(item.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
