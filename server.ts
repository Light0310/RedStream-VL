import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { parseMarkdown, BlogPost } from "./src/utils/markdown";

// Load configuration
const PORT = 3000;
const HOST = "0.0.0.0";
const IS_PROD = process.env.NODE_ENV === "production";
const DOMAIN = "https://www.red-stream.store";

// Helper to load translation dictionaries
const locales: Record<string, any> = {};
const languages = ["en", "es", "nl", "ar"];

languages.forEach((lang) => {
  const localePath = path.join(process.cwd(), "locales", `${lang}.json`);
  if (fs.existsSync(localePath)) {
    locales[lang] = JSON.parse(fs.readFileSync(localePath, "utf-8"));
  }
});

// Helper to load all blog posts for a specific language
function getBlogPosts(lang: string): BlogPost[] {
  const blogDir = path.join(process.cwd(), "content", "blog", lang);
  if (!fs.existsSync(blogDir)) {
    return [];
  }
  
  const files = fs.readdirSync(blogDir);
  const posts: BlogPost[] = [];
  
  files.forEach((file) => {
    if (file.endsWith(".md")) {
      const slug = file.replace(".md", "");
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      try {
        posts.push(parseMarkdown(slug, content));
      } catch (err) {
        console.error(`Error parsing blog post ${file} in language ${lang}:`, err);
      }
    }
  });
  
  // Sort posts by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function startServer() {
  const app = express();

  // 1. Localized XML Sitemap Generator
  app.get("/sitemap.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    // Static Language Homepages
    languages.forEach((lang) => {
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}/${lang}/</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      // Alternates for homepages
      languages.forEach((altLang) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}/" />\n`;
      });
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/en/" />\n`;
      xml += `  </url>\n`;

      // Static Language Blogs
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}/${lang}/blog</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      languages.forEach((altLang) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}/blog" />\n`;
      });
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/en/blog" />\n`;
      xml += `  </url>\n`;

      // Blog Articles
      const posts = getBlogPosts(lang);
      posts.forEach((post) => {
        xml += `  <url>\n`;
        xml += `    <loc>${DOMAIN}/${lang}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${post.date}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        
        // Dynamic alternate tags for identical posts translated into different languages
        languages.forEach((altLang) => {
          // Check if same post slug exists in the alternate language
          const altPostPath = path.join(process.cwd(), "content", "blog", altLang, `${post.slug}.md`);
          if (fs.existsSync(altPostPath)) {
            xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}/blog/${post.slug}" />\n`;
          }
        });
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/en/blog/${post.slug}" />\n`;
        xml += `  </url>\n`;
      });
    });

    xml += `</urlset>`;
    res.send(xml);
  });

  // Root Redirection (detects browser preference or defaults to /en/)
  app.get("/", (req, res) => {
    const acceptLang = req.headers["accept-language"] || "en";
    let targetLang = "en";
    if (acceptLang.includes("es")) targetLang = "es";
    else if (acceptLang.includes("nl")) targetLang = "nl";
    else if (acceptLang.includes("ar")) targetLang = "ar";
    
    res.redirect(301, `/${targetLang}/`);
  });

  // Vite development middleware or production static build handler
  let viteInstance: any = null;
  if (!IS_PROD) {
    viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Common template parser and renderer
  const getProcessedTemplate = (reqPath: string, lang: string, headModifications: string, bodyContent: string, isBlog = false) => {
    const templatePath = path.join(process.cwd(), "index.html");
    if (!fs.existsSync(templatePath)) {
      return "Template index.html not found";
    }

    let html = fs.readFileSync(templatePath, "utf-8");
    const locale = locales[lang] || locales.en;

    // Apply basic attributes
    html = html.replace('<html lang="en">', `<html lang="${lang}" dir="${locale.dir}">`);

    // Setup RTL custom stylesheet overrides specifically for Arabic
    let rtlStyle = "";
    if (lang === "ar") {
      rtlStyle = `
        <style id="rtl-support">
          body { direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; }
          .nav-container { flex-direction: row-reverse !important; }
          .nav-links { margin-right: auto !important; margin-left: 0 !important; flex-direction: row-reverse !important; }
          .menu-toggle { margin-right: auto !important; margin-left: 0 !important; }
          .hero, .features, .pricing, .faq, .payments-footer { text-align: right !important; }
          .feature-card, .pricing-card, .testimonial-card { text-align: right !important; }
          .feature-icon-wrapper { margin-left: 0 !important; margin-right: 0 !important; }
          .pricing-feature-item { flex-direction: row-reverse !important; justify-content: flex-start !important; gap: 8px !important; }
          .pricing-feature-item svg { margin-left: 4px !important; margin-right: 0 !important; }
          .cta-btn svg { margin-left: 8px !important; margin-right: 0 !important; transform: scaleX(-1) !important; }
          .device-select-arrow { left: 15px !important; right: auto !important; }
          .device-option-selected { text-align: right !important; }
          .social-proof-toast { left: auto !important; right: 24px !important; flex-direction: row-reverse !important; text-align: right !important; }
          .exit-modal-gift { transform: scaleX(-1) !important; }
        </style>
      `;
    }

    // Generate dynamic Hreflang alternates & Canonical URL
    const alternates = languages
      .map((l) => `<link rel="alternate" hreflang="${l}" href="${DOMAIN}/${l}${reqPath.replace(/^\/[a-z]{2}/, "")}" />`)
      .join("\n  ");
    const xDefault = `<link rel="alternate" hreflang="x-default" href="${DOMAIN}/en${reqPath.replace(/^\/[a-z]{2}/, "")}" />`;
    const canonical = `<link rel="canonical" href="${DOMAIN}${reqPath}" />`;

    // Map blog post URLs correctly to prevent 404s when switching languages on single blog posts
    let enUrl = `/en${reqPath.replace(/^\/[a-z]{2}/, "")}`;
    let esUrl = `/es${reqPath.replace(/^\/[a-z]{2}/, "")}`;
    let nlUrl = `/nl${reqPath.replace(/^\/[a-z]{2}/, "")}`;
    let arUrl = `/ar${reqPath.replace(/^\/[a-z]{2}/, "")}`;

    if (reqPath.includes("/blog/") && reqPath.split("/blog/")[1]) {
      enUrl = "/en/blog/how-to-set-up-iptv-on-firestick";
      esUrl = "/es/blog/como-configurar-iptv-en-firestick";
      nlUrl = "/nl/blog/hoe-iptv-in-te-stellen-op-firestick";
      arUrl = "/ar/blog/how-to-set-up-iptv-on-firestick";
    }

    const langSelectorStyles = `
      <style id="lang-selector-styles">
        /* Custom Dropdown hover & animation logic */
        .lang-dropdown-wrapper {
          position: relative;
          display: inline-block;
          z-index: 1050;
          margin: 0 10px;
          font-family: var(--font-sans), sans-serif;
        }
        
        /* Desktop Hover state */
        @media (min-width: 769px) {
          .lang-dropdown-wrapper:hover .lang-dropdown-content {
            display: block !important;
            animation: dropdownFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .lang-dropdown-wrapper:hover .lang-dropdown-btn {
            background: rgba(255, 255, 255, 0.12) !important;
            border-color: #e50914 !important;
            box-shadow: 0 0 15px rgba(229, 9, 20, 0.3) !important;
          }
          .lang-dropdown-wrapper:hover .dropdown-arrow {
            transform: rotate(180deg);
          }
        }

        /* Active click-based state for mobile & fallback */
        .lang-dropdown-wrapper.active .lang-dropdown-content {
          display: block !important;
          animation: dropdownFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .lang-dropdown-wrapper.active .lang-dropdown-btn {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: #e50914 !important;
          box-shadow: 0 0 15px rgba(229, 9, 20, 0.3) !important;
        }
        .lang-dropdown-wrapper.active .dropdown-arrow {
          transform: rotate(180deg);
        }

        .dropdown-item:hover {
          background: rgba(229, 9, 20, 0.15) !important;
          color: #ffffff !important;
        }
        
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Responsive handling for mobile layout */
        @media (max-width: 768px) {
          nav {
            gap: 12px !important;
          }
          .lang-dropdown-wrapper {
            margin: 0 !important;
            display: inline-block !important;
          }
          .lang-dropdown-btn {
            padding: 6px 12px !important;
            font-size: 0.75rem !important;
          }
          .lang-dropdown-content {
            position: absolute !important;
            top: calc(100% + 8px) !important;
            bottom: auto !important;
            right: 0 !important;
            left: auto !important;
            width: 140px !important;
            border-color: rgba(229, 9, 20, 0.35) !important;
            background: rgba(10, 10, 10, 0.98) !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(229, 9, 20, 0.15) !important;
          }
        }
      </style>
    `;

    // Inject SEO tags and stylesheets into head
    const seoAndStyles = `
      ${alternates}
      ${xDefault}
      ${canonical}
      ${rtlStyle}
      ${langSelectorStyles}
      ${headModifications}
    `;

    // Dynamic Language Switcher Widget code to inject into the Header Navigation
    const langSwitcher = `
      <div class="lang-dropdown-wrapper">
        <button class="lang-dropdown-btn" style="background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(255, 255, 255, 0.1); color: #ffffff; padding: 6px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 10px rgba(0,0,0,0.3); outline: none;">
          <span style="font-size: 1rem;">${lang === "en" ? "🇬🇧" : lang === "es" ? "🇪🇸" : lang === "nl" ? "🇳🇱" : "🇲🇦"}</span>
          <span class="lang-text" style="letter-spacing: 0.05em; text-transform: uppercase;">${lang === "en" ? "EN" : lang === "es" ? "ES" : lang === "nl" ? "NL" : "AR"}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="dropdown-arrow" style="stroke: #e50914; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.25s; margin-left: 2px;"><path d="M1 1l4 4 4-4"/></svg>
        </button>
        <div class="lang-dropdown-content" style="display: none; position: absolute; top: calc(100% + 8px); right: 0; background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1.5px solid rgba(229, 9, 20, 0.25); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(229, 9, 20, 0.15); width: 150px; overflow: hidden; text-align: left;">
          <a href="${enUrl}" style="display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: ${lang === "en" ? "#e50914" : "#eeeeee"}; font-weight: ${lang === "en" ? "800" : "500"}; text-decoration: none; font-size: 0.85rem; transition: background 0.2s, color 0.2s;" class="dropdown-item">
            <span style="font-size: 1.1rem;">🇬🇧</span> <span style="letter-spacing: 0.02em;">English</span>
          </a>
          <a href="${esUrl}" style="display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: ${lang === "es" ? "#e50914" : "#eeeeee"}; font-weight: ${lang === "es" ? "800" : "500"}; text-decoration: none; font-size: 0.85rem; transition: background 0.2s, color 0.2s;" class="dropdown-item">
            <span style="font-size: 1.1rem;">🇪🇸</span> <span style="letter-spacing: 0.02em;">Español</span>
          </a>
          <a href="${nlUrl}" style="display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: ${lang === "nl" ? "#e50914" : "#eeeeee"}; font-weight: ${lang === "nl" ? "800" : "500"}; text-decoration: none; font-size: 0.85rem; transition: background 0.2s, color 0.2s;" class="dropdown-item">
            <span style="font-size: 1.1rem;">🇳🇱</span> <span style="letter-spacing: 0.02em;">Nederlands</span>
          </a>
          <a href="${arUrl}" style="display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: ${lang === "ar" ? "#e50914" : "#eeeeee"}; font-weight: ${lang === "ar" ? "800" : "500"}; text-decoration: none; font-size: 0.85rem; transition: background 0.2s, color 0.2s;" class="dropdown-item">
            <span style="font-size: 1.1rem;">🇲🇦</span> <span style="letter-spacing: 0.02em;">العربية</span>
          </a>
        </div>
      </div>
      <script>
        (function() {
          function initLangSelector() {
            const wrapper = document.querySelector('.lang-dropdown-wrapper');
            const btn = document.querySelector('.lang-dropdown-btn');
            if (btn && wrapper) {
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                wrapper.classList.toggle('active');
              });
              document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                  wrapper.classList.remove('active');
                }
              });
            }
          }
          if (document.readyState !== 'loading') {
            initLangSelector();
          } else {
            document.addEventListener('DOMContentLoaded', initLangSelector);
          }
        })();
      </script>
    `;

    // Inject Header Modifications (Add Blog link to the navigation links, and inject language switcher)
    const blogLink = `<li><a href="/${lang}/blog" style="color: ${isBlog ? "#e50914" : "var(--color-text-white)"}; font-weight: ${isBlog ? "800" : "500"};">Blog</a></li>`;
    html = html.replace('<li><a href="#faq" id="link-faq">FAQ</a></li>', `<li><a href="#faq" id="link-faq">FAQ</a></li>\n          ${blogLink}`);
    html = html.replace("</nav>", `${langSwitcher}</nav>`);

    // Perform translation replacements on landing page text
    if (!isBlog) {
      const replacements: Record<string, string> = {
        "Home</a>": locale.NAV_HOME + "</a>",
        "Features</a>": locale.NAV_FEATURES + "</a>",
        "Pricing</a>": locale.NAV_PRICING + "</a>",
        "FAQ</a>": locale.NAV_FAQ + "</a>",
        "Get Free Trial</a>": locale.NAV_CTA + "</a>",
        "Premium 4K IPTV Service 2026": locale.HERO_BADGE,
        "Experience Ultimate TV with": locale.HERO_TITLE,
        "RedStream™ Premium IPTV": locale.HERO_TITLE_HIGHLIGHT,
        "Stream over 20,000+ live premium TV channels and 60,000+ blockbuster movies & VOD in stunning Ultra HD 4K. Zero freezing, smart loading, and instant instant activation.": locale.HERO_SUBHEADING,
        "Start Watching Instantly on WhatsApp": locale.HERO_CTA,
        "Instant 10-Min Setup": locale.TRUST_SETUP,
        "99.9% Anti-Freeze Uptime": locale.TRUST_UPTIME,
        "24/7 VIP Dedicated Support": locale.TRUST_SUPPORT,
        "Happy Clients": locale.STAT_CLIENTS,
        "Server Uptime": locale.STAT_UPTIME,
        "Google Rating": locale.STAT_RATING,
        "Why RedStream is the #1 Premium Provider": locale.FEATURES_TITLE,
        "We invest in top-tier bare-metal hardware and proprietary caching algorithms to bring you zero lag and crisp imagery.": locale.FEATURES_SUBTITLE,
        "Check Device Compatibility": locale.COMPATIBILITY_TITLE,
        "Select Your Device to Check Compatibility": locale.COMPATIBILITY_SUB,
        "Select Your Device...": locale.COMPATIBILITY_SELECT,
        "Check Compatibility": locale.COMPATIBILITY_BTN,
        "Choose Your RedStream Plan": locale.PRICING_TITLE,
        "Choose the premium access tier that fits your entertainment lifestyle. Secure setup in under 10 minutes.": locale.PRICING_SUB,
        "Frequently Asked Questions": locale.FAQ_TITLE,
        "Everything you need to know about setting up and streaming with RedStream IPTV.": locale.FAQ_SUB,
      };

      Object.entries(replacements).forEach(([search, replace]) => {
        html = html.split(search).join(replace);
      });
    }

    // In blog pages, replace core landing modules to prevent rendering overlaps and avoid JS console errors
    if (isBlog) {
      // Find the end of header and start of footer
      const headerEndIndex = html.indexOf("</header>");
      const footerStartIndex = html.indexOf('<footer class="payments-footer">');

      if (headerEndIndex !== -1 && footerStartIndex !== -1) {
        const headAndHeader = html.substring(0, headerEndIndex + 9);
        const footerAndScripts = html.substring(footerStartIndex);

        // Strip heavy static carousel / pop-up script handlers from the blog layout
        // This keeps the DOM 100% responsive, optimized for load speed, and console-clean
        const cleanFooterAndScripts = footerAndScripts
          .replace(/<script[\s\S]*?<\/script>/g, "") + `
          <!-- Custom Optimized JS for Blog Interactivity -->
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const mobileMenuBtn = document.getElementById('mobile-menu-btn');
              const navMenu = document.getElementById('nav-menu');
              if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                  navMenu.classList.toggle('active');
                });
              }
            });
          </script>
        `;

        html = headAndHeader + "\n" + bodyContent + "\n" + cleanFooterAndScripts;
      }
    }

    // Inject SEO tags in the head of any layout
    html = html.replace("</head>", `${seoAndStyles}\n</head>`);

    return html;
  };

  // 2. Language Landing Page routes: /:lang/
  app.get("/:lang/", (req, res, next) => {
    const { lang } = req.params;
    if (!languages.includes(lang)) {
      return next();
    }
    const html = getProcessedTemplate(req.path, lang, "", "", false);
    res.send(html);
  });

  // 3. Blog List page routes: /:lang/blog
  app.get("/:lang/blog", (req, res, next) => {
    const { lang } = req.params;
    if (!languages.includes(lang)) {
      return next();
    }

    const locale = locales[lang] || locales.en;
    const posts = getBlogPosts(lang);

    let blogCardsHtml = "";
    if (posts.length === 0) {
      blogCardsHtml = `<div class="col-span-full text-center py-20 text-gray-500 font-sans">${locale.BLOG_NO_POSTS}</div>`;
    } else {
      posts.forEach((post) => {
        blogCardsHtml += `
          <article class="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e50914]/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
            <a href="/${lang}/blog/${post.slug}" class="block">
              <div class="aspect-video w-full overflow-hidden relative bg-neutral-900">
                <img src="${post.coverImage || '/favicon.svg'}" alt="${post.title}" loading="lazy" referrerPolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-4 left-4 bg-black/85 backdrop-blur text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase border border-white/10 tracking-wide">${post.tags[0] || "IPTV"}</span>
              </div>
              <div class="p-6 flex flex-col gap-3">
                <span class="text-[11px] font-mono text-gray-500">${post.date} • ${post.readTime}</span>
                <h3 class="text-xl font-bold text-white group-hover:text-[#e50914] transition-colors leading-snug line-clamp-2">${post.title}</h3>
                <p class="text-gray-400 text-sm line-clamp-2 leading-relaxed font-sans">${post.description}</p>
                <div class="flex items-center gap-2 text-sm font-extrabold text-[#e50914] mt-2">
                  <span>${locale.BLOG_READ_MORE}</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </a>
          </article>
        `;
      });
    }

    const bodyContent = `
      <main class="container py-24 px-4 max-w-6xl mx-auto" style="min-height: 70vh;">
        <div class="text-center mb-16">
          <span class="inline-block bg-[#e50914] text-white font-extrabold text-[11px] px-3 py-1 rounded uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(229,9,20,0.4)]">BLOG & TUTORIALS</span>
          <h1 class="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tight font-display mb-4">${locale.BLOG_TITLE}</h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto font-sans">${locale.BLOG_SUB}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${blogCardsHtml}
        </div>
      </main>
    `;

    const headModifications = `
      <title>${locale.BLOG_TITLE} - IPTV Guides & Help</title>
      <meta name="description" content="${locale.BLOG_SUB}" />
      <meta name="keywords" content="iptv blog, redstream guides, iptv tutorial, smart tv firestick iptv setup" />
    `;

    const html = getProcessedTemplate(req.path, lang, headModifications, bodyContent, true);
    res.send(html);
  });

  // 4. Single Blog Post page route: /:lang/blog/:slug
  app.get("/:lang/blog/:slug", (req, res, next) => {
    const { lang, slug } = req.params;
    if (!languages.includes(lang)) {
      return next();
    }

    const locale = locales[lang] || locales.en;
    const filePath = path.join(process.cwd(), "content", "blog", lang, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Article not found / Article non existant");
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const post = parseMarkdown(slug, content);

    const bodyContent = `
      <main class="container py-24 px-4 max-w-4xl mx-auto" style="min-height: 70vh;">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs font-mono text-gray-500 mb-8 border-b border-white/5 pb-4">
          <a href="/${lang}/" class="hover:text-white transition">${locale.BLOG_HOME}</a>
          <span>/</span>
          <a href="/${lang}/blog" class="hover:text-white transition">Blog</a>
          <span>/</span>
          <span class="text-gray-300 truncate max-w-xs md:max-w-md">${post.title}</span>
        </nav>

        <!-- Hero Post Header -->
        <header class="mb-12">
          <div class="flex flex-wrap items-center gap-3 text-sm font-mono text-gray-400 mb-4">
            <span>${post.date}</span>
            <span>•</span>
            <span>${post.readTime}</span>
            <span>•</span>
            <span class="text-[#e50914] font-bold uppercase">${post.tags.join(", ") || "IPTV"}</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white leading-tight font-display italic uppercase tracking-tight mb-6">${post.title}</h1>
          <div class="flex items-center gap-3 border-t border-white/5 pt-6 mt-6">
            <div class="w-10 h-10 rounded-full bg-red-600/10 border border-[#e50914]/20 flex items-center justify-center font-bold text-white text-sm font-display italic">RS</div>
            <div>
              <div class="text-white font-bold text-sm">${post.author}</div>
              <div class="text-gray-500 text-xs">RedStream Engineering</div>
            </div>
          </div>
        </header>

        <!-- Featured Cover Image -->
        <div class="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/5 mb-12 shadow-2xl bg-neutral-900">
          <img src="${post.coverImage || '/favicon.svg'}" alt="${post.title}" referrerPolicy="no-referrer" class="w-full h-full object-cover">
        </div>

        <!-- Content body -->
        <article class="prose prose-invert max-w-none mb-16 markdown-body">
          ${post.contentHtml}
        </article>

        <!-- Navigation back -->
        <div class="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/${lang}/blog" class="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-200">
            <svg class="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>${locale.BLOG_BACK}</span>
          </a>
          
          <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20read%20your%20blog%20post%20about%20${encodeURIComponent(post.title)}%20and%20want%20to%20get%20a%20free%20trial." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 bg-[#e50914] text-white font-extrabold px-8 py-3.5 rounded-lg shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:scale-105 transition-all duration-200">
            <span>Get Free IPTV Trial</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </main>
    `;

    const headModifications = `
      <title>${post.title} - RedStream IPTV Blog</title>
      <meta name="description" content="${post.description}" />
      <meta name="keywords" content="${post.keywords}" />
    `;

    const html = getProcessedTemplate(req.path, lang, headModifications, bodyContent, true);
    res.send(html);
  });

  // Apply Vite development middlewares
  if (viteInstance) {
    app.use(viteInstance.middlewares);
  } else {
    // In production, serve the static directory assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
    
    // Serve landing index fallback for unhandled routes
    app.use("*", (req, res) => {
      const defaultHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
      res.send(defaultHtml);
    });
  }

  // Launch Server
  app.listen(PORT, HOST, () => {
    console.log(`Server starting on http://localhost:${PORT} [ENV: ${IS_PROD ? "production" : "development"}]`);
  });
}

startServer();
