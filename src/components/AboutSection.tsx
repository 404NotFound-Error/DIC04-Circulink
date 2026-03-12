import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AboutSection: React.FC = () => {
  const { lang } = useLanguage();
  const copy = lang === 'zh'
    ? {
        aboutTitle: '关于 Circulink',
        aboutBody:
          'Circulink 是面向 DKU 社区的可持续二手交易平台。我们通过结构化信息、可信身份和更好的搜索体验，解决传统群聊交易中信息混乱、检索困难与信任不足的问题。\n\n结合 AI 分类、公益捐赠联动和校园身份验证，平台帮助学生、教师与员工更高效、更安全地流转闲置物品，推动校园可持续发展。',
        missionTitle: '使命与愿景',
        missionBody:
          '可持续：让闲置资源再利用，减少浪费，推动循环经济。\n\n社区：以社区收益优先，强调真实身份与透明互动，鼓励负责任交易。\n\n循环经济：结合智能分类和捐赠流程，打造校园循环经济范式。',
        privacyTitle: '隐私与条款',
        privacyBody:
          'Circulink 尊重用户隐私，并遵循 DKU 社区数据规范。\n\n所有交易基于 DKU 账号认证。\n\n使用 Circulink 即表示你同意平台服务条款与隐私政策。',
        faqTitle: '常见问题',
        faqBody:
          'Q1：如何在 Circulink 买卖？\nA：登录后发布商品，或按分类/关键词浏览并下单。\n\nQ2：需要实名认证吗？\nA：需要。平台仅面向 DKU 社区，需通过校园账号登录。\n\nQ3：捐赠商品会如何处理？\nA：未售出的商品可进入合作公益门店 Buy42 的捐赠流程，让闲置物品继续发挥价值。',
        contactTitle: '联系我们',
        contactBody: '欢迎反馈建议或问题！'
      }
    : {
        aboutTitle: 'About Circulink',
        aboutBody:
          'Circulink is a sustainable second-hand trading platform built for the DKU community. We address common pain points in chat-group trading, including disorganized listings, poor searchability, and low trust.\n\nWith AI-assisted categorization, donation integration, and verified campus identity, Circulink helps students, faculty, and staff trade safely and efficiently while supporting sustainability.',
        missionTitle: 'Mission & Vision',
        missionBody:
          'Sustainability: turn idle goods into reusable resources and reduce waste.\n\nCommunity: prioritize community value and transparent interactions.\n\nCircular Economy: connect classification and donation workflows to close the loop.',
        privacyTitle: 'Privacy & Terms',
        privacyBody:
          "Circulink respects user privacy and follows DKU's data policy.\n\nAll transactions rely on verified DKU identity.\n\nBy using Circulink, you agree to our terms and privacy policy.",
        faqTitle: 'FAQ',
        faqBody:
          'Q1: How can I buy or sell items?\nA: Sign in, publish listings, or browse by category and keyword.\n\nQ2: Do I need verification?\nA: Yes. Circulink is exclusive to DKU users with verified login.\n\nQ3: What happens to donated items?\nA: Unsold items can be routed to our partner charity store Buy42.',
        contactTitle: 'Contact Us',
        contactBody: "We'd love to hear your feedback or suggestions!"
      };

  return (
    <section id="about" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>{copy.aboutTitle}</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 mb-8">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {copy.aboutBody}
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>{copy.missionTitle}</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
{copy.missionBody}
          </p>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>{copy.privacyTitle}</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
{copy.privacyBody}
          </p>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>{copy.faqTitle}</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
{copy.faqBody}
          </div>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>{copy.contactTitle}</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <p className="text-gray-800 leading-relaxed">
            {copy.contactBody}
            <br />
            Email: <a href="mailto:aw565@duke.edu" className="text-orange-600 hover:underline">aw565@duke.edu</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
