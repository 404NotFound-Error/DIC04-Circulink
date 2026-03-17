import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AboutSection: React.FC = () => {
  const { lang } = useLanguage();
  const titleBubbleStyle = {
    background: 'linear-gradient(145deg, rgba(255,255,255,0.34), rgba(255,255,255,0.18))',
    borderColor: 'rgba(255,255,255,0.5)',
    boxShadow: '0 18px 40px rgba(14,72,63,0.12), inset 0 1px 0 rgba(255,255,255,0.5)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)'
  };
  const contentBubbleStyle = {
    background: 'linear-gradient(155deg, rgba(255,255,255,0.42), rgba(255,255,255,0.18))',
    borderColor: 'rgba(255,255,255,0.58)',
    boxShadow: '0 24px 60px rgba(14,72,63,0.1), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -18px 30px rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)'
  };
  const contentBubbleClass = 'relative overflow-hidden rounded-[2.2rem] border p-6';
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
          <div className="inline-block rounded-full border px-8 py-4 text-2xl font-extrabold text-orange-700 shadow-2xl" style={titleBubbleStyle}>{copy.aboutTitle}</div>
        </div>

        <div className={`${contentBubbleClass} mb-8`} style={contentBubbleStyle}>
          <div className="absolute inset-x-10 top-2 h-10 rounded-full bg-white/30 blur-xl" />
          <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-white/38 blur-2xl" />
          <div className="absolute -left-8 bottom-4 h-20 w-20 rounded-full bg-[#f6fffb]/32 blur-xl" />
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {copy.aboutBody}
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="inline-block rounded-full border px-8 py-4 text-2xl font-extrabold text-orange-700 shadow-2xl" style={titleBubbleStyle}>{copy.missionTitle}</div>
        </div>

        <div className={contentBubbleClass} style={contentBubbleStyle}>
          <div className="absolute inset-x-12 top-2 h-10 rounded-full bg-white/28 blur-xl" />
          <div className="absolute right-6 top-5 h-24 w-24 rounded-full bg-white/32 blur-2xl" />
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
{copy.missionBody}
          </p>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block rounded-full border px-8 py-4 text-2xl font-extrabold text-orange-700 shadow-2xl" style={titleBubbleStyle}>{copy.privacyTitle}</div>
        </div>

        <div className={contentBubbleClass} style={contentBubbleStyle}>
          <div className="absolute inset-x-12 top-2 h-10 rounded-full bg-white/28 blur-xl" />
          <div className="absolute -right-6 bottom-4 h-24 w-24 rounded-full bg-[#f8fffc]/30 blur-2xl" />
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
{copy.privacyBody}
          </p>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block rounded-full border px-8 py-4 text-2xl font-extrabold text-orange-700 shadow-2xl" style={titleBubbleStyle}>{copy.faqTitle}</div>
        </div>

        <div className={contentBubbleClass} style={contentBubbleStyle}>
          <div className="absolute inset-x-12 top-2 h-10 rounded-full bg-white/28 blur-xl" />
          <div className="absolute left-6 top-5 h-16 w-16 rounded-full bg-white/28 blur-xl" />
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
{copy.faqBody}
          </div>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block rounded-full border px-8 py-4 text-2xl font-extrabold text-orange-700 shadow-2xl" style={titleBubbleStyle}>{copy.contactTitle}</div>
        </div>

        <div className={contentBubbleClass} style={contentBubbleStyle}>
          <div className="absolute inset-x-12 top-2 h-10 rounded-full bg-white/28 blur-xl" />
          <div className="absolute -left-6 -top-3 h-20 w-20 rounded-full bg-white/28 blur-xl" />
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
