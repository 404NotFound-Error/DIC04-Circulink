import React, { useEffect, useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { getFavorites, addToFavorites, removeFromFavorites } from '../lib/backend';
import type { Favorite } from '../lib/api';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  location: string;
  seller: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [favoritesSet, setFavoritesSet] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      const { data } = await getFavorites(user.id);
      if (data) {
        const map: Record<string, boolean> = {};
        (data as Favorite[]).forEach((f) => {
          if (f.item?.id) map[f.item.id] = true;
        });
        setFavoritesSet(map);
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!isAuthenticated || !user) return;

    try {
      const isFav = !!favoritesSet[productId];
      if (isFav) {
        await removeFromFavorites(user.id, productId);
        setFavoritesSet((s) => ({ ...s, [productId]: false }));
      } else {
        await addToFavorites(user.id, productId);
        setFavoritesSet((s) => ({ ...s, [productId]: true }));
      }
    } catch (err) {
      console.error('Favorite toggle error', err);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t('noProductsFound')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product.id)}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
              <button
                onClick={(e) => toggleFavorite(e, product.id)}
                className={`absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="favorite"
                disabled={!isAuthenticated}
              >
                <Star className={`h-4 w-4 ${favoritesSet[product.id] ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
              </button>

            <div className="absolute top-2 left-2">
              <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                {t(`condition.${product.condition?.toString().toLowerCase().replace(/\s+/g,'_')}`) || product.condition}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product.title}
            </h3>

            {product.rating && (
              <div className="flex items-center space-x-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {product.reviewCount && (
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>

            <div className="flex items-center text-xs text-gray-500 mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              {product.location}
            </div>

            <div className="text-xs text-gray-500">
              {t('soldBy')} {product.seller}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
