import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Package, Laptop, Book, Home, Shirt, Bike, Gamepad2, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  subcategories?: string[];
}

const categories: Category[] = [
  { id: 'electronics', name: 'category.electronics', icon: Laptop, subcategories: ['laptops','phones','tablets','accessories','gaming_consoles'] },
  { id: 'books', name: 'category.books', icon: Book, subcategories: ['engineering','science','arts','business','literature'] },
  { id: 'furniture', name: 'category.furniture', icon: Home, subcategories: ['beds','desks','chairs','storage','decor'] },
  { id: 'clothing', name: 'category.clothing', icon: Shirt, subcategories: ['mens','womens','shoes','accessories'] },
  { id: 'sports', name: 'category.sports', icon: Bike, subcategories: ['bicycles','gym_equipment','camping','sports_gear'] },
  { id: 'entertainment', name: 'category.entertainment', icon: Gamepad2, subcategories: ['video_games','movies','board_games','collectibles'] },
  { id: 'music', name: 'category.music', icon: Music, subcategories: ['guitars','keyboards','drums','dj_equipment'] },
  { id: 'other', name: 'category.other', icon: Package, subcategories: [] }
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
                  <span className="text-sm">{t(category.name)}</span>
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
                      {t(`subcategory.${category.id}.${sub}`)}
                    </button>
                  ))}
                </div>
              )}
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
