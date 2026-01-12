import React from 'react';
import { Package, Laptop, Book, Home, Shirt, Bike, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

// Only keep the specified top-level categories (no subcategories)
const categories: Category[] = [
  { id: 'clothing', name: 'category.clothing', icon: Shirt },
  { id: 'furniture', name: 'category.furniture', icon: Home },
  { id: 'electronics', name: 'category.electronics', icon: Laptop },
  { id: 'books', name: 'category.books', icon: Book },
  { id: 'sports', name: 'category.sports', icon: Bike },
  { id: 'other', name: 'category.other', icon: Package },
  { id: 'entertainment', name: 'category.entertainment', icon: Gamepad2 }
];

interface CategorySidebarProps {
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ selectedCategory, onCategorySelect }) => {
  const { t } = useLanguage();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{t('categoriesTitle')}</h2>

      <button
        onClick={() => onCategorySelect('all')}
        className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-colors ${
          selectedCategory === 'all' || !selectedCategory
            ? 'bg-orange-50 text-orange-600 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        {t('allProducts')}
      </button>

      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
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
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{t(category.name)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('priceRange') || 'Price Range'}</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('price.under25')}</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('price.25to50')}</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('price.50to100')}</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('price.above100')}</span>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('conditionTitle')}</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('condition.new')}</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('condition.like_new')}</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('condition.good')}</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span>{t('condition.fair')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
