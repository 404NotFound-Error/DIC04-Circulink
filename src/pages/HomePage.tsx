import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CategorySection from '../components/CategorySection';

// Sample data for categories
const sampleProducts = [
  {
    id: '1',
    title: 'Sample Product 1',
    price: 99.99,
    image: 'https://via.placeholder.com/300',
    condition: 'GOOD',
    location: 'Campus',
    seller: 'User 1',
  },
  {
    id: '2',
    title: 'Sample Product 2',
    price: 149.99,
    image: 'https://via.placeholder.com/300',
    condition: 'LIKE_NEW',
    location: 'Campus',
    seller: 'User 2',
  },
  {
    id: '3',
    title: 'Sample Product 3',
    price: 79.99,
    image: 'https://via.placeholder.com/300',
    condition: 'GOOD',
    location: 'Campus',
    seller: 'User 3',
  },
  {
    id: '4',
    title: 'Sample Product 4',
    price: 199.99,
    image: 'https://via.placeholder.com/300',
    condition: 'NEW',
    location: 'Campus',
    seller: 'User 4',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
                🌱 校园循环经济平台 Campus Circular Economy Platform ♻️
              </p>
              <div className="flex items-center justify-center gap-8 mb-8">
                <button
                  onClick={() => navigate('/buy')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-4 rounded-full transition-colors shadow-lg hover:shadow-xl text-lg"
                >
                  开始购物 Start Shopping
                </button>
                <button
                  onClick={() => navigate('/sell')}
                  className="bg-white hover:bg-gray-50 text-green-700 font-semibold px-10 py-4 rounded-full transition-colors shadow-lg hover:shadow-xl text-lg border-2 border-green-600"
                >
                  出售物品 Sell Items
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        <CategorySection
          title="🧥 Clothing"
          products={sampleProducts}
          onViewAll={() => navigate('/category/clothing')}
        />

        <CategorySection
          title="🪑 Furniture"
          products={sampleProducts}
          onViewAll={() => navigate('/category/furniture')}
        />

        <CategorySection
          title="💻 Electronics"
          products={sampleProducts}
          onViewAll={() => navigate('/category/electronics')}
        />

        <CategorySection
          title="📚 Office & Study Supplies"
          products={sampleProducts}
          onViewAll={() => navigate('/category/office-supplies')}
        />

        <CategorySection
          title="🍕 Food & Snacks"
          products={sampleProducts}
          onViewAll={() => navigate('/category/food-snacks')}
        />

        <CategorySection
          title="🧴 Daily Essentials"
          products={sampleProducts}
          onViewAll={() => navigate('/category/daily-essentials')}
        />

        <CategorySection
          title="🎨 Art & Decor"
          products={sampleProducts}
          onViewAll={() => navigate('/category/art-decor')}
        />

        {/* Footer CTA */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              Join Our Sustainable Community
            </h2>
            <p className="text-lg text-green-800 mb-8">
              Buy, sell, and donate items to reduce waste and support circular economy
            </p>
            <button
              onClick={() => navigate('/about')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              Learn More About Us
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
