import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { Item } from '../lib/api';

const sampleProducts: Item[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `p-${i + 1}`,
  title: `Sample Product ${i + 1}`,
  description: 'A sample product for demonstration',
  price: `${20 * (i + 1)}`,
  condition: 'GOOD',
  status: 'available',
  categoryId: 'cat-1',
  sellerId: 'seller-1',
  images: [`https://via.placeholder.com/600x600?text=Item+${i + 1}`],
  category: { id: 'cat-1', name: 'Electronics', slug: 'electronics', createdAt: new Date().toISOString() },
  seller: { id: 'seller-1', email: 'seller@example.com', name: 'Sample Seller' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const BuyPage: React.FC = () => {
  const navigate = useNavigate();
  const handleProductClick = (id: string) => {
    console.log('product clicked', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="text-2xl text-gray-800">←</button>
          <h2 className="text-xl font-semibold">Shopping Continue</h2>
        </div>

        <hr className="border-t border-gray-200 mb-6" />

        <section className="bg-emerald-50/60 rounded-xl p-8 mb-8">
          <ProductGrid products={sampleProducts.slice(0,4)} onProductClick={handleProductClick} />
        </section>

        <section className="bg-emerald-50/60 rounded-xl p-8">
          <ProductGrid products={sampleProducts.slice(4,8)} onProductClick={handleProductClick} />
        </section>
      </div>
    </div>
  );
};

export default BuyPage;
