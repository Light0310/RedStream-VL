/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BlogPost, Language, TranslationDictionary } from '../types';
import { Search, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

interface BlogListProps {
  posts: BlogPost[];
  lang: Language;
  t: TranslationDictionary;
  onNavigate: (view: 'home' | 'blog' | 'post', slug?: string) => void;
}

export default function BlogList({ posts, lang, t, onNavigate }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags for the current posts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [posts]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Brand Logo Banner */}
        <div className="w-full flex justify-center mb-10">
          <div className="w-full max-w-xl aspect-[16/10] sm:aspect-[16/9] bg-[#141414] rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-[#FF1E27]/5">
            <img 
              src="/redstream_blog_cover.svg" 
              alt="RedStream™ Blog Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            {t.blogTitle}
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-light">
            {t.blogSubtitle}
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#141414] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27] transition-all"
            />
          </div>

          {/* Tags Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                selectedTag === null
                  ? 'bg-[#FF1E27] text-white shadow-lg shadow-[#FF1E27]/25'
                  : 'bg-[#141414] text-gray-400 border border-white/5 hover:border-white/10'
              }`}
            >
              {t.allTags}
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#FF1E27] text-white shadow-lg shadow-[#FF1E27]/25'
                    : 'bg-[#141414] text-gray-400 border border-white/5 hover:border-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-[#141414] rounded-2xl border border-white/5">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg font-medium">{t.noPosts}</p>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => {
            // Find Cover Image or fallback to standard coverImagePath
            const coverImage = post.slug.includes('samsung') 
              ? '/samsung_iptv_guide.svg' 
              : post.slug.includes('setup')
              ? '/ultimate_iptv_setup_guide.svg'
              : post.slug.includes('future')
              ? '/future_streaming_trends_2026.svg'
              : '/redstream_blog_cover.svg';

            return (
              <article 
                key={post.slug}
                onClick={() => onNavigate('post', post.slug)}
                className="group bg-[#141414] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-[#FF1E27]/30 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF1E27]/5"
              >
                {/* Image Wrap */}
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-950">
                  <img 
                    src={coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
                  
                  {/* Category Tags inside badge */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-[#FF1E27] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
                        {post.tags[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {post.readingTime} {t.minutesRead}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-xl font-bold leading-snug text-white mb-2 group-hover:text-[#FF1E27] transition-colors">
                      {post.title}
                    </h2>

                    {/* Short Description */}
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-[#FF1E27] transition-colors pt-4 border-t border-white/5">
                    <span>{t.readMore}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Promotional Widget */}
        <div className="mt-20 bg-gradient-to-r from-[#141414] to-[#1e1414] border border-[#FF1E27]/20 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF1E27]/5 rounded-full blur-3xl -z-10" />
          <span className="text-3xl sm:text-4xl mb-4 block">🎁</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 uppercase tracking-tight">
            Ready to Try RedStream™ IPTV?
          </h3>
          <p className="text-gray-400 text-base max-w-xl mx-auto mb-8 font-light">
            Don't take our word for it. Request a <strong>Free 24h Premium Trial</strong> right now and experience zero lag, crystal-clear 4K, and 20,000+ live premium global channels.
          </p>
          <a
            href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20read%20your%20blog%20post%20and%20would%20like%20to%20get%20a%20free%20trial."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FF1E27] hover:bg-[#e0141d] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#FF1E27]/25 hover:shadow-xl hover:shadow-[#FF1E27]/40 uppercase tracking-wide cursor-pointer text-sm"
          >
            Claim Free Trial on WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
