import React from 'react';
import { Code, Palette, Zap, Users } from 'lucide-react';
import { Theme } from '../types';

interface AboutSectionProps {
  currentTheme: Theme;
}

const AboutSection: React.FC<AboutSectionProps> = ({ currentTheme }) => {
  const textColor = currentTheme.id === 'midnight' ? 'text-white' : 'text-gray-800';
  const subtextColor = currentTheme.id === 'midnight' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = currentTheme.id === 'midnight' ? 'bg-white/10' : 'bg-white/80';

  const skills = [
    { icon: Code, title: 'Development', description: 'Full-stack development with React, Node.js, and modern frameworks' },
    { icon: Palette, title: 'Design', description: 'UI/UX design with attention to detail and user experience' },
    { icon: Zap, title: 'Performance', description: 'Optimized solutions for speed and scalability' },
    { icon: Users, title: 'Collaboration', description: 'Team leadership and agile development practices' }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>About Me</h2>
          <p className={`text-xl ${subtextColor} max-w-3xl mx-auto`}>
            I'm a passionate developer with 8+ years of experience creating digital solutions that make a difference. 
            I believe in the power of clean code, beautiful design, and meaningful user experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className={`text-2xl font-bold mb-6 ${textColor}`}>My Journey</h3>
            <p className={`${subtextColor} mb-4 leading-relaxed`}>
              Starting as a curious student fascinated by technology, I've grown into a full-stack developer who loves 
              solving complex problems and creating intuitive user experiences. My journey has taken me through various 
              industries, from startups to enterprise solutions.
            </p>
            <p className={`${subtextColor} mb-4 leading-relaxed`}>
              I specialize in React, TypeScript, and Node.js, but I'm always eager to learn new technologies and 
              frameworks. When I'm not coding, you'll find me exploring new design trends, contributing to open-source 
              projects, or sharing knowledge with the developer community.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className={`${cardBg} backdrop-blur-sm rounded-xl p-8 border border-white/20`}>
            <h4 className={`text-lg font-semibold mb-4 ${textColor}`}>Quick Facts</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={subtextColor}>Location</span>
                <span className={textColor}>San Francisco, CA</span>
              </div>
              <div className="flex justify-between">
                <span className={subtextColor}>Experience</span>
                <span className={textColor}>8+ Years</span>
              </div>
              <div className="flex justify-between">
                <span className={subtextColor}>Projects Completed</span>
                <span className={textColor}>50+</span>
              </div>
              <div className="flex justify-between">
                <span className={subtextColor}>Coffee Consumed</span>
                <span className={textColor}>∞</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className={`${cardBg} backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center`}
            >
              <div className="mb-4 flex justify-center">
                <skill.icon className={`h-12 w-12 ${textColor}`} />
              </div>
              <h4 className={`text-lg font-semibold mb-2 ${textColor}`}>{skill.title}</h4>
              <p className={`text-sm ${subtextColor}`}>{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;