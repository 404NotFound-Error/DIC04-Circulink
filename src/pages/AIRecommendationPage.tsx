import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RecommendedItem {
  id: string;
  title: string;
  price: string;
  image: string;
  isFavorite?: boolean;
  inCart?: boolean;
}

const AIRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([
    {
      id: '1',
      title: 'Sample Product 1',
      price: '$25.00',
      image: '/placeholder.jpg',
      isFavorite: false,
      inCart: false
    },
    {
      id: '2',
      title: 'Sample Product 2',
      price: '$45.00',
      image: '/placeholder.jpg',
      isFavorite: false,
      inCart: false
    }
  ]);

  const handleSendQuery = async () => {
    if (!userQuery.trim()) return;

    setIsLoading(true);
    // TODO: 集成实际的AI推荐API
    setTimeout(() => {
      setIsLoading(false);
      // 这里会从API获取推荐结果
    }, 1000);
  };

  const toggleFavorite = (id: string) => {
    setRecommendations(recommendations.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const toggleCart = (id: string) => {
    setRecommendations(recommendations.map(item =>
      item.id === id ? { ...item, inCart: !item.inCart } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-md px-8 py-4 border-2 border-emerald-200">
            <h1 className="text-2xl font-bold text-emerald-900">
              {t('tellUsYourNeeds')}
            </h1>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Query Input */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-emerald-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Ask Circulink anything...
            </label>
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="(e.g., I'm a freshman looking for cheap electronics, and the preferred price is from x to y.)"
              className="w-full h-40 sm:h-64 p-4 border-2 border-emerald-200 rounded-lg resize-none focus:outline-none focus:border-emerald-500 text-gray-700 placeholder:text-gray-400"
            />
            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                onClick={handleSendQuery}
                disabled={isLoading || !userQuery.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    {t('send')}
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Recommendation Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-emerald-100">
            <h2 className="text-lg sm:text-xl font-bold text-emerald-900 mb-4 sm:mb-6 text-center">
              Recommendation Panel
            </h2>
            
            {/* Recommendation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-4 border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-gray-400 text-xs">Image</div>
                  </div>

                  {/* Icons */}
                  <div className="flex justify-end gap-2 mb-2">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="p-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          item.isFavorite
                            ? 'fill-red-500 text-red-500'
                            : 'text-emerald-600'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => toggleCart(item.id)}
                      className="p-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      <ShoppingCart
                        className={`h-4 w-4 ${
                          item.inCart
                            ? 'fill-emerald-600 text-emerald-600'
                            : 'text-yellow-500'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1 mb-3">
                    <div className="text-sm font-semibold text-gray-600">Title</div>
                    <div className="text-xs text-gray-500 truncate">{item.title}</div>
                    <div className="text-sm font-semibold text-gray-600 mt-2">Price</div>
                    <div className="text-xs text-gray-500">{item.price}</div>
                  </div>

                  {/* View Item Button */}
                  <button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-full py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View Item
                  </button>
                </div>
              ))}
            </div>

            {/* Navigation Arrow */}
            <div className="flex justify-end">
              <button className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors">
                <ChevronRight className="h-6 w-6 text-emerald-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationPage;
