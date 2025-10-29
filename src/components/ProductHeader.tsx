import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface ProductHeaderProps {
  totalProducts: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onFilterToggle?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  totalProducts,
  sortBy,
  onSortChange,
  onFilterToggle
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{totalProducts}</span> results
          </span>

          {onFilterToggle && (
            <button
              onClick={onFilterToggle}
              className="lg:hidden flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Sort by:</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="relevant">Most Relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
