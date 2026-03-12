import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { apiClient, Item } from '../lib/api';

const BuyPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getItems({ status: 'ACTIVE', page: 1, pageSize: 24 });
        setProducts(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const firstRow = products.slice(0, 8);
  const secondRow = products.slice(8, 16);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="text-2xl text-gray-800">←</button>
          <h2 className="text-xl font-semibold">Shopping Continue</h2>
        </div>

        <hr className="border-t border-gray-200 mb-6" />

        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">{error}</div>
        ) : (
          <>
            <section className="bg-emerald-50/60 rounded-xl p-8 mb-8">
              <ProductGrid products={firstRow} onProductClick={handleProductClick} />
            </section>
            {secondRow.length > 0 && (
              <section className="bg-emerald-50/60 rounded-xl p-8">
                <ProductGrid products={secondRow} onProductClick={handleProductClick} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyPage;
