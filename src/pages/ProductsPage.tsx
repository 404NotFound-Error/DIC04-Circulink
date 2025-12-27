import React, { useState } from 'react';
import Layout from '../components/Layout';
import CategorySidebar from '../components/CategorySidebar';
import ProductGrid from '../components/ProductGrid';
import ProductHeader from '../components/ProductHeader';
import CategorySection from '../components/CategorySection';
import { useLanguage } from '../context/LanguageContext';

const sampleProducts = [
  {
    id: '1',
    title: 'Academic Building Poster',
    price: 9.5,
    image: '../src/public/pic/ab_building.jpg',
    condition: 'Like New',
    location: 'Stanford, CA',
    seller: 'John D.',
    rating: 4.2,
    reviewCount: 24
  },
  {
    id: '2',
    title: 'Campus Print',
    price: 0,
    image: '../src/public/pic/school.png',
    condition: 'Excellent',
    location: 'Suzhou',
    seller: 'Sarah M.',
    rating: 5.0,
    reviewCount: 18
  },
  {
    id: '3',
    title: 'Group Photo Print',
    price: 1,
    image: '../src/public/pic/group.jpg',
    condition: 'Excellent',
    location: 'DKU',
    seller: 'Max W.',
    rating: 5.0,
    reviewCount: 18
  },
];

const clothing = sampleProducts;
const furniture = sampleProducts;
const electronics = sampleProducts;
const office = sampleProducts;
const food = sampleProducts;
const essentials = sampleProducts;
const arts = sampleProducts;

interface ProductsPageProps {
  searchQuery?: string;
  onNavigateToCategory: (categoryName: string, products: any[]) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ searchQuery, onNavigateToCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const { t } = useLanguage();

  const titleClothing = t('category.clothing');
  const titleFurniture = t('category.furniture');
  const titleElectronics = t('category.electronics');
  const titleBooks = t('category.books');
  const titleSports = t('category.sports');
  const titleOther = t('category.other');
  const titleEntertainment = t('category.entertainment');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    let sorted = [...filteredProducts];

    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
  };

  return (
    <Layout
      sidebar={
        <CategorySidebar
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      }
    >
      {/* Hero / Main image */}
      <div className="w-full">
        <div className="w-full h-64 md:h-96 bg-cover bg-center rounded-lg overflow-hidden mb-6" style={{ backgroundImage: `url(/hero-banner.svg)` }}>
              <div className="w-full h-full bg-black/10 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{t('welcome')}</h1>
              </div>
        </div>
      </div>

      {/* About moved to separate page; not rendered on homepage */}
      {/* Category Sections (full-width backgrounds with centered content) */}
          <CategorySection title={titleClothing} products={clothing} onViewAll={() => onNavigateToCategory(titleClothing, clothing)} />
          <CategorySection title={titleFurniture} products={furniture} onViewAll={() => onNavigateToCategory(titleFurniture, furniture)} />
          <CategorySection title={titleElectronics} products={electronics} onViewAll={() => onNavigateToCategory(titleElectronics, electronics)} />
          <CategorySection title={titleBooks} products={office} onViewAll={() => onNavigateToCategory(titleBooks, office)} />
          <CategorySection title={titleSports} products={food} onViewAll={() => onNavigateToCategory(titleSports, food)} />
          <CategorySection title={titleOther} products={essentials} onViewAll={() => onNavigateToCategory(titleOther, essentials)} />
          <CategorySection title={titleEntertainment} products={arts} onViewAll={() => onNavigateToCategory(titleEntertainment, arts)} />

      <ProductHeader
        totalProducts={filteredProducts.length}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <ProductGrid
        products={filteredProducts}
        onProductClick={handleProductClick}
      />
    </Layout>
  );
};

export default ProductsPage;
