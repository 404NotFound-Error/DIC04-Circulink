import React from 'react';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { Theme } from '../types';

interface HeroProps {
  currentTheme: Theme;
}

const Hero: React.FC<HeroProps> = ({ currentTheme }) => {
  const textColor = currentTheme.id === 'midnight' ? 'text-white' : 'text-gray-800';
  const subtextColor = currentTheme.id === 'midnight' ? 'text-gray-300' : 'text-gray-600';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
              <span className={`text-4xl font-bold ${textColor}`}>AJ</span>
            </div>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${textColor}`}>
            Alex Johnson
          </h1>
          <p className={`text-xl md:text-2xl mb-6 ${subtextColor}`}>
            Full-Stack Developer & Creative Problem Solver
          </p>
          <p className={`text-lg max-w-2xl mx-auto mb-8 leading-relaxed ${subtextColor}`}>
            I craft beautiful, functional web experiences that bridge the gap between design and technology. 
            Passionate about creating solutions that make a difference.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Get In Touch</span>
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 border border-white/20">
            <Download className="h-5 w-5" />
            <span>Download CV</span>
          </button>
        </div>

        <div className="flex justify-center space-x-6">
          <a href="#" className={`${textColor} hover:scale-110 transition-transform duration-300`}>
            <Github className="h-6 w-6" />
          </a>
          <a href="#" className={`${textColor} hover:scale-110 transition-transform duration-300`}>
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" className={`${textColor} hover:scale-110 transition-transform duration-300`}>
            <Mail className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;