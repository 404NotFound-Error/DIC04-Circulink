import React, { useState } from 'react';
import Layout from '../components/Layout';
import CategorySidebar from '../components/CategorySidebar';
import ProductGrid from '../components/ProductGrid';
import ProductHeader from '../components/ProductHeader';

const sampleProducts = [
  {
    id: '1',
    title: 'school Academic Building on sale',
    price: 9.5,
    image: '../src/public/pic/ab_building.jpg',
    condition: 'Like New',
    location: 'Stanford, CA',
    seller: 'John D.',
    rating: 1.9,
    reviewCount: 24
  },
  {
    id: '2',
    title: 'DKU campus',
    price: '0',
    image: '../src/public/pic/school.png',
    condition: 'Excellent',
    location: 'Suzhou',
    seller: 'Sarah M.',
    rating: 5.0,
    reviewCount: 18
  },
  {
    id: '3',
    title: 'Develop Group',
    price: '0.99999',
    image: '../src/public/pic/group.jpg',
    condition: 'Excellent',
    location: 'DKU',
    seller: 'Max W.',
    rating: 5.0,
    reviewCount: 18
  },
];

interface ProductsPageProps {
  searchQuery?: string;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);

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
