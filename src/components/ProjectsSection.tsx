import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project, Theme } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  currentTheme: Theme;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, currentTheme }) => {
  const textColor = currentTheme.id === 'midnight' ? 'text-white' : 'text-gray-800';
  const subtextColor = currentTheme.id === 'midnight' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = currentTheme.id === 'midnight' ? 'bg-white/10' : 'bg-white/80';

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>Featured Projects</h2>
          <p className={`text-xl ${subtextColor} max-w-2xl mx-auto`}>
            A showcase of my recent work and creative solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${cardBg} backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105`}
            >
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{project.title}</h3>
                <p className={`${subtextColor} mb-4`}>{project.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-white/20 rounded-full text-xs text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 px-3 py-2 ${cardBg} hover:bg-white/30 rounded-lg transition-colors ${textColor} text-sm`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 px-3 py-2 ${cardBg} hover:bg-white/30 rounded-lg transition-colors ${textColor} text-sm`}
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;