import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CategorySection from '../components/CategorySection';
import { apiClient, Item } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomeItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getItems({ status: 'ACTIVE', page: 1, pageSize: 18 });
        setItems(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : (lang === 'zh' ? '加载精选商品失败' : 'Failed to load featured items'));
      } finally {
        setLoading(false);
      }
    };

    loadHomeItems();
  }, [lang]);

  const mapped = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.images?.[0] || 'https://via.placeholder.com/300',
        condition: item.condition,
        seller: item.seller?.name || item.seller?.email || (lang === 'zh' ? '卖家' : 'Seller')
      })),
    [items, lang]
  );

  const sections = [
    { title: lang === 'zh' ? '🔥 精选商品' : '🔥 Featured Items', products: mapped.slice(0, 6), viewAll: '/products' },
    { title: lang === 'zh' ? '✨ 最新上架' : '✨ Recently Added', products: mapped.slice(6, 12), viewAll: '/products?sort=createdAt&order=desc' },
    { title: lang === 'zh' ? '💸 预算之选' : '💸 Budget Picks', products: mapped.slice(12, 18), viewAll: '/products?sort=price&order=asc' }
  ];

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gradient-to-b from-[#7fb58a] via-[#a4c6a5] to-[#d3f0c7]">
        {/* Hero Section */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <img
                src="/circulink-logo.png"
                alt="CIRCULINK"
                className="h-32 mx-auto mb-6"
                onError={(e) => {
                  // Fallback to text if image not found
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-6xl font-bold text-green-900 mb-4" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                CIRCULINK
              </h1>
              <p className="text-xl text-green-800 mb-8">
                {lang === 'zh' ? '🌱 校园循环经济平台 ♻️' : '🌱 Campus Circular Economy Platform ♻️'}
              </p>
              <div className="flex items-center justify-center gap-8 mb-8">
                <button
                  onClick={() => navigate('/buy')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-4 rounded-full transition-colors shadow-lg hover:shadow-xl text-lg"
                >
                  {lang === 'zh' ? '开始购物' : 'Start Shopping'}
                </button>
                <button
                  onClick={() => navigate('/sell')}
                  className="bg-white hover:bg-gray-50 text-green-700 font-semibold px-10 py-4 rounded-full transition-colors shadow-lg hover:shadow-xl text-lg border-2 border-green-600"
                >
                  {lang === 'zh' ? '出售物品' : 'Sell Items'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-16 text-green-900">{lang === 'zh' ? '正在加载精选商品...' : 'Loading featured items...'}</div>
        ) : error ? (
          <div className="text-center py-16 text-red-700">{error}</div>
        ) : (
          sections
            .filter((section) => section.products.length > 0)
            .map((section) => (
              <CategorySection
                key={section.title}
                title={section.title}
                products={section.products}
                onViewAll={() => navigate(section.viewAll)}
              />
            ))
        )}

        {/* Footer CTA */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-green-900 mb-4">
              {lang === 'zh' ? '加入可持续校园社区' : 'Join Our Sustainable Community'}
              </h2>
              <p className="text-lg text-green-800 mb-8">
              {lang === 'zh' ? '通过买卖与捐赠减少浪费，共建循环经济' : 'Buy, sell, and donate items to reduce waste and support circular economy'}
              </p>
            <button
              onClick={() => navigate('/about')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              {lang === 'zh' ? '了解更多' : 'Learn More About Us'}
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
