import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Theme } from '../types';

interface ContactSectionProps {
  currentTheme: Theme;
}

const ContactSection: React.FC<ContactSectionProps> = ({ currentTheme }) => {
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
    alert('Message sent! I\'ll get back to you soon.');
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
          <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>Get In Touch</h2>
          <p className={`text-xl ${subtextColor} max-w-2xl mx-auto`}>
            Have a project in mind or just want to chat? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className={`text-2xl font-bold mb-6 ${textColor}`}>Let's Connect</h3>
            <p className={`${subtextColor} mb-8 leading-relaxed`}>
              I'm always interested in discussing new opportunities, creative projects, or just having 
              a conversation about technology and design. Drop me a message and I'll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`${cardBg} backdrop-blur-sm p-3 rounded-lg border border-white/20`}>
                  <Mail className={`h-5 w-5 ${textColor}`} />
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>Email</p>
                  <p className={subtextColor}>alex.johnson@example.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`${cardBg} backdrop-blur-sm p-3 rounded-lg border border-white/20`}>
                  <Phone className={`h-5 w-5 ${textColor}`} />
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>Phone</p>
                  <p className={subtextColor}>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`${cardBg} backdrop-blur-sm p-3 rounded-lg border border-white/20`}>
                  <MapPin className={`h-5 w-5 ${textColor}`} />
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>Location</p>
                  <p className={subtextColor}>San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-sm rounded-xl p-8 border border-white/20`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${textColor}`}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent ${textColor} placeholder-gray-500`}
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${textColor}`}>
                  Email
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
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent ${textColor} placeholder-gray-500 resize-none`}
                  placeholder="Tell me about your project or just say hello..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;