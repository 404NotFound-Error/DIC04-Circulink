import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ItemData {
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: string;
  category: string;
}

const SellReviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock item data from form (in real app, this would come from state/props)
  const itemData: ItemData = {
    title: 'An ergonomic laptop stand suitable for student study spaces',
    description: 'helping improve posture and desk organization.',
    price: 99.99,
    images: [
      'https://via.placeholder.com/400x400?text=Laptop+Stand',
    ],
    condition: 'EXCELLENT',
    category: 'Electronics',
  };

  const handleAccept = () => {
    // In real app, submit the item to API
    console.log('Item accepted:', itemData);
    navigate('/sell/success', { state: { item: itemData } });
  };

  const handleRevise = () => {
    // Navigate back to sell form to edit
    navigate('/sell');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-200 rounded-full px-8 md:px-12 py-3 md:py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-800">Sell Your Item</h1>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base shadow-inner text-emerald-800">
            Basic Information
          </div>
        </div>

        {/* Review Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
          {/* Image */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg overflow-hidden">
              {itemData.images[0] && (
                <img
                  src={itemData.images[0]}
                  alt={itemData.title}
                  className="w-full h-64 md:h-72 object-cover rounded-xl"
                />
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className="md:col-span-2">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 md:p-8 shadow-[8px_8px_0_rgba(16,185,129,0.06)]">
              {/* Title */}
              <h2 className="text-lg md:text-xl font-semibold text-emerald-900 mb-3">
                {itemData.title}
              </h2>

              {/* Description */}
              <p className="text-sm md:text-base text-emerald-800 mb-6 leading-relaxed">
                {itemData.description}
              </p>

              {/* Hashtags */}
              <div className="mb-6 space-y-2">
                <p className="text-emerald-700 text-sm">#LaptopStand</p>
                <p className="text-emerald-700 text-sm">#Ergonomic</p>
                <p className="text-emerald-700 text-sm">#DeskSetup</p>
                <p className="text-emerald-700 text-sm">#StudyEssential</p>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mb-8 bg-white rounded-lg p-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Price</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-700">
                    ${itemData.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Condition</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-700">
                    {itemData.condition}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAccept}
                  className="flex-1 px-6 py-2 md:py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition-colors shadow-md text-sm md:text-base"
                >
                  Accept
                </button>
                <button
                  onClick={handleRevise}
                  className="flex-1 px-6 py-2 md:py-3 bg-emerald-400 hover:bg-emerald-500 text-white font-medium rounded-full transition-colors shadow-md text-sm md:text-base"
                >
                  Revise
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellReviewPage;
