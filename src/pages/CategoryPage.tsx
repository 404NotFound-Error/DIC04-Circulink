import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

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
  isFavorite?: boolean;
}

interface CategoryPageProps {
  categoryName: string;
  products: Product[];
  onNavigateBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName, products, onNavigateBack }) => {
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const sorted = [...products];

    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      {/* Back Button and Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onNavigateBack}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6 mr-2" />
          <span className="text-lg">Back</span>
        </button>

        {/* Category Header with Title and Filters */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800">{categoryName.toUpperCase()}</h1>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:border-green-500"
                >
                  <option value="relevant">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              <div className="relative">
                <select className="appearance-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:border-green-500">
                  <option>Price</option>
                  <option>Under $10</option>
                  <option>$10 - $50</option>
                  <option>$50 - $100</option>
                  <option>Over $100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              {/* Image Container */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Favorite Star */}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <svg
                    className={`w-6 h-6 ${product.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill={product.isFavorite ? 'currentColor' : 'none'}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-gray-900 font-medium text-sm truncate">{product.title}</h3>
                <p className="text-gray-700 font-bold mt-2">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
