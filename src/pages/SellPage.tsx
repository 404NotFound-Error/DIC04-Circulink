import React from 'react';

interface SellPageProps {
  onNavigateBack: () => void;
}

const SellPage: React.FC<SellPageProps> = ({ onNavigateBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={onNavigateBack}
          className="mb-6 px-4 py-2 bg-[#5cb85c] text-white rounded-lg hover:bg-[#4cae4c] transition-colors"
        >
          Back to Home
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sell Your Items</h1>
          <p className="text-gray-600 text-lg">Sell page coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
