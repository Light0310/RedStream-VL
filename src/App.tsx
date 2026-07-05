/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, CheckCircle2 } from 'lucide-react';

import { Language, View, Route } from './types';
import { loadBlogPosts } from './blog';
import { translations } from './translations';

// Components
import Home from './components/Home';
import BlogList from './components/BlogList';
import BlogPostComponent from './components/BlogPost';

export default function App() {
  // Hash Routing State
  const [route, setRoute] = useState<Route>({ lang: 'en', view: 'home' });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Parse hash URL to resolve Route
  const parseHash = (hash: string): Route => {
    const cleanHash = hash.replace(/^#\/?/, '');
    const parts = cleanHash.split('/').filter(Boolean);

    const validLanguages: Language[] = ['en', 'ar', 'es', 'nl', 'fr', 'ru', 'de'];
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
      const hash = window.location.hash;

      // If it is a local anchor link on the landing page (e.g., #features, #pricing),
      // let the landing page component handle smooth scrolling naturally without resetting the hash
      if (hash && hash.startsWith('#') && !hash.startsWith('#/')) {
        return;
      }

      const parsed = parseHash(hash);
      const targetHash = parsed.view === 'post'
        ? `#/${parsed.lang}/blog/${parsed.slug}`
        : `#/${parsed.lang}/${parsed.view}`;

      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }

      setRoute(parsed);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    ar: { native: 'العربية', flag: '🇸🇦', label: 'AR' },
    es: { native: 'Español', flag: '🇪🇸', label: 'ES' },
    nl: { native: 'Nederlands', flag: '🇳🇱', label: 'NL' },
    fr: { native: 'Français', flag: '🇫🇷', label: 'FR' },
    ru: { native: 'Русский', flag: '🇷🇺', label: 'RU' },
    de: { native: 'Deutsch', flag: '🇩🇪', label: 'DE' },
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-[#FF1E27] selection:text-white transition-colors duration-200">
      
      {/* 1. VIEW: HOME (Render standard landing page with absolutely zero extra visual rails or banners) */}
      {route.view === 'home' ? (
        <Home currentLang={route.lang} onChangeLanguage={changeLanguage} />
      ) : (
        /* 2. VIEW: BLOG OR BLOG POST (Render beautifully custom integrated premium dark header/footer) */
        <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
          
          {/* Header */}
          <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/5 py-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              
              {/* Brand Logo */}
              <div 
                onClick={() => navigate('home')} 
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <svg className="w-7 h-7 filter drop-shadow(0 0 5px rgba(255,30,39,0.5))" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(16, 16) scale(0.93)">
                    <path d="M 120 140 L 340 140 A 75 75 0 0 1 415 215 A 75 75 0 0 1 340 290 L 280 290 L 400 380 L 330 380 L 225 300 L 150 380 L 105 380 L 205 300 L 245 250 L 340 250 A 35 35 0 0 0 375 215 A 35 35 0 0 0 340 180 L 160 180 Z" fill="#FF1E27" />
                    <polygon points="120,200 200,245 120,290" fill="#FFFFFF" />
                  </g>
                </svg>
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Red<span className="text-[#FF1E27]">Stream</span>
                </span>
              </div>

              {/* Navigation Center Links */}
              <nav className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate('home')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:text-[#FF1E27] text-gray-300 cursor-pointer"
                >
                  {t.navHome}
                </button>
                <button
                  onClick={() => navigate('blog')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all text-[#FF1E27] bg-[#FF1E27]/10 cursor-pointer"
                >
                  {t.navBlog}
                </button>
              </nav>

              {/* Language Selector Dropdown & CTA Button */}
              <div className="flex items-center gap-4">
                
                {/* Language Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#141414] hover:border-white/20 active:bg-white/5 text-xs font-bold transition-all text-white cursor-pointer select-none"
                  >
                    <Globe size={14} className="text-gray-400" />
                    <span>{languageNames[route.lang].flag} {languageNames[route.lang].label}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {langDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-30" 
                          onClick={() => setLangDropdownOpen(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-40 rounded-xl border border-white/10 bg-[#141414] p-1 shadow-2xl z-40 overflow-hidden"
                        >
                          {Object.entries(languageNames).map(([key, value]) => (
                            <button
                              key={key}
                              onClick={() => changeLanguage(key as Language)}
                              className={`w-full text-start flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                route.lang === key
                                  ? 'bg-[#FF1E27]/10 text-[#FF1E27] font-bold'
                                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{value.flag}</span>
                                <span>{value.native}</span>
                              </span>
                              {route.lang === key && <CheckCircle2 size={13} className="text-[#FF1E27]" />}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Trial CTA Link */}
                <a
                  href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20want%20to%20get%20a%20free%20trial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF1E27] hover:bg-[#e0141d] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-[#FF1E27]/15"
                >
                  Get Free Trial
                </a>
              </div>

            </div>
          </header>

          {/* Mobile Bottom Navigation Helper Bar */}
          <div className="md:hidden sticky top-16 z-30 bg-[#0c0c0c]/90 border-b border-white/5 flex justify-center py-2.5 px-4 gap-4 text-xs font-bold text-gray-400">
            <button 
              onClick={() => navigate('home')}
              className="hover:text-white cursor-pointer"
            >
              {t.navHome}
            </button>
            <span>•</span>
            <button 
              onClick={() => navigate('blog')}
              className={`hover:text-white cursor-pointer ${route.view === 'blog' || route.view === 'post' ? 'text-[#FF1E27]' : ''}`}
            >
              {t.navBlog}
            </button>
          </div>

          {/* Main Container Content */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${route.view}-${route.lang}-${route.slug || ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {route.view === 'blog' && (
                  <BlogList 
                    posts={currentLangPosts}
                    lang={route.lang}
                    t={t}
                    onNavigate={navigate}
                  />
                )}

                {route.view === 'post' && activePost && (
                  <BlogPostComponent 
                    post={activePost}
                    lang={route.lang}
                    t={t}
                    onBack={() => navigate('blog')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="bg-[#0c0c0c] border-t border-white/5 py-8 text-center text-xs text-gray-500 font-medium mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 filter drop-shadow(0 0 3px rgba(255,30,39,0.5))" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(16, 16) scale(0.93)">
                    <path d="M 120 140 L 340 140 A 75 75 0 0 1 415 215 A 75 75 0 0 1 340 290 L 280 290 L 400 380 L 330 380 L 225 300 L 150 380 L 105 380 L 205 300 L 245 250 L 340 250 A 35 35 0 0 0 375 215 A 35 35 0 0 0 340 180 L 160 180 Z" fill="#FF1E27" />
                    <polygon points="120,200 200,245 120,290" fill="#FFFFFF" />
                  </g>
                </svg>
                <span className="font-extrabold text-white">RedStream IPTV</span>
              </div>
              <p className="text-gray-400 font-light">{t.footerDesc}</p>
              <p className="font-light">
                &copy; 2026 RedStream. {t.footerRights}
              </p>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
