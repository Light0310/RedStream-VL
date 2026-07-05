/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Search,
  Tag,
  CheckCircle2,
  Tv,
  Headphones,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';

import { Language, View, Route, BlogPost } from './types';
import { loadBlogPosts } from './blog';
import { translations } from './translations';

export default function App() {
  // Hash Routing State
  const [route, setRoute] = useState<Route>({ lang: 'en', view: 'home' });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Blog Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Parse hash URL to resolve Route
  const parseHash = (hash: string): Route => {
    const cleanHash = hash.replace(/^#\/?/, '');
    const parts = cleanHash.split('/').filter(Boolean);

    const validLanguages: Language[] = ['en', 'ar', 'es', 'nl'];
    const validViews: View[] = ['home', 'blog', 'post', 'about'];

    let lang: Language = 'en';
    let view: View = 'home';
    let slug: string | undefined = undefined;

    // Detect browser language if no hash exists
    if (parts.length === 0) {
      const browserLang = navigator.language.split('-')[0];
      if (validLanguages.includes(browserLang as Language)) {
        lang = browserLang as Language;
      }
    } else if (validLanguages.includes(parts[0] as Language)) {
      lang = parts[0] as Language;

      if (parts[1]) {
        if (parts[1] === 'blog' && parts[2]) {
          view = 'post';
          slug = parts[2];
        } else if (validViews.includes(parts[1] as View)) {
          view = parts[1] as View;
        }
      }
    }

    return { lang, view, slug };
  };

  // Enforce structured hash URLs on hash change or mount
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      const targetHash = parsed.view === 'post'
        ? `#/${parsed.lang}/blog/${parsed.slug}`
        : `#/${parsed.lang}/${parsed.view}`;

      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }

      setRoute(parsed);
      // Reset search/filter when language or view changes
      setSearchQuery('');
      setSelectedTag(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update HTML direction (RTL/LTR) & lang attribute
  useEffect(() => {
    const dir = route.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = route.lang;
  }, [route.lang]);

  // Retrieve current translation dictionary
  const t = useMemo(() => translations[route.lang], [route.lang]);

  // Retrieve blog posts for current language
  const currentLangPosts = useMemo(() => {
    return loadBlogPosts().filter((post) => post.lang === route.lang);
  }, [route.lang]);

  // Retrieve all unique tags for filtering in the current language
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    currentLangPosts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [currentLangPosts]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return currentLangPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [currentLangPosts, searchQuery, selectedTag]);

  // Resolved post details if view is 'post'
  const activePost = useMemo(() => {
    if (route.view !== 'post' || !route.slug) return null;
    return currentLangPosts.find((p) => p.slug === route.slug);
  }, [route.view, route.slug, currentLangPosts]);

  // Navigate helper that preserves language and format hashes safely
  const navigate = (view: View, slug?: string) => {
    if (view === 'post' && slug) {
      window.location.hash = `#/${route.lang}/blog/${slug}`;
    } else {
      window.location.hash = `#/${route.lang}/${view}`;
    }
  };

  // Change language helper, updates Hash path smoothly, retaining current page view and slug!
  const changeLanguage = (newLang: Language) => {
    setLangDropdownOpen(false);
    if (route.view === 'post' && route.slug) {
      // Direct translation mapping of same post slug in different languages
      window.location.hash = `#/${newLang}/blog/${route.slug}`;
    } else {
      window.location.hash = `#/${newLang}/${route.view}`;
    }
  };

  // Languages metadata for layout selector
  const languageNames: Record<Language, { native: string; flag: string; label: string }> = {
    en: { native: 'English', flag: '🇬🇧', label: 'EN' },
    ar: { native: 'العربية', flag: '🇲🇦', label: 'AR' },
    es: { native: 'Español', flag: '🇪🇸', label: 'ES' },
    nl: { native: 'Nederlands', flag: '🇳🇱', label: 'NL' },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-rose-500 selection:text-white bg-slate-50 text-slate-900 transition-colors duration-200">
      
      {/* Dynamic Alert Banner for Static Demo Info */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <Info className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <span>
          {route.lang === 'ar' 
            ? 'هذه نسخة تجريبية لصفحة استاتيكية بالكامل 100% تعمل على صفحات GitHub مع دعم كامل للغات.' 
            : 'This is a 100% statically optimized i18n platform ready for seamless GitHub Pages deployment.'}
        </span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => navigate('home')} 
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/20 font-bold tracking-tight text-lg">
              R
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">RedStream</span>
              <span className="text-xs block text-rose-600 font-semibold -mt-1 tracking-wider uppercase">IPTV Hub</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
            <button
              onClick={() => navigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                route.view === 'home'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => navigate('blog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                route.view === 'blog' || route.view === 'post'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navBlog}
            </button>
            <button
              onClick={() => navigate('about')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                route.view === 'about'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navAbout}
            </button>
          </nav>

          {/* Action Tools: Lang Switcher & CTA */}
          <div className="flex items-center gap-3">
            
            {/* Custom Multi-Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 active:bg-slate-50 text-sm font-medium transition-all text-slate-700"
                id="language-dropdown-toggle"
              >
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{languageNames[route.lang].flag} {languageNames[route.lang].native}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <>
                    {/* Click Out Overlay */}
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setLangDropdownOpen(false)} 
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 rounded-xl border border-slate-200/80 bg-white p-1 shadow-xl shadow-slate-200/50 z-40 overflow-hidden"
                      id="language-menu-options"
                    >
                      {Object.entries(languageNames).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => changeLanguage(key as Language)}
                          className={`w-full text-start flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                            route.lang === key
                              ? 'bg-rose-50 text-rose-600 font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{value.flag}</span>
                            <span>{value.native}</span>
                          </span>
                          {route.lang === key && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Micro-Menu for Mobile Nav */}
            <div className="flex md:hidden items-center gap-1 border-s border-slate-200 ps-2">
              <button 
                onClick={() => navigate('home')}
                className={`p-2 rounded-lg text-xs font-semibold ${route.view === 'home' ? 'text-rose-600' : 'text-slate-500'}`}
              >
                {t.navHome}
              </button>
              <button 
                onClick={() => navigate('blog')}
                className={`p-2 rounded-lg text-xs font-semibold ${route.view === 'blog' || route.view === 'post' ? 'text-rose-600' : 'text-slate-500'}`}
              >
                {t.navBlog}
              </button>
              <button 
                onClick={() => navigate('about')}
                className={`p-2 rounded-lg text-xs font-semibold ${route.view === 'about' ? 'text-rose-600' : 'text-slate-500'}`}
              >
                {t.navAbout}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container Section */}
      <main className="flex-grow py-8 md:py-12 max-w-6xl w-full mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${route.view}-${route.lang}-${route.slug || ''}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* VIEW: HOME */}
            {route.view === 'home' && (
              <div className="space-y-12 md:space-y-16" id="home-view">
                
                {/* Hero section */}
                <div className="text-center max-w-3xl mx-auto space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Global Coverage</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    {t.heroTitle}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                    {t.heroSubtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => navigate('blog')}
                      className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 transition-all text-white font-medium rounded-xl shadow-lg shadow-rose-600/10 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{t.heroCtaPrimary}</span>
                    </button>
                    <button
                      onClick={() => navigate('about')}
                      className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:border-slate-300 bg-white active:bg-slate-50 transition-all text-slate-700 font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t.heroCtaSecondary}</span>
                    </button>
                  </div>
                </div>

                {/* Localized Features Section */}
                <div className="space-y-8 pt-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.featuresTitle}</h2>
                    <p className="text-sm text-slate-500 max-w-lg mx-auto">{t.featuresSubtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-start gap-4 hover:border-slate-300/80 transition-all group">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                        <Tv className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-900">{t.feature1Title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{t.feature1Desc}</p>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-start gap-4 hover:border-slate-300/80 transition-all group">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-900">{t.feature2Title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{t.feature2Desc}</p>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-start gap-4 hover:border-slate-300/80 transition-all group">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                        <Headphones className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-900">{t.feature3Title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{t.feature3Desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Language Highlights Quick Block */}
                <div className="bg-rose-50/50 rounded-2xl border border-rose-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center md:text-start">
                    <h3 className="font-bold text-slate-900">
                      {route.lang === 'ar' ? 'متوفر بـ 4 لغات مستقلة بالكامل' : 'Localized in 4 Native Languages'}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
                      {route.lang === 'ar' 
                        ? 'تصفح أدلة إعداد قنواتك، وتقارير البث المباشر المكتوبة محلياً باللغات: العربية، الإنجليزية، الإسبانية، والهولندية مع تفعيل الاتجاهات بشكل تلقائي.' 
                        : 'Access custom guides, configuration tutorials, and trending industry news across English, Arabic, Spanish, and Dutch with automated layout switching.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {Object.entries(languageNames).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => changeLanguage(key as Language)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          route.lang === key
                            ? 'bg-white border-rose-200 text-rose-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{val.flag} {val.native}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW: BLOG LIST */}
            {route.view === 'blog' && (
              <div className="space-y-8" id="blog-list-view">
                
                {/* Blog Header Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{t.blogTitle}</h1>
                  <p className="text-sm sm:text-base text-slate-500 max-w-xl">{t.blogSubtitle}</p>
                </div>

                {/* Search & Tag Filter Controllers */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                  {/* Search input with icons */}
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full ps-10 pe-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-800"
                    />
                  </div>

                  {/* Filter by tags */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all border ${
                        selectedTag === null
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t.allTags}
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all border flex items-center gap-1 ${
                          selectedTag === tag
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts List Grid */}
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="blog-grid">
                    {filteredPosts.map((post) => (
                      <article
                        key={post.slug}
                        className="bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/30 hover:border-slate-300 transition-all group"
                      >
                        <div className="space-y-4">
                          {/* Metadata header */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{post.date}</span>
                            </span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{post.readingTime} {t.minutesRead}</span>
                            </span>
                          </div>

                          {/* Post Title & Description */}
                          <div className="space-y-2">
                            <h2 
                              onClick={() => navigate('post', post.slug)}
                              className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer leading-snug tracking-tight"
                            >
                              {post.title}
                            </h2>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                              {post.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer tags and action link */}
                        <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tg) => (
                              <span
                                key={tg}
                                className="px-2 py-0.5 rounded bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider"
                              >
                                {tg}
                              </span>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => navigate('post', post.slug)}
                            className="text-xs font-bold text-rose-600 group-hover:underline flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{t.readMore}</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl max-w-md mx-auto space-y-3">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm font-medium">{t.noPosts}</p>
                  </div>
                )}

              </div>
            )}

            {/* VIEW: BLOG POST DETAIL */}
            {route.view === 'post' && (
              <div className="max-w-3xl mx-auto space-y-8" id="blog-post-detail">
                
                {/* Back Link */}
                <button
                  onClick={() => navigate('blog')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                  <span>{t.backToBlog}</span>
                </button>

                {activePost ? (
                  <article className="space-y-8">
                    {/* Header Metadata Section */}
                    <header className="space-y-4 pb-6 border-b border-slate-200">
                      <div className="flex flex-wrap gap-1.5">
                        {activePost.tags.map((tg) => (
                          <span
                            key={tg}
                            className="px-2.5 py-1 rounded bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>

                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {activePost.title}
                      </h1>

                      <p className="text-slate-500 text-base font-normal leading-relaxed italic">
                        {activePost.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-2">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{t.writtenBy}: {activePost.author}</span>
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{t.publishedOn}: {activePost.date}</span>
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{activePost.readingTime} {t.minutesRead}</span>
                        </span>
                      </div>
                    </header>

                    {/* Pure Static Markdown Renderer Block */}
                    <div className="markdown-body">
                      <Markdown>{activePost.content}</Markdown>
                    </div>
                  </article>
                ) : (
                  <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl max-w-md mx-auto space-y-3">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm font-medium">Post Not Found</p>
                  </div>
                )}

              </div>
            )}

            {/* VIEW: ABOUT */}
            {route.view === 'about' && (
              <div className="max-w-3xl mx-auto space-y-8" id="about-view">
                
                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{t.aboutTitle}</h1>
                </div>

                {/* About Content */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 sm:p-8 space-y-6">
                  <p className="text-base text-slate-600 leading-relaxed font-normal">
                    {t.aboutText1}
                  </p>
                  <p className="text-base text-slate-600 leading-relaxed font-normal">
                    {t.aboutText2}
                  </p>
                  <p className="text-base text-slate-600 leading-relaxed font-normal">
                    {t.aboutText3}
                  </p>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-900 mb-3">
                      {route.lang === 'ar' ? 'مميزات البنية الاستاتيكية المعتمدة:' : 'Features of this Static Architecture:'}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Vite Static Module Loading</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Client-Side Static Hash Routing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Lightweight Markdown Parsers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Automated LTR/RTL Adaptability</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Multi-language Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-bold text-slate-700">RedStream IPTV</span>
          </div>
          <p className="text-center">{t.footerDesc}</p>
          <p>
            &copy; {new Date().getFullYear()} RedStream. {t.footerRights}
          </p>
        </div>
      </footer>

    </div>
  );
}
