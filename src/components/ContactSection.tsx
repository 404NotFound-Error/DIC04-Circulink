import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Theme } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  currentTheme: Theme;
}

const ContactSection: React.FC<ContactSectionProps> = ({ currentTheme }) => {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const textColor = currentTheme.id === 'midnight' ? 'text-white' : 'text-gray-800';
  const subtextColor = currentTheme.id === 'midnight' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = currentTheme.id === 'midnight' ? 'bg-white/10' : 'bg-white/80';
  const inputBg = currentTheme.id === 'midnight' ? 'bg-white/10' : 'bg-white';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert(lang === 'zh' ? '消息已发送！我会尽快回复你。' : 'Message sent! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>{lang === 'zh' ? '联系我' : 'Get In Touch'}</h2>
          <p className={`text-xl ${subtextColor} max-w-2xl mx-auto`}>
            {lang === 'zh' ? '有项目想法，或者想聊聊？欢迎联系我。' : 'Have a project in mind or just want to chat? I\'d love to hear from you.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className={`text-2xl font-bold mb-6 ${textColor}`}>{lang === 'zh' ? '保持联系' : 'Let\'s Connect'}</h3>
            <p className={`${subtextColor} mb-8 leading-relaxed`}>
              {lang === 'zh'
                ? '我一直乐于讨论新的合作机会、创意项目，或是技术与设计话题。给我留言，我会尽快回复。'
                : 'I\'m always interested in discussing new opportunities, creative projects, or just having a conversation about technology and design. Drop me a message and I\'ll get back to you as soon as possible.'}
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`${cardBg} backdrop-blur-sm p-3 rounded-lg border border-white/20`}>
                  <Mail className={`h-5 w-5 ${textColor}`} />
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>{lang === 'zh' ? '邮箱' : 'Email'}</p>
                  <p className={subtextColor}>alex.johnson@example.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`${cardBg} backdrop-blur-sm p-3 rounded-lg border border-white/20`}>
                  <Phone className={`h-5 w-5 ${textColor}`} />
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>{lang === 'zh' ? '电话' : 'Phone'}</p>
                  <p className={subtextColor}>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`${cardBg} backdrop-blur-sm p-3 rounded-lg border border-white/20`}>
                  <MapPin className={`h-5 w-5 ${textColor}`} />
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>{lang === 'zh' ? '位置' : 'Location'}</p>
                  <p className={subtextColor}>{lang === 'zh' ? '旧金山，加州' : 'San Francisco, CA'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-sm rounded-xl p-8 border border-white/20`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${textColor}`}>
                  {lang === 'zh' ? '姓名' : 'Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent ${textColor} placeholder-gray-500`}
                  placeholder={lang === 'zh' ? '你的姓名' : 'Your Name'}
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${textColor}`}>
                  {lang === 'zh' ? '邮箱' : 'Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent ${textColor} placeholder-gray-500`}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 ${textColor}`}>
                  {lang === 'zh' ? '消息' : 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent ${textColor} placeholder-gray-500 resize-none`}
                  placeholder={lang === 'zh' ? '介绍一下你的项目，或打个招呼...' : 'Tell me about your project or just say hello...'}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>{lang === 'zh' ? '发送消息' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
