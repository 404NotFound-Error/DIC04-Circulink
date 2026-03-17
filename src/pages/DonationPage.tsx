import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';

const DonationPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { user } = useAuth();
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#82bf86] via-[#c7e3be] to-[#eff8e9] py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-14 h-64 w-64 rounded-full bg-white/22 blur-3xl" />
        <div className="absolute right-[-4rem] top-24 h-72 w-72 rounded-full bg-[#dff6d6]/42 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8acb91]/24 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="mb-8 rounded-[2rem] border border-white/45 bg-gradient-to-br from-white/42 via-white/24 to-[#eaffea]/18 p-10 shadow-[0_28px_80px_rgba(23,59,43,0.16)] backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center py-10">
            <h2 className="text-6xl md:text-7xl font-black tracking-[0.28em] text-[#1a5a37] drop-shadow-[0_10px_28px_rgba(30,96,58,0.14)]">
              {lang === 'zh' ? '捐 赠' : 'DONATION'}
            </h2>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/donation/form')}
                className="rounded-full border border-white/55 bg-[#2d7b45] px-10 py-4 font-semibold text-white shadow-[0_18px_45px_rgba(45,123,69,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#236139]"
              >
                {lang === 'zh' ? '开始捐赠 →' : 'Start Donating →'}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-block rounded-full border border-white/55 bg-white/42 px-10 py-4 shadow-[0_20px_50px_rgba(23,59,43,0.12)] backdrop-blur-xl">
            <div className="text-center text-lg font-semibold text-[#26563a] md:text-xl">
              {lang === 'zh' ? '加入 DKU 可持续捐赠网络，让日常选择产生真实影响。' : "Join DKU's sustainable donation network and make your everyday impact count."}
            </div>
          </div>
        </div>

        <p className="mx-auto mb-10 max-w-4xl text-center text-lg leading-9 text-[#2c5b3f] md:text-xl">
          {lang === 'zh'
            ? 'Circulink x Buy42（上海公益商店）——让闲置物品变成善意流动！'
            : 'Circulink x Buy42 (the Shanghai-based charity store) — Turning idle goods into kindness!'}
        </p>

        {user?.role === 'ADMIN' && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/admin/donations')}
              className="rounded-full border border-white/60 bg-white/42 px-8 py-3 font-semibold text-[#25563b] shadow-[0_18px_44px_rgba(23,59,43,0.1)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/55"
            >
              {lang === 'zh' ? '进入捐赠管理后台' : 'Open Donation Admin'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;
