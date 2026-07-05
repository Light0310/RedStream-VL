/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { BlogPost, Language, TranslationDictionary } from '../types';
import { ArrowLeft, Calendar, User, Clock, ChevronRight, MessageCircle } from 'lucide-react';

interface BlogPostProps {
  post: BlogPost;
  lang: Language;
  t: TranslationDictionary;
  onBack: () => void;
}

export default function BlogPostComponent({ post, lang, t, onBack }: BlogPostProps) {
  // Find Cover Image based on slug
  const coverImage = post.slug.includes('samsung') 
    ? '/samsung_iptv_guide.svg' 
    : post.slug.includes('setup')
    ? '/ultimate_iptv_setup_guide.svg'
    : post.slug.includes('future')
    ? '/future_streaming_trends_2026.svg'
    : '/redstream_blog_cover.svg';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Scoped Custom CSS to format the parsed Markdown nicely */}
        <style>{`
          .markdown-container h1 {
            font-size: 2.25rem;
            font-weight: 800;
            color: #ffffff;
            margin-top: 2rem;
            margin-bottom: 1rem;
            line-height: 1.2;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding-bottom: 0.5rem;
          }
          .markdown-container h2 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #ffffff;
            margin-top: 1.75rem;
            margin-bottom: 0.75rem;
            line-height: 1.3;
          }
          .markdown-container h3 {
            font-size: 1.35rem;
            font-weight: 600;
            color: #ffffff;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .markdown-container p {
            font-size: 1.05rem;
            color: #cccccc;
            line-height: 1.75;
            margin-bottom: 1.25rem;
            font-weight: 300;
          }
          .markdown-container strong {
            font-weight: 700;
            color: #ffffff;
          }
          .markdown-container a {
            color: #FF1E27;
            text-decoration: underline;
            font-weight: 500;
            transition: color 0.2s;
          }
          .markdown-container a:hover {
            color: #ff5258;
          }
          .markdown-container ul {
            list-style-type: disc;
            margin-left: 1.5rem;
            margin-bottom: 1.5rem;
            color: #cccccc;
            font-weight: 300;
          }
          .markdown-container ol {
            list-style-type: decimal;
            margin-left: 1.5rem;
            margin-bottom: 1.5rem;
            color: #cccccc;
            font-weight: 300;
          }
          .markdown-container li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
          }
          .markdown-container blockquote {
            border-left: 4px solid #FF1E27;
            padding-left: 1.25rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #999999;
            background: #141414;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            border-radius: 0 8px 8px 0;
          }
          .markdown-container table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          .markdown-container th, .markdown-container td {
            border: 1px solid rgba(255,255,255,0.08);
            padding: 0.75rem;
            text-align: left;
          }
          .markdown-container th {
            background-color: #1a1a1a;
            color: #ffffff;
          }
          .markdown-container tr:nth-child(even) td {
            background-color: rgba(255,255,255,0.02);
          }
          .markdown-container img {
            max-width: 100%;
            border-radius: 12px;
            margin: 2rem 0;
            border: 1px solid rgba(255,255,255,0.05);
          }
        `}</style>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 group transition-colors cursor-pointer text-sm font-semibold"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t.backToBlog}</span>
        </button>

        {/* Hero Meta Header */}
        <div className="mb-10 text-center md:text-left">
          {post.tags && post.tags.length > 0 && (
            <span className="bg-[#FF1E27] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded inline-block mb-4">
              {post.tags[0]}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Authors & Info */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6 text-sm text-gray-400 border-b border-white/5 pb-8">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#FF1E27]" />
              <span className="font-medium text-white">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#FF1E27]" />
              <span>{t.publishedOn} {post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#FF1E27]" />
              <span>{post.readingTime} {t.minutesRead} ({t.readingTimeLabel})</span>
            </div>
          </div>
        </div>

        {/* Grid Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Content */}
          <main className="lg:col-span-8">
            {/* Main Cover Banner */}
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-950 mb-10 border border-white/5 shadow-2xl">
              <img 
                src={coverImage} 
                alt={post.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Rendered Markdown Body */}
            <div className="markdown-container">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h2 {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </main>

          {/* Sidebar CTA Content */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Sticky Container */}
            <div className="sticky top-24 space-y-8">
              
              {/* Promotion trial box */}
              <div className="bg-[#141414] border border-[#FF1E27]/20 rounded-2xl p-6 shadow-xl">
                <span className="text-2xl mb-2 block">⚡</span>
                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">
                  LIMITED TIME TRIAL OFFER
                </h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                  Get a premium, high-performance trial account loaded with <strong>20,000+ live premium channels</strong> and <strong>60,000+ blockbuster movies</strong> for only 2€!
                </p>
                <a
                  href={`https://wa.me/212694843943?text=Hello%20RedStream,%20I%20am%20reading%20the%20guide%20"${encodeURIComponent(post.title)}"%20and%20want%20to%20get%20a%2024H%20Premium%20Trial.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#FF1E27] hover:bg-[#e0141d] text-white py-3.5 rounded-xl font-bold text-center transition-all uppercase text-xs tracking-wide shadow-lg shadow-[#FF1E27]/15 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  Request Trial on WhatsApp
                </a>
              </div>

              {/* Supported Devices List */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/5">
                  100% Device Compatibility
                </h4>
                <ul className="space-y-3 text-sm text-gray-400 font-light">
                  <li className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-[#FF1E27]" />
                    <span>Samsung & LG Smart TVs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-[#FF1E27]" />
                    <span>Amazon Fire TV Stick & Fire Cube</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-[#FF1E27]" />
                    <span>Android TV Boxes (Nvidia Shield, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-[#FF1E27]" />
                    <span>iPhone, iPad, macOS & Windows</span>
                  </li>
                </ul>
              </div>

              {/* Verified Trust Badges */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/5">
                  Our Quality Guarantees
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/10 text-green-400 p-1.5 rounded-lg text-sm font-bold">✓</div>
                    <div>
                      <h5 className="text-white text-xs font-bold uppercase">99.9% Uptime Guarantee</h5>
                      <p className="text-gray-400 text-xs font-light">Anti-Freeze 9.0 redundant servers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/10 text-green-400 p-1.5 rounded-lg text-sm font-bold">✓</div>
                    <div>
                      <h5 className="text-white text-xs font-bold uppercase">10-Minute Instant Setup</h5>
                      <p className="text-gray-400 text-xs font-light">Pong us on WhatsApp, we deliver instantly.</p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </aside>
          
        </div>

      </div>
    </div>
  );
}
