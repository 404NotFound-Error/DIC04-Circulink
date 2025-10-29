import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Package, Laptop, Book, Home, Shirt, Bike, Gamepad2, Music } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  subcategories?: string[];
}

const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Laptop,
    subcategories: ['Laptops', 'Phones', 'Tablets', 'Accessories', 'Gaming Consoles']
  },
  {
    id: 'books',
    name: 'Books & Textbooks',
    icon: Book,
    subcategories: ['Engineering', 'Science', 'Arts', 'Business', 'Literature']
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: Home,
    subcategories: ['Beds', 'Desks', 'Chairs', 'Storage', 'Decor']
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: Shirt,
    subcategories: ['Mens', 'Womens', 'Shoes', 'Accessories']
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    icon: Bike,
    subcategories: ['Bicycles', 'Gym Equipment', 'Camping', 'Sports Gear']
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Gamepad2,
    subcategories: ['Video Games', 'Movies', 'Board Games', 'Collectibles']
  },
  {
    id: 'music',
    name: 'Musical Instruments',
    icon: Music,
    subcategories: ['Guitars', 'Keyboards', 'Drums', 'DJ Equipment']
  },
  {
    id: 'other',
    name: 'Other',
    icon: Package,
    subcategories: []
  }
];

interface CategorySidebarProps {
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ selectedCategory, onCategorySelect }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['electronics']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>

      <button
        onClick={() => onCategorySelect('all')}
        className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-colors ${
          selectedCategory === 'all' || !selectedCategory
            ? 'bg-orange-50 text-orange-600 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        All Products
      </button>

      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);
          const isSelected = selectedCategory === category.id;

          return (
            <div key={category.id}>
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  onCategorySelect(category.id);
                  if (category.subcategories && category.subcategories.length > 0) {
                    toggleCategory(category.id);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{category.name}</span>
                </div>
                {category.subcategories && category.subcategories.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category.id);
                    }}
                    className="p-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              {isExpanded && category.subcategories && category.subcategories.length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => onCategorySelect(`${category.id}-${sub.toLowerCase()}`)}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                        selectedCategory === `${category.id}-${sub.toLowerCase()}`
                          ? 'text-orange-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>Under $25</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>$25 to $50</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>$50 to $100</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>$100 & Above</span>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Condition</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>New</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>Like New</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>Good</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>Fair</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
