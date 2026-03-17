import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { apiClient, Item } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

const BuyPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
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
        setError(err instanceof Error ? err.message : (lang === 'zh' ? '加载商品失败' : 'Failed to load products'));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [lang]);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const firstRow = products.slice(0, 8);
  const secondRow = products.slice(8, 16);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8fc594] via-[#c5e3bd] to-[#ecf8e6] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="text-2xl text-[#204932]">←</button>
          <h2 className="text-xl font-semibold text-[#204932]">{lang === 'zh' ? '继续购物' : 'Continue Shopping'}</h2>
        </div>

        <hr className="mb-6 border-t border-[#6fa677]/30" />

        {loading ? (
          <div className="py-20 text-center text-[#315842]">{lang === 'zh' ? '正在加载商品...' : 'Loading products...'}</div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">{error}</div>
        ) : (
          <>
            <section className="mb-8 rounded-[1.75rem] border border-white/40 bg-white/24 p-8 shadow-[0_24px_60px_rgba(27,79,49,0.12)] backdrop-blur-sm">
              <ProductGrid products={firstRow} onProductClick={handleProductClick} />
            </section>
            {secondRow.length > 0 && (
              <section className="rounded-[1.75rem] border border-white/40 bg-white/24 p-8 shadow-[0_24px_60px_rgba(27,79,49,0.12)] backdrop-blur-sm">
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
