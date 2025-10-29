import React, { useState } from 'react';
import { Calendar, Clock, Search, Tag } from 'lucide-react';
import { BlogPost, Theme } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  currentTheme: Theme;
  onPostClick: (post: BlogPost) => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts, currentTheme, onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const textColor = currentTheme.id === 'midnight' ? 'text-white' : 'text-gray-800';
  const subtextColor = currentTheme.id === 'midnight' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = currentTheme.id === 'midnight' ? 'bg-white/10' : 'bg-white/80';

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>Latest Articles</h2>
          <p className={`text-xl ${subtextColor} max-w-2xl mx-auto`}>
            Thoughts, tutorials, and insights from my journey in technology
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${subtextColor}`} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${cardBg} backdrop-blur-sm rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 ${textColor} placeholder-gray-500`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                !selectedTag 
                  ? 'bg-white/30 text-white' 
                  : `${cardBg} ${textColor} hover:bg-white/20`
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag 
                    ? 'bg-white/30 text-white' 
                    : `${cardBg} ${textColor} hover:bg-white/20`
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onPostClick(post)}
              className={`${cardBg} backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer`}
            >
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{post.title}</h3>
                <p className={`${subtextColor} line-clamp-3`}>{post.excerpt}</p>
              </div>

              <div className={`flex items-center gap-4 text-sm ${subtextColor} mb-4`}>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs text-white"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-xl ${subtextColor}`}>No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;