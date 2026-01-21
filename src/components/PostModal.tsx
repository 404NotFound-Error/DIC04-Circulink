import React from 'react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost, Theme } from '../types';

interface PostModalProps {
  post: BlogPost | null;
  onClose: () => void;
  currentTheme: Theme;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose, currentTheme }) => {
  if (!post) return null;

  const textColor = currentTheme.id === 'midnight' ? 'text-white' : 'text-gray-800';
  const subtextColor = currentTheme.id === 'midnight' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full ${currentTheme.id === 'midnight' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="sticky top-0 bg-inherit border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>{post.title}</h1>
            <div className={`flex items-center gap-4 mt-2 text-sm ${subtextColor}`}>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${textColor}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  currentTheme.id === 'midnight' 
                    ? 'bg-purple-600/20 text-purple-300' 
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className={`prose prose-lg max-w-none ${currentTheme.id === 'midnight' ? 'prose-invert' : ''}`}>
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className={`text-3xl font-bold mb-4 ${textColor}`}>
                    {paragraph.substring(2)}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className={`text-2xl font-bold mb-3 mt-6 ${textColor}`}>
                    {paragraph.substring(3)}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className={`mb-1 ${textColor}`}>
                    {paragraph.substring(2)}
                  </li>
                );
              }
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              return (
                <p key={index} className={`mb-4 leading-relaxed ${textColor}`}>
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;