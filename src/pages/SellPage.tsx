import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-sky-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate('/')}
            className="mr-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back
          </button>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-200 rounded-full px-12 py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">Sell Your Item</h1>
          </div>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-8 py-3 shadow-inner text-emerald-800">
            Basic Information
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 items-start">
          <div className="md:col-span-1">
            <div className="bg-emerald-100/60 rounded-xl p-8 h-72 flex flex-col items-center justify-center shadow-lg border border-emerald-200">
              <input
                ref={fileInputRef}
                onChange={() => {}}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
              />

              <button onClick={openFileDialog} className="flex items-center gap-2 text-emerald-900 text-lg">
                <span className="text-lg">📷</span>
                <span>Add your images</span>
              </button>

              <button className="mt-6 bg-emerald-200/80 rounded-md px-4 py-2 text-sm flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <span>AI Recognition</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-emerald-50 rounded-xl p-10 h-72 flex items-center justify-center border-2 border-emerald-200 shadow-[8px_8px_0_rgba(16,185,129,0.06)]">
              <div className="text-emerald-800 text-xl md:text-2xl">Describe your goods...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
