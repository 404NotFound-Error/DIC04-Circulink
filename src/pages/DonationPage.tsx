import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DonationPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-sky-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-emerald-100/80 to-sky-100/80 rounded-xl p-10 mb-8 shadow-inner border border-emerald-200">
          <div className="flex flex-col items-center justify-center py-10">
            <h2 className="text-6xl md:text-7xl font-extrabold text-emerald-700 tracking-widest drop-shadow-md">{lang === 'zh' ? '捐 赠' : 'DONATION'}</h2>
            <div className="mt-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-white/30 rounded-md flex items-center justify-center">🌄</div>
              <div className="text-2xl font-semibold text-emerald-700">&amp;</div>
              <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">🍃</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-200 rounded-full px-10 py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
            <div className="text-lg md:text-xl font-semibold text-emerald-800">
              {lang === 'zh' ? '加入 DKU 可持续捐赠网络，让日常选择产生真实影响。' : "Join DKU's sustainable donation network and make your everyday impact count."}
            </div>
          </div>
        </div>

        <p className="text-emerald-700 text-lg md:text-xl mb-10">
          {lang === 'zh'
            ? 'Circulink x Buy42（上海公益商店）——让闲置物品变成善意流动！'
            : 'Circulink x Buy42 (the Shanghai-based charity store) — Turning idle goods into kindness!'}
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/donation/form')}
            className="bg-emerald-200 hover:bg-emerald-300 text-emerald-900 font-semibold rounded-full px-8 py-4 shadow-md"
          >
            {lang === 'zh' ? '开始捐赠 →' : 'Start Donating →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
