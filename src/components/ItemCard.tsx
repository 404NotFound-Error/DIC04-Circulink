import React from 'react';
import { Heart, Eye, MapPin, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { addToFavorites, removeFromFavorites } from '../lib/backend';

interface ItemCardProps {
  item: any;
  onItemClick: (item: any) => void;
  isFavorited?: boolean;
  onFavoriteChange?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick, isFavorited = false, onFavoriteChange }) => {
  const { user, isAuthenticated } = useAuth();

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
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

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={() => onItemClick(item)}
    >
      <div className="relative">
        <img
          src={item.images[0]}
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
          {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-2xl font-bold text-blue-600 mb-2">${item.price}</p>
        
        <div className="flex items-center space-x-2 mb-3">
          <img
            src={item.seller?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.seller?.full_name || 'User')}&background=3B82F6&color=fff`}
            alt={item.seller?.full_name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{item.seller?.full_name}</span>
          <span className="text-xs text-gray-500">{item.seller?.university}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{item.location}</span>
          </div>
          <span>{formatDate(item.created_at)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{item.views}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;