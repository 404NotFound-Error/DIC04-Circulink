import React from 'react';
import { Star, MapPin } from 'lucide-react';

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
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
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
            <div className="absolute top-2 left-2">
              <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                {product.condition}
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
              Sold by {product.seller}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
