/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { getTranslatedLandingHTML } from './HomeTranslations';
import FAQSection from './FAQSection';

const languageNames: Record<Language, { native: string; flag: string; label: string }> = {
  en: { native: 'English', flag: '🇬🇧', label: 'EN' },
  ar: { native: 'العربية', flag: '🇸🇦', label: 'AR' },
  es: { native: 'Español', flag: '🇪🇸', label: 'ES' },
  nl: { native: 'Nederlands', flag: '🇳🇱', label: 'NL' },
  fr: { native: 'Français', flag: '🇫🇷', label: 'FR' },
  ru: { native: 'Русский', flag: '🇷🇺', label: 'RU' },
  de: { native: 'Deutsch', flag: '🇩🇪', label: 'DE' },
};

const navTranslations: Record<Language, { home: string; features: string; pricing: string; faq: string; blog: string; cta: string }> = {
  en: { home: 'Home', features: 'Features', pricing: 'Pricing', faq: 'FAQ', blog: 'Blog', cta: 'Get Free Trial' },
  ar: { home: 'الرئيسية', features: 'المميزات', pricing: 'الأسعار', faq: 'الأسئلة الشائعة', blog: 'المدونة', cta: 'تجربة مجانية' },
  es: { home: 'Inicio', features: 'Características', pricing: 'Precios', faq: 'Preguntas Frecuentes', blog: 'Blog', cta: 'Prueba Gratis' },
  nl: { home: 'Home', features: 'Kenmerken', pricing: 'Prijzen', faq: 'FAQ', blog: 'Blog', cta: 'Gratis Test' },
  fr: { home: 'Accueil', features: 'Fonctionnalités', pricing: 'Tarifs', faq: 'FAQ', blog: 'Blog', cta: 'Essai gratuit' },
  ru: { home: 'Главная', features: 'Преимущества', pricing: 'Цены', faq: 'Вопросы', blog: 'Блог', cta: 'Бесплатный тест' },
  de: { home: 'Startseite', features: 'Funktionen', pricing: 'Preise', faq: 'FAQ', blog: 'Blog', cta: 'Kostenlose Testversion' }
};

interface HomeProps {
  currentLang?: Language;
  onChangeLanguage?: (lang: Language) => void;
}

export default function Home({ currentLang = 'en', onChangeLanguage }: HomeProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    // 2. Smooth scroll offset adjustment for sticky header
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#') && !hash.startsWith('#/')) {
        const element = document.querySelector(hash);
        if (element) {
          const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Image state checkers for showcase
    const showcaseImgs = document.querySelectorAll('.showcase-slide img');
    showcaseImgs.forEach(img => {
      const image = img as HTMLImageElement;
      if (image.complete) {
        image.classList.add('loaded');
      } else {
        image.addEventListener('load', () => {
          image.classList.add('loaded');
        });
      }
    });

    const urlParams = new URLSearchParams(window.location.search);

    // Scroll to and highlight plan
    let targetCardId = '';
    const planParam = urlParams.get('plan')?.toLowerCase();
    const isTrialParam = urlParams.get('trial')?.toLowerCase() === 'true';

    if (isTrialParam || planParam === 'trial' || planParam === '24h' || planParam === '24hours') {
      targetCardId = 'plan-trial';
    } else if (planParam === '1month' || planParam === '1m' || planParam === 'one-month') {
      targetCardId = 'plan-1month';
    } else if (planParam === '6months' || planParam === '6m' || planParam === 'six-months') {
      targetCardId = 'plan-6months';
    } else if (planParam === '12months' || planParam === '12m' || planParam === 'one-year' || planParam === 'yearly') {
      targetCardId = 'plan-12months';
    }

    if (targetCardId) {
      const cardElement = document.getElementById(targetCardId);
      if (cardElement) {
        cardElement.classList.add('highlighted-plan-card');
        setTimeout(() => {
          const offsetPosition = cardElement.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 800);
      }
    }

    // Dynamic WhatsApp url tracking
    const whatsappAnchors = document.querySelectorAll('a[href*="wa.me"]');
    whatsappAnchors.forEach(anchor => {
      const originalHref = anchor.getAttribute('href');
      if (!originalHref) return;

      try {
        const urlObj = new URL(originalHref);
        const textParam = urlObj.searchParams.get('text') || '';
        
        const buttonId = anchor.id || '';
        let sourceName = 'General Link';
        let planName = 'None';

        if (buttonId === 'nav-cta-trial') {
          sourceName = 'Navigation Header Button';
          planName = 'Free Trial Request';
        } else if (buttonId === 'hero-main-cta') {
          sourceName = 'Hero Main CTA Button';
          planName = 'IPTV Subscription Inquiry';
        } else if (buttonId === 'btn-trial-order') {
          sourceName = 'Pricing Card Order Button';
          planName = '24 Hours Trial (2€)';
        } else if (buttonId === 'btn-1month-order') {
          sourceName = 'Pricing Card Order Button';
          planName = '1 Month Premium (12€)';
        } else if (buttonId === 'btn-6months-order') {
          sourceName = 'Pricing Card Order Button';
          planName = '6 Months Premium (29€)';
        } else if (buttonId === 'btn-12months-order') {
          sourceName = 'Pricing Card Order (Best Deal)';
          planName = '12 Months Premium (49€)';
        } else if (buttonId === 'floating-whatsapp-btn') {
          sourceName = 'Floating Pulsing Widget';
          planName = 'Support / General Inquiry';
        } else if (anchor instanceof HTMLElement && anchor.innerText.toLowerCase().includes('contact')) {
          sourceName = 'Footer Contact Link';
          planName = 'Footer Support';
        }

        const trackingInfo: string[] = [];
        const paramsToCheck = [
          'ref', 'source', 'utm_source', 'utm_medium', 'utm_campaign', 
          'utm_term', 'utm_content', 'gclid', 'fbclid', 'click_id', 'subid'
        ];

        paramsToCheck.forEach(param => {
          if (urlParams.has(param)) {
            trackingInfo.push(`${param}=${urlParams.get(param)}`);
          }
        });

        let trackingBlock = '\n\n---\n[System Order Info]';
        trackingBlock += `\n• Click Origin: ${sourceName}`;
        if (planName !== 'None') {
          trackingBlock += `\n• Plan Selected: ${planName}`;
        }

        if (trackingInfo.length > 0) {
          trackingBlock += `\n• Campaign Referrer: ${trackingInfo.join(', ')}`;
        } else {
          trackingBlock += '\n• Traffic Origin: Organic / Direct';
        }

        trackingBlock += `\n• Landing URL: ${window.location.origin}${window.location.pathname}`;

        const baseText = textParam || 'Hello RedStream, I would like to get a premium IPTV subscription.';
        const updatedText = baseText + trackingBlock;

        urlObj.searchParams.set('text', updatedText);
        anchor.setAttribute('href', urlObj.toString());
      } catch (e) {
        console.error('Error in whatsapp tracking', e);
      }
    });

    // Scroll progress bar
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const progressBar = document.getElementById('scroll-progress-bar');
      if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Countdown timer
    const HOURS_IN_MS = 24 * 60 * 60 * 1000;
    let targetTime = localStorage.getItem('redstream_promo_end');
    const now = new Date().getTime();

    if (!targetTime || parseInt(targetTime) < now) {
      targetTime = (now + (23 * 60 * 60 * 1000 + 45 * 60 * 1000)).toString();
      localStorage.setItem('redstream_promo_end', targetTime);
    }

    const timerInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      let timeLeft = parseInt(targetTime!) - currentTime;

      if (timeLeft <= 0) {
        const newEnd = currentTime + HOURS_IN_MS;
        localStorage.setItem('redstream_promo_end', newEnd.toString());
        targetTime = newEnd.toString();
        timeLeft = HOURS_IN_MS;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      const hEl = document.getElementById('countdown-hours');
      const mEl = document.getElementById('countdown-minutes');
      const sEl = document.getElementById('countdown-seconds');
      
      if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
      if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
      if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // Live Social Proof Toast
    const purchases = [
      { location: "Munich, Germany", plan: "12-Month Premium Plan (Best Deal)", time: "just now" },
      { location: "London, United Kingdom", plan: "6-Month Premium Plan", time: "2 minutes ago" },
      { location: "Paris, France", plan: "24 Hours Trial", time: "5 minutes ago" },
      { location: "Madrid, Spain", plan: "12-Month Premium Plan (Best Deal)", time: "just now" },
      { location: "Amsterdam, Netherlands", plan: "1 Month Premium Plan", time: "1 minute ago" },
      { location: "Brussels, Belgium", plan: "12-Month Premium Plan (Best Deal)", time: "3 minutes ago" },
      { location: "Stockholm, Sweden", plan: "6-Month Premium Plan", time: "4 minutes ago" },
      { location: "Zurich, Switzerland", plan: "12-Month Premium Plan (Best Deal)", time: "just now" },
      { location: "Rome, Italy", plan: "24 Hours Trial", time: "10 minutes ago" }
    ];

    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.id = 'live-social-proof';
    toast.innerHTML = `
      <div class="social-proof-avatar">🔥</div>
      <div class="social-proof-content">
        <div class="social-proof-text" id="social-proof-text"></div>
        <div class="social-proof-time" id="social-proof-time"></div>
      </div>
    `;
    document.body.appendChild(toast);

    let currentIndex = 0;
    const showNextPurchase = () => {
      const data = purchases[currentIndex];
      const textEl = document.getElementById('social-proof-text');
      const timeEl = document.getElementById('social-proof-time');
      
      if (textEl && timeEl) {
        textEl.innerHTML = `Someone from <strong>${data.location}</strong> just purchased a <strong>${data.plan}</strong>!`;
        timeEl.innerText = data.time;
      }

      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 6000);

      currentIndex = (currentIndex + 1) % purchases.length;
    };

    const initialToastTimeout = setTimeout(showNextPurchase, 6000);
    const socialProofInterval = setInterval(showNextPurchase, 45000);

    // Exit Intent Modal
    let overlay: HTMLDivElement | null = null;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20 && sessionStorage.getItem('redstream_exit_triggered') !== 'true') {
        if (overlay) overlay.classList.add('active');
      }
    };

    if (sessionStorage.getItem('redstream_exit_triggered') !== 'true') {
      overlay = document.createElement('div');
      overlay.className = 'exit-modal-overlay';
      overlay.id = 'exit-intent-modal';
      overlay.innerHTML = `
        <div class="exit-modal-content">
          <button class="exit-modal-x" id="exit-modal-close-x" aria-label="Close modal">&times;</button>
          <span class="exit-modal-gift">🎁</span>
          <h3 class="exit-modal-headline">WAIT! DON'T MISS OUT! 🎁</h3>
          <p class="exit-modal-body">
            Get an <strong>Extra 2 Hours Free Trial</strong> Right Now to Test Our Premium Freeze-Free Server Uptime!
          </p>
          <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20triggered%20the%20exit%20offer%20and%20want%20the%20extra%202%20hours%20free%20trial!" 
             target="_blank" rel="noopener noreferrer" class="exit-modal-cta" id="exit-modal-cta-btn">
             Claim My Extra 2 Hours Now
          </a>
          <button class="exit-modal-close" id="exit-modal-close-link">No thanks, let me leave</button>
        </div>
      `;
      document.body.appendChild(overlay);

      const closeModal = () => {
        if (overlay) overlay.classList.remove('active');
        sessionStorage.setItem('redstream_exit_triggered', 'true');
      };

      document.getElementById('exit-modal-close-x')?.addEventListener('click', closeModal);
      document.getElementById('exit-modal-close-link')?.addEventListener('click', closeModal);
      document.getElementById('exit-modal-cta-btn')?.addEventListener('click', closeModal);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });

      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Testimonials slider
    const testimonialsTrack = document.getElementById('testimonials-track');
    const testimonialsPrevBtn = document.getElementById('testimonials-prev');
    const testimonialsNextBtn = document.getElementById('testimonials-next');
    const testimonialsDotsContainer = document.getElementById('testimonials-dots');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const numTestimonialsDots = 4;

    const getVisibleTestimonialsCount = () => {
      const width = window.innerWidth;
      if (width > 1024) return 3;
      if (width > 768) return 2;
      return 1;
    };

    const scrollTestimonials = (direction: 'prev' | 'next') => {
      if (!testimonialsTrack || testimonialCards.length === 0) return;
      const cardWidth = testimonialCards[0].getBoundingClientRect().width;
      const gap = 24;
      const scrollAmount = (cardWidth + gap) * Math.round(getVisibleTestimonialsCount());
      if (direction === 'next') {
        const maxScrollLeft = testimonialsTrack.scrollWidth - testimonialsTrack.clientWidth;
        if (testimonialsTrack.scrollLeft >= maxScrollLeft - 10) {
          testimonialsTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          testimonialsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        testimonialsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    };

    const updateTestimonialsDots = () => {
      if (!testimonialsTrack || !testimonialsDotsContainer) return;
      testimonialsDotsContainer.innerHTML = '';
      const maxScrollLeft = testimonialsTrack.scrollWidth - testimonialsTrack.clientWidth;
      if (maxScrollLeft <= 0) return;
      
      const currentScrollRatio = testimonialsTrack.scrollLeft / maxScrollLeft;
      const activeDotIndex = Math.min(numTestimonialsDots - 1, Math.max(0, Math.round(currentScrollRatio * (numTestimonialsDots - 1))));

      for (let i = 0; i < numTestimonialsDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot' + (i === activeDotIndex ? ' active' : '');
        dot.addEventListener('click', () => {
          const targetScrollLeft = (i / (numTestimonialsDots - 1)) * maxScrollLeft;
          testimonialsTrack.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        });
        testimonialsDotsContainer.appendChild(dot);
      }
    };

    const handleTestimonialsPrev = () => scrollTestimonials('prev');
    const handleTestimonialsNext = () => scrollTestimonials('next');

    if (testimonialsPrevBtn && testimonialsNextBtn) {
      testimonialsPrevBtn.addEventListener('click', handleTestimonialsPrev);
      testimonialsNextBtn.addEventListener('click', handleTestimonialsNext);
    }

    if (testimonialsTrack) {
      testimonialsTrack.addEventListener('scroll', updateTestimonialsDots);
      window.addEventListener('resize', updateTestimonialsDots);
      setTimeout(updateTestimonialsDots, 300);
    }

    let autoRotationInterval = setInterval(() => {
      scrollTestimonials('next');
    }, 6000);

    const pauseAutoRotation = () => {
      clearInterval(autoRotationInterval);
    };

    if (testimonialsTrack) {
      testimonialsTrack.addEventListener('touchstart', pauseAutoRotation, { passive: true });
      testimonialsTrack.addEventListener('mousedown', pauseAutoRotation);
    }
    if (testimonialsPrevBtn) testimonialsPrevBtn.addEventListener('click', pauseAutoRotation);
    if (testimonialsNextBtn) testimonialsNextBtn.addEventListener('click', pauseAutoRotation);

    // Showcase slider
    const showcaseTrack = document.getElementById('showcase-track');
    const showcasePrevBtn = document.getElementById('showcase-prev');
    const showcaseNextBtn = document.getElementById('showcase-next');
    const showcaseDotsContainer = document.getElementById('showcase-dots');
    const showcaseSlides = document.querySelectorAll('.showcase-slide');
    const numDots = 8;

    const getVisibleSlidesCount = () => {
      const width = window.innerWidth;
      if (width > 1024) return 4;
      if (width > 768) return 3;
      if (width > 480) return 2;
      return 1.33;
    };

    const scrollSlider = (direction: 'prev' | 'next') => {
      if (!showcaseTrack || showcaseSlides.length === 0) return;
      const slideWidth = showcaseSlides[0].getBoundingClientRect().width;
      const gap = 20;
      const scrollAmount = (slideWidth + gap) * Math.round(getVisibleSlidesCount());
      if (direction === 'next') {
        showcaseTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        showcaseTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    };

    const updateDots = () => {
      if (!showcaseTrack || !showcaseDotsContainer) return;
      showcaseDotsContainer.innerHTML = '';
      const maxScrollLeft = showcaseTrack.scrollWidth - showcaseTrack.clientWidth;
      if (maxScrollLeft <= 0) return;
      
      const currentScrollRatio = showcaseTrack.scrollLeft / maxScrollLeft;
      const activeDotIndex = Math.min(numDots - 1, Math.max(0, Math.round(currentScrollRatio * (numDots - 1))));

      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'showcase-dot' + (i === activeDotIndex ? ' active' : '');
        dot.addEventListener('click', () => {
          const targetScrollLeft = (i / (numDots - 1)) * maxScrollLeft;
          showcaseTrack.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        });
        showcaseDotsContainer.appendChild(dot);
      }
    };

    const handleShowcasePrev = () => scrollSlider('prev');
    const handleShowcaseNext = () => scrollSlider('next');

    if (showcasePrevBtn && showcaseNextBtn) {
      showcasePrevBtn.addEventListener('click', handleShowcasePrev);
      showcaseNextBtn.addEventListener('click', handleShowcaseNext);
    }

    if (showcaseTrack) {
      showcaseTrack.addEventListener('scroll', updateDots);
      window.addEventListener('resize', updateDots);
      setTimeout(updateDots, 300);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timerInterval);
      clearTimeout(initialToastTimeout);
      clearInterval(socialProofInterval);
      if (toast && document.body.contains(toast)) document.body.removeChild(toast);
      if (overlay) {
        document.removeEventListener('mouseleave', handleMouseLeave);
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
      }

      if (testimonialsPrevBtn) testimonialsPrevBtn.removeEventListener('click', handleTestimonialsPrev);
      if (testimonialsNextBtn) testimonialsNextBtn.removeEventListener('click', handleTestimonialsNext);
      if (testimonialsTrack) {
        testimonialsTrack.removeEventListener('scroll', updateTestimonialsDots);
        testimonialsTrack.removeEventListener('touchstart', pauseAutoRotation);
        testimonialsTrack.removeEventListener('mousedown', pauseAutoRotation);
      }
      window.removeEventListener('resize', updateTestimonialsDots);
      clearInterval(autoRotationInterval);
      if (showcasePrevBtn) showcasePrevBtn.removeEventListener('click', handleShowcasePrev);
      if (showcaseNextBtn) showcaseNextBtn.removeEventListener('click', handleShowcaseNext);
      if (showcaseTrack) showcaseTrack.removeEventListener('scroll', updateDots);
      window.removeEventListener('resize', updateDots);
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div id="scroll-progress-bar"></div>

      {/* Semantic Headings for SEO Parsers, Crawlers and Search Robots */}
      <div 
        className="sr-only" 
        style={{ 
          position: 'absolute', 
          width: '1px', 
          height: '1px', 
          padding: 0, 
          margin: '-1px', 
          overflow: 'hidden', 
          clip: 'rect(0, 0, 0, 0)', 
          whiteSpace: 'nowrap', 
          borderWidth: 0 
        }}
      >
        <h1>
          {currentLang === 'ar' 
            ? 'RedStream™ IPTV متميز - أفضل خدمة اشتراك IPTV مستقرة لعام 2026' 
            : currentLang === 'es' 
            ? 'RedStream™ IPTV Premium - El Mejor Servicio de Suscripción IPTV Estable de 2026'
            : currentLang === 'nl'
            ? 'RedStream™ Premium IPTV - Beste Stabiele IPTV-abonnement Service 2026'
            : 'RedStream™ Premium IPTV - Ultimate 4K IPTV Service 2026'}
        </h1>
        <h2>
          {currentLang === 'ar'
            ? 'لماذا RedStream هو المزود الممتاز رقم #1'
            : currentLang === 'es'
            ? 'Por Qué RedStream es el Proveedor Premium N.º 1'
            : currentLang === 'nl'
            ? 'Waarom RedStream de #1 Premium IPTV-aanbieder is'
            : 'Why RedStream is the #1 Premium Provider'}
        </h2>
        <h2>
          {currentLang === 'ar'
            ? 'التحقق من توافق الأجهزة والأنظمة'
            : currentLang === 'es'
            ? 'Verificar Compatibilidad de Dispositivos'
            : currentLang === 'nl'
            ? 'Controleer Apparaatcompatibiliteit'
            : 'Check Device Compatibility'}
        </h2>
        <h2>
          {currentLang === 'ar'
            ? 'اختر باقة RedStream المناسبة لك'
            : currentLang === 'es'
            ? 'Elija Su Plan de RedStream Premium'
            : currentLang === 'nl'
            ? 'Kies Uw RedStream Premium Plan'
            : 'Choose Your RedStream Plan'}
        </h2>
        <h2>
          {currentLang === 'ar'
            ? 'ماذا يقول أعضاؤنا المميزون'
            : currentLang === 'es'
            ? 'Lo Que Dicen Nuestros Miembros Premium'
            : currentLang === 'nl'
            ? 'Wat Onze Premium Leden Zeggen'
            : 'What Our Premium Members Say'}
        </h2>
        <h2>
          {currentLang === 'ar'
            ? 'الأسئلة الشائعة والاستفسارات'
            : currentLang === 'es'
            ? 'Preguntas Frecuentes'
            : currentLang === 'nl'
            ? 'Veelgestelde Vragen'
            : 'Frequently Asked Questions'}
        </h2>
      </div>

      {/* Navigation Header */}
      <header>
        <div className="container nav-container">
          <a href="#" className="logo" id="logo-anchor">
            {/* Modern Premium RedStream Logo SVG */}
            <svg className="custom-logo-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 0 5px var(--color-primary-glow))' }}>
              <g transform="translate(16, 16) scale(0.93)">
                <path d="M 120 140 L 340 140 A 75 75 0 0 1 415 215 A 75 75 0 0 1 340 290 L 280 290 L 400 380 L 330 380 L 225 300 L 150 380 L 105 380 L 205 300 L 245 250 L 340 250 A 35 35 0 0 0 375 215 A 35 35 0 0 0 340 180 L 160 180 Z" fill="#FF1E27" />
                <polygon points="120,200 200,245 120,290" fill="#FFFFFF" />
              </g>
            </svg>
            Red<span>Stream</span>
          </a>

          {/* Desktop Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center' }}>
            <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-menu">
              <li><a href="#" id="link-home" onClick={() => setIsMobileMenuOpen(false)}>{navTranslations[currentLang].home}</a></li>
              <li><a href="#features" id="link-features" onClick={() => setIsMobileMenuOpen(false)}>{navTranslations[currentLang].features}</a></li>
              <li><a href="#pricing" id="link-pricing" onClick={() => setIsMobileMenuOpen(false)}>{navTranslations[currentLang].pricing}</a></li>
              <li><a href="#faq" id="link-faq" onClick={() => setIsMobileMenuOpen(false)}>{navTranslations[currentLang].faq}</a></li>
              <li><a href={`#/${currentLang}/blog`} id="link-blog" style={{ color: '#FF1E27', fontWeight: 800 }} onClick={() => setIsMobileMenuOpen(false)}>{navTranslations[currentLang].blog}</a></li>
            </ul>
            <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20want%20to%20get%20a%20free%20IPTV%20trial." target="_blank" rel="noopener noreferrer" className="nav-cta" id="nav-cta-trial">{navTranslations[currentLang].cta}</a>
            
            {/* Elegant Language Switcher inside header */}
            <div className="lang-switcher-wrapper" style={{ position: 'relative', display: 'inline-block', marginLeft: '12px' }}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: '#141414',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Globe size={14} style={{ color: '#9ca3af' }} />
                <span>{languageNames[currentLang].flag} {languageNames[currentLang].label}</span>
                <ChevronDown size={12} style={{ color: '#9ca3af', transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {langDropdownOpen && (
                <>
                  <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 999 }} 
                    onClick={() => setLangDropdownOpen(false)} 
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '8px',
                      width: '140px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: '#141414',
                      padding: '4px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                      zIndex: 1000,
                    }}
                  >
                    {Object.entries(languageNames).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onChangeLanguage && onChangeLanguage(key as Language);
                          setLangDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: currentLang === key ? 'rgba(255, 30, 39, 0.1)' : 'transparent',
                          color: currentLang === key ? '#FF1E27' : '#d1d5db',
                          fontWeight: currentLang === key ? 'bold' : 'normal',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s, color 0.2s',
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{value.flag}</span>
                        <span>{value.native}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button 
              className="menu-toggle" 
              id="mobile-menu-btn" 
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ marginLeft: '12px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section & Rest of Landing Page Content */}
      <div dangerouslySetInnerHTML={{ __html: getTranslatedLandingHTML(LANDING_HTML_TOP, currentLang) }} />

      {/* Sleek dynamic FAQ Accordion Component */}
      <FAQSection currentLang={currentLang} />

      {/* Footer and Bottom Floating Widgets */}
      <div dangerouslySetInnerHTML={{ __html: getTranslatedLandingHTML(LANDING_HTML_BOTTOM, currentLang) }} />
    </>
  );
}

const LANDING_HTML_TOP = `
  <!-- Hero Section -->
  <section class="hero container" id="hero-section">
    <div class="badge" id="hero-badge">
      <span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="4"/>
        </svg>
      </span>
      Premium 4K IPTV Service 2026
    </div>
    
    <h1 id="hero-heading">
      <span>Experience Ultimate TV with</span><br>
      <span class="highlight">RedStream™ Premium IPTV</span>
    </h1>
    
    <p id="hero-subheading">
      Stream over 20,000+ live premium TV channels and 60,000+ blockbuster movies & VOD in stunning Ultra HD 4K. Zero freezing, smart loading, and instant instant activation.
    </p>

    <!-- Conversion Countdown Timer -->
    <div class="countdown-timer-container" id="countdown-timer-box">
      <span class="countdown-timer-title">⚡ Special Offer Ends In:</span>
      <div class="countdown-timer">
        <div class="countdown-unit">
          <span class="countdown-number" id="countdown-hours">23</span>
          <span class="countdown-label">hours</span>
        </div>
        <span class="countdown-separator">:</span>
        <div class="countdown-unit">
          <span class="countdown-number" id="countdown-minutes">59</span>
          <span class="countdown-label">mins</span>
        </div>
        <span class="countdown-separator">:</span>
        <div class="countdown-unit">
          <span class="countdown-number" id="countdown-seconds">59</span>
          <span class="countdown-label">secs</span>
        </div>
      </div>
    </div>

    <!-- WhatsApp CTA -->
    <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20would%20like%20to%20activate%20a%20premium%20IPTV%20subscription." target="_blank" rel="noopener noreferrer" class="cta-btn" id="hero-main-cta">
      <!-- WhatsApp Icon -->
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.012 14.059.99 11.45.99c-5.442 0-9.866 4.372-9.87 9.802 0 1.672.454 3.302 1.313 4.735L1.87 20.895l5.59-1.452l-.003-.004-.002-.002-.001-.001zm11.488-7.7c-.3-.15-1.774-.875-2.05-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-3.04-1.516-4.004-2.614-4.834-4.04-.22-.38-.02-.585.18-.78.18-.175.4-.475.6-.7.2-.225.27-.375.4-.625.13-.25.07-.475-.03-.675-.1-.2-.675-1.626-.925-2.225-.244-.589-.49-.51-.675-.52l-.575-.01c-.2 0-.525.075-.8.375-.275.3-1.05 1.026-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.225 5.116 4.525.715.31 1.273.495 1.708.633.72.23 1.374.197 1.892.12.577-.087 1.774-.725 2.025-1.425.25-.7.25-1.3 1.15-1.425.075-.013.15-.075.225-.11z"/>
      </svg>
      Start Watching Instantly on WhatsApp
    </a>

    <!-- Trust Badges Under Hero CTA -->
    <div class="trust-badges-row">
      <div class="trust-badge-item">
        <span class="trust-badge-icon">⚡</span>
        <span>Instant 10-Min Setup</span>
      </div>
      <div class="trust-badge-item">
        <span class="trust-badge-icon">🔒</span>
        <span>99.9% Anti-Freeze Uptime</span>
      </div>
      <div class="trust-badge-item">
        <span class="trust-badge-icon">🛠️</span>
        <span>24/7 VIP Dedicated Support</span>
      </div>
    </div>

    <!-- Live Stats -->
    <div class="stats-row" id="stats-dashboard">
      <div class="stat-item">
        <span class="stat-number accent">15,000+</span>
        <span class="stat-label">Happy Clients</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">99.9%</span>
        <span class="stat-label">Server Uptime</span>
      </div>
      <div class="stat-item">
        <span class="stat-number accent">4.9 / 5</span>
        <span class="stat-label">Google Rating</span>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features" id="features">
    <div class="container">
      <div class="section-header">
        <h2>Why RedStream is the #1 Premium Provider</h2>
        <p>We invest in top-tier bare-metal hardware and proprietary caching algorithms to bring you zero lag and crisp imagery.</p>
      </div>

      <div class="features-grid">
        <!-- Benefit 1 -->
        <div class="feature-card" id="feature-card-1">
          <div class="feature-icon-wrapper">
            <!-- Stability Icon -->
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Anti-Freeze 9.0 Technology</h3>
          <p>Our intelligent load-balancing and direct peering with major ISPs worldwide guarantees stream stability even during major events.</p>
        </div>

        <!-- Benefit 2 -->
        <div class="feature-card" id="feature-card-2">
          <div class="feature-icon-wrapper">
            <!-- Setup Icon -->
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V22M17 5H9.5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8H14.5C15.3284 8 16 8.67157 16 9.5C16 10.3284 15.3284 11 14.5 11H8M12 11V14M16 14H10C9.17157 14 8.5 14.6716 8.5 15.5C8.5 16.3284 9.17157 17 10 17H14C14.8284 17 15.5 17.6716 15.5 18.5C15.5 19.3284 14.8284 20 14 20H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>10-Min Setup & Activation</h3>
          <p>No waiting games. Purchase your desired subscription, ping our WhatsApp agent, and receive your personalized login within 10 minutes.</p>
        </div>

        <!-- Benefit 3 -->
        <div class="feature-card" id="feature-card-3">
          <div class="feature-icon-wrapper">
            <!-- UHD Movie Icon -->
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="7" y1="2" x2="7" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="17" y1="2" x2="17" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="2" y1="7" x2="7" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="2" y1="17" x2="7" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="17" y1="17" x2="22" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="17" y1="7" x2="22" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>20K Live & 60K VOD</h3>
          <p>Full sports catalogs, US/UK/CA local channels, premium cinema, and the hottest Netflix, HBO Max, Disney+, and Amazon Prime releases.</p>
        </div>

        <!-- Benefit 4 -->
        <div class="feature-card" id="feature-card-4">
          <div class="feature-icon-wrapper">
            <!-- Support Icon -->
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>24/7 Support on WhatsApp</h3>
          <p>Real human engineers ready to help you with activation, device troubleshooting, and guide installation anytime, day or night.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Device Compatibility Logos Section -->
  <section class="compatibility" id="compatibility" style="background: linear-gradient(180deg, #0a0a0a 0%, #121212 100%); padding: 60px 0; border-top: 1px solid rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
      <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h2 style="font-family: var(--font-sans, sans-serif); font-weight: 800; font-size: 1.8rem; color: #ffffff; text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 15px;">Supported Devices</h2>
        <p style="color: #aaaaaa; font-size: 1rem; line-height: 1.6; margin-bottom: 40px;">RedStream™ is fully optimized and 100% compatible with all your favorite smart devices and streaming boxes. Setup takes less than 5 minutes.</p>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
          <!-- Smart TV -->
          <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px; transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(229, 9, 20, 0.5)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
            <span style="color: #fff; font-weight: 600; font-size: 0.9rem; font-family: var(--font-sans, sans-serif);">Smart TV</span>
          </div>
          <!-- Android -->
          <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px; transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(229, 9, 20, 0.5)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            <span style="color: #fff; font-weight: 600; font-size: 0.9rem; font-family: var(--font-sans, sans-serif);">Android / iOS</span>
          </div>
          <!-- Apple TV -->
          <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px; transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(229, 9, 20, 0.5)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span style="color: #fff; font-weight: 600; font-size: 0.9rem; font-family: var(--font-sans, sans-serif);">Apple TV</span>
          </div>
          <!-- Firestick -->
          <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px; transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(229, 9, 20, 0.5)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>
            <span style="color: #fff; font-weight: 600; font-size: 0.9rem; font-family: var(--font-sans, sans-serif);">Firestick</span>
          </div>
          <!-- MAG Box -->
          <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px; transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(229, 9, 20, 0.5)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path></svg>
            <span style="color: #fff; font-weight: 600; font-size: 0.9rem; font-family: var(--font-sans, sans-serif);">MAG / Formuler</span>
          </div>
          <!-- PC / Web -->
          <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px; transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='rgba(229, 9, 20, 0.5)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255, 255, 255, 0.08)';">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span style="color: #fff; font-weight: 600; font-size: 0.9rem; font-family: var(--font-sans, sans-serif);">PC / Web Player</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Table Section -->
  <section class="pricing" id="pricing">
    <div class="container">
      <div class="section-header">
        <h2>Choose Your RedStream Plan</h2>
        <p>No hidden fees. Select the subscription period that suits you and start watching instantly via secure WhatsApp order activation.</p>
      </div>

      <div class="pricing-grid">
        <!-- Plan 1: 24h Trial -->
        <div class="pricing-card" id="plan-trial">
          <div class="plan-header">
            <h3 class="plan-name">24 Hours Trial</h3>
            <div class="plan-price-wrapper">
              <span class="plan-price">2</span>
              <span class="plan-currency">€</span>
              <span class="plan-duration">/Once</span>
            </div>
            <p class="plan-desc">Perfect to test our stable server and high 4K streaming quality</p>
          </div>
          <div class="plan-divider"></div>
          <ul class="plan-features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              20,000+ Live Channels
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              60,000+ VOD Movies & Series
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              4K / Ultra HD Quality
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Standard Support Setup
            </li>
          </ul>
          <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20want%20to%20order%20the%2024%20Hours%20IPTV%20Trial%20for%202%E2%82%AC." target="_blank" rel="noopener noreferrer" class="plan-cta" id="btn-trial-order">Get 24H Trial</a>
        </div>

        <!-- Plan 2: 1 Month -->
        <div class="pricing-card" id="plan-1month">
          <div class="plan-header">
            <h3 class="plan-name">1 Month</h3>
            <div class="plan-price-wrapper">
              <span class="plan-price">12</span>
              <span class="plan-currency">€</span>
              <span class="plan-duration">/Month</span>
            </div>
            <p class="plan-desc">Flexible month-by-month premium access. Cancel anytime.</p>
          </div>
          <div class="plan-divider"></div>
          <ul class="plan-features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              20,000+ Live Channels
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              60,000+ VOD Movies & Series
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              4K / Ultra HD Quality
            </li>
            <li class="premium-feature">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Anti-Freeze Stable Server
            </li>
            <li class="premium-feature">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              24/7 VIP Customer Support
            </li>
          </ul>
          <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20want%20to%20order%20the%201%20Month%20Premium%20Plan%20for%2012%E2%82%AC." target="_blank" rel="noopener noreferrer" class="plan-cta" id="btn-1month-order">Order 1 Month</a>
        </div>

        <!-- Plan 3: 6 Months -->
        <div class="pricing-card" id="plan-6months">
          <div class="plan-header">
            <h3 class="plan-name">6 Months</h3>
            <div class="plan-price-wrapper">
              <span class="plan-price">29</span>
              <span class="plan-currency">€</span>
              <span class="plan-duration">/6 Months</span>
            </div>
            <p class="plan-desc">Our highly popular plan. Ideal for keeping up with sports season.</p>
          </div>
          <div class="plan-divider"></div>
          <ul class="plan-features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              20,000+ Live Channels
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              60,000+ VOD Movies & Series
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              4K / Ultra HD Quality
            </li>
            <li class="premium-feature">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Anti-Freeze Stable Server
            </li>
            <li class="premium-feature">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              24/7 VIP Customer Support
            </li>
          </ul>
          <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20want%20to%20order%20the%206%20Months%20Premium%20Plan%20for%2029%E2%82%AC." target="_blank" rel="noopener noreferrer" class="plan-cta" id="btn-6months-order">Order 6 Months</a>
        </div>

        <!-- Plan 4: 12 Months (Pulsing Red Neon Highlighted) -->
        <div class="pricing-card popular" id="plan-12months">
          <div class="pricing-tag">Best Deal (Save 60%)</div>
          <div class="plan-header">
            <h3 class="plan-name">12 Months</h3>
            <div class="plan-price-wrapper">
              <span class="plan-price">49</span>
              <span class="plan-currency">€</span>
              <span class="plan-duration">/Year</span>
            </div>
            <p class="plan-desc">Ultimate premium package. Save over 60% compared to monthly plan.</p>
          </div>
          <div class="plan-divider"></div>
          <ul class="plan-features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              20,000+ Live Channels
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              60,000+ VOD Movies & Series
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              4K / Ultra HD Quality
            </li>
            <li class="premium-feature">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Anti-Freeze Stable Server
            </li>
            <li class="premium-feature">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              24/7 VIP Customer Support
            </li>
            <li class="premium-feature">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Free Weekly VOD Updates
            </li>
          </ul>
          <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20want%20to%20order%20the%2012%20Months%20Premium%20Plan%20for%2049%E2%82%AC." target="_blank" rel="noopener noreferrer" class="plan-cta" id="btn-12months-order">Get 12 Months (Best Deal)</a>
        </div>
      </div>

    </div>
  </section>

  <!-- Premium Testimonials Carousel Section -->
  <section class="testimonials-section" id="testimonials">
    <div class="container">
      <div class="section-header">
        <h2>What Our Premium Members Say</h2>
        <p>Read real experiences from our global community who enjoy lag-free streaming, quick activation, and dedicated customer support.</p>
      </div>

      <div class="testimonials-slider-wrapper">
        <!-- Navigation Arrows -->
        <button class="testimonial-arrow prev" id="testimonials-prev" aria-label="Previous Review">◀</button>
        <button class="testimonial-arrow next" id="testimonials-next" aria-label="Next Review">▶</button>

        <div class="testimonials-slider-container">
          <div class="testimonials-track" id="testimonials-track">
            
            <!-- Testimonial 1 -->
            <div class="testimonial-card">
              <span class="testimonial-quote-icon">“</span>
              <div class="testimonial-header">
                <div class="testimonial-stars">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p class="testimonial-content">
                "Absolutely phenomenal server stability! I watched the entire Champions League final in full 4K UHD without a single second of buffering. The 10-minute setup via WhatsApp was incredibly fast and professional."
              </p>
              <div class="testimonial-author-info">
                <div class="testimonial-avatar">L</div>
                <div class="testimonial-meta">
                  <span class="testimonial-name">Liam <span class="testimonial-badge-verified">Verified</span></span>
                  <span class="testimonial-location">United Kingdom</span>
                </div>
              </div>
            </div>

            <!-- Testimonial 2 -->
            <div class="testimonial-card">
              <span class="testimonial-quote-icon">“</span>
              <div class="testimonial-header">
                <div class="testimonial-stars">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p class="testimonial-content">
                "RedStream is by far the best IPTV provider. The premium anti-freeze technology works flawlessly. High-quality channels, amazing support, and the VOD library is updated weekly. Highly recommend!"
              </p>
              <div class="testimonial-author-info">
                <div class="testimonial-avatar">T</div>
                <div class="testimonial-meta">
                  <span class="testimonial-name">Thomas <span class="testimonial-badge-verified">Verified</span></span>
                  <span class="testimonial-location">France</span>
                </div>
              </div>
            </div>

            <!-- Testimonial 3 -->
            <div class="testimonial-card">
              <span class="testimonial-quote-icon">“</span>
              <div class="testimonial-header">
                <div class="testimonial-stars">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p class="testimonial-content">
                "Incredible service! Setup on my Smart TV took less than 10 minutes through WhatsApp support. Stable streams for sports and local channels are very reliable. The customer service is truly 24/7 VIP."
              </p>
              <div class="testimonial-author-info">
                <div class="testimonial-avatar">A</div>
                <div class="testimonial-meta">
                  <span class="testimonial-name">Anass <span class="testimonial-badge-verified">Verified</span></span>
                  <span class="testimonial-location">Morocco</span>
                </div>
              </div>
            </div>

            <!-- Testimonial 4 -->
            <div class="testimonial-card">
              <span class="testimonial-quote-icon">“</span>
              <div class="testimonial-header">
                <div class="testimonial-stars">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p class="testimonial-content">
                "I was skeptical at first, but after testing the trial, I bought the 12-month plan. No freeze during live matches, and crisp 4K picture quality. Activation is fast and the interface is very easy to use."
              </p>
              <div class="testimonial-author-info">
                <div class="testimonial-avatar">S</div>
                <div class="testimonial-meta">
                  <span class="testimonial-name">Sarah <span class="testimonial-badge-verified">Verified</span></span>
                  <span class="testimonial-location">Canada</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Pagination Dots -->
        <div class="testimonials-dots-container" id="testimonials-dots"></div>
      </div>
    </div>
  </section>

  <!-- Trending Entertainment Showcase Section -->
  <section class="showcase-section" id="showcase-section">
    <div class="container">
      <div class="section-header">
        <h2>Trending Entertainment Showcase</h2>
        <p>Explore a taste of our massive library, including blockbuster movies, popular TV shows, and premium live broadcasts, all streamable on any device.</p>
      </div>

      <div class="showcase-slider-wrapper">
        <!-- Navigation Arrows -->
        <button class="showcase-arrow prev" id="showcase-prev" aria-label="Previous Slide">◀</button>
        <button class="showcase-arrow next" id="showcase-next" aria-label="Next Slide">▶</button>

        <div class="showcase-slider-container">
          <div class="showcase-track" id="showcase-track">
            <!-- 1. Past Lives -->
            <div class="showcase-slide">
              <span class="showcase-badge">TOP RATED</span>
              <img src="/1000148213-iptv-france.webp" alt="Stream Past Lives on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Past Lives</h3>
                <div class="showcase-info">
                  <span>Romance / Drama</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 2. Road House -->
            <div class="showcase-slide">
              <span class="showcase-badge">ACTION HIT</span>
              <img src="/1000148217-iptv-france.webp" alt="Stream Road House on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Road House</h3>
                <div class="showcase-info">
                  <span>Action / Thriller</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 3. Saltburn -->
            <div class="showcase-slide">
              <span class="showcase-badge">MUST WATCH</span>
              <img src="/1000148233-iptv-france.webp" alt="Stream Saltburn on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Saltburn</h3>
                <div class="showcase-info">
                  <span>Thriller / Drama</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 4. Killers of the Flower Moon -->
            <div class="showcase-slide">
              <span class="showcase-badge">OSCAR NOMINEE</span>
              <img src="/1000148230-iptv-france.webp" alt="Stream Killers of the Flower Moon on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Killers of the Flower Moon</h3>
                <div class="showcase-info">
                  <span>Crime / Drama</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 5. Inception -->
            <div class="showcase-slide">
              <span class="showcase-badge">CLASSIC</span>
              <img src="/1000148232-iptv-france.webp" alt="Stream Inception on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Inception</h3>
                <div class="showcase-info">
                  <span>Sci-Fi / Action</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 6. Shogun -->
            <div class="showcase-slide">
              <span class="showcase-badge">CRITICS CHOICE</span>
              <img src="/1000148219-iptv-france.webp" alt="Stream Shogun on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Shogun</h3>
                <div class="showcase-info">
                  <span>History / Drama</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 7. Poor Things -->
            <div class="showcase-slide">
              <span class="showcase-badge">AWARD WINNER</span>
              <img src="/1000148223-iptv-france.webp" alt="Stream Poor Things on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Poor Things</h3>
                <div class="showcase-info">
                  <span>Sci-Fi / Comedy</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 8. 3 Body Problem -->
            <div class="showcase-slide">
              <span class="showcase-badge">SCI-FI EPIC</span>
              <img src="/1000148222-iptv-france.webp" alt="Stream 3 Body Problem on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">3 Body Problem</h3>
                <div class="showcase-info">
                  <span>Sci-Fi / Mystery</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 9. Breaking Bad -->
            <div class="showcase-slide">
              <span class="showcase-badge">ALL-TIME BEST</span>
              <img src="/1000148214-iptv-france.webp" alt="Stream Breaking Bad on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Breaking Bad</h3>
                <div class="showcase-info">
                  <span>Crime / Thriller</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 10. Ghostbusters: Frozen Empire -->
            <div class="showcase-slide">
              <span class="showcase-badge">FAMILY HIT</span>
              <img src="/1000148218-iptv-france.webp" alt="Stream Ghostbusters: Frozen Empire on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Ghostbusters: Frozen Empire</h3>
                <div class="showcase-info">
                  <span>Comedy / Fantasy</span>
                  <span class="showcase-quality">1080p</span>
                </div>
              </div>
            </div>

            <!-- 11. The Holdovers -->
            <div class="showcase-slide">
              <span class="showcase-badge">COMEDY HIT</span>
              <img src="/1000148228-iptv-france.webp" alt="Stream The Holdovers on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">The Holdovers</h3>
                <div class="showcase-info">
                  <span>Comedy / Drama</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 12. La Sociedad de la Nieve -->
            <div class="showcase-slide">
              <span class="showcase-badge">TOP STREAM</span>
              <img src="/1000148231-iptv-france.webp" alt="Stream La Sociedad de la Nieve on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">La Sociedad de la Nieve</h3>
                <div class="showcase-info">
                  <span>Survival / Adventure</span>
                  <span class="showcase-quality">1080p</span>
                </div>
              </div>
            </div>

            <!-- 13. Masters of the Air -->
            <div class="showcase-slide">
              <span class="showcase-badge">FULL SERIES</span>
              <img src="/1000148225-iptv-france.webp" alt="Stream Masters of the Air on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Masters of the Air</h3>
                <div class="showcase-info">
                  <span>War / History</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 14. Shaitaan -->
            <div class="showcase-slide">
              <span class="showcase-badge">TRENDING</span>
              <img src="/1000148226-iptv-france.webp" alt="Stream Shaitaan on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Shaitaan</h3>
                <div class="showcase-info">
                  <span>Horror / Thriller</span>
                  <span class="showcase-quality">1080p</span>
                </div>
              </div>
            </div>

            <!-- 15. 20 Days in Mariupol -->
            <div class="showcase-slide">
              <span class="showcase-badge">DOCUMENTARY</span>
              <img src="/1000148229-iptv-france.webp" alt="Stream 20 Days in Mariupol on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">20 Days in Mariupol</h3>
                <div class="showcase-info">
                  <span>Documentary</span>
                  <span class="showcase-quality">1080p</span>
                </div>
              </div>
            </div>

            <!-- 16. Avatar: The Last Airbender -->
            <div class="showcase-slide">
              <span class="showcase-badge">NETFLIX HIT</span>
              <img src="/1000148227-iptv-france.webp" alt="Stream Avatar: The Last Airbender on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">The Last Airbender</h3>
                <div class="showcase-info">
                  <span>Action / Fantasy</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 17. Succession -->
            <div class="showcase-slide">
              <span class="showcase-badge">HBO ORIGINAL</span>
              <img src="/1000148216-iptv-france.webp" alt="Stream Succession on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Succession</h3>
                <div class="showcase-info">
                  <span>Drama / Corporate</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 18. The Last of Us -->
            <div class="showcase-slide">
              <span class="showcase-badge">POPULAR</span>
              <img src="/1000148215-iptv-france.webp" alt="Stream The Last of Us on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">The Last of Us</h3>
                <div class="showcase-info">
                  <span>Sci-Fi / Drama</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 19. The Bear -->
            <div class="showcase-slide">
              <span class="showcase-badge">CRITICS CHOICE</span>
              <img src="/1000148224-iptv-france.webp" alt="Stream The Bear on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">The Bear</h3>
                <div class="showcase-info">
                  <span>Comedy / Drama</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 20. Severance -->
            <div class="showcase-slide">
              <span class="showcase-badge">MIND-BENDING</span>
              <img src="/1000148220-iptv-france.webp" alt="Stream Severance on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Severance</h3>
                <div class="showcase-info">
                  <span>Sci-Fi / Mystery</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 21. Damsel -->
            <div class="showcase-slide">
              <span class="showcase-badge">FANTASY HIT</span>
              <img src="/1000148216-iptv-france.webp" alt="Stream Damsel on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Damsel</h3>
                <div class="showcase-info">
                  <span>Fantasy / Adventure</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 22. The Gentlemen -->
            <div class="showcase-slide">
              <span class="showcase-badge">GUY RITCHIE</span>
              <img src="/1000148221-iptv-france.webp" alt="Stream The Gentlemen on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">The Gentlemen</h3>
                <div class="showcase-info">
                  <span>Action / Comedy</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 23. The Shawshank Redemption -->
            <div class="showcase-slide">
              <span class="showcase-badge">IMDb #1</span>
              <img src="/1000148211-iptv-france.webp" alt="Stream The Shawshank Redemption on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">The Shawshank Redemption</h3>
                <div class="showcase-info">
                  <span>Drama / Classic</span>
                  <span class="showcase-quality">1080p</span>
                </div>
              </div>
            </div>

            <!-- 24. Fight Club -->
            <div class="showcase-slide">
              <span class="showcase-badge">CULT CLASSIC</span>
              <img src="/1000148209-iptv-france.webp" alt="Stream Fight Club on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Fight Club</h3>
                <div class="showcase-info">
                  <span>Drama / Thriller</span>
                  <span class="showcase-quality">1080p</span>
                </div>
              </div>
            </div>

            <!-- 25. Joker -->
            <div class="showcase-slide">
              <span class="showcase-badge">MASTERPIECE</span>
              <img src="/1000148212-iptv-france.webp" alt="Stream Joker on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">Joker</h3>
                <div class="showcase-info">
                  <span>Drama / Crime</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>

            <!-- 26. The Dark Knight -->
            <div class="showcase-slide">
              <span class="showcase-badge">BEST HERO</span>
              <img src="/1000148210-iptv-france.webp" alt="Stream The Dark Knight on IPTV France - Premium Cinema Streaming" loading="lazy">
              <div class="showcase-overlay">
                <h3 class="showcase-title">The Dark Knight</h3>
                <div class="showcase-info">
                  <span>Action / Crime</span>
                  <span class="showcase-quality">4K UHD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Dots -->
        <div class="showcase-dots-container" id="showcase-dots"></div>
      </div>
    </div>
  </section>
`;

const LANDING_HTML_BOTTOM = `
  <!-- Payments & Brand Footer -->
  <footer class="payments-footer">
    <div class="container payments-container">
      
      <div class="payment-title">Guaranteed Safe & Trusted Checkout</div>
      
      <!-- Payments Grid with beautifully customized vector SVGs -->
      <div class="payment-methods-grid" id="payment-badge-container">
        <!-- PayPal Badge -->
        <div class="payment-badge" id="payment-paypal">
          <svg class="badge-paypal" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.076 21.337L9.57 5.518c.09-.571.583-.984 1.161-.984h6.052c2.81 0 4.192 1.348 3.864 3.424-.413 2.61-2.023 4.167-4.475 4.167h-2.148l-.946 5.992c-.042.27-.275.465-.548.465H9.563c-.116 0-.214-.075-.246-.187L7.076 21.337z"/>
            <path opacity="0.6" d="M4.076 18.337L6.57 2.518c.09-.571.583-.984 1.161-.984h6.052c2.81 0 4.192 1.348 3.864 3.424-.413 2.61-2.023 4.167-4.475 4.167h-2.148l-.946 5.992c-.042.27-.275.465-.548.465H6.563c-.116 0-.214-.075-.246-.187L4.076 18.337z"/>
          </svg>
          <span>PayPal</span>
        </div>

        <!-- Stripe Badge -->
        <div class="payment-badge" id="payment-stripe">
          <svg class="badge-stripe" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.93 10.12c0-.62-.51-1.01-1.39-1.01-.81 0-1.63.26-2.41.68l-.45-2.27c.89-.39 2.05-.68 3.26-.68 2.37 0 3.73 1.16 3.73 3.19v5.27c0 .99.19 1.63.45 2.07h-2.61c-.13-.26-.26-.64-.32-.99-.68.68-1.71 1.13-2.87 1.13-1.89 0-3.15-1.06-3.15-2.73 0-2.31 2.37-3.19 5.31-3.19v-.47zm-2.41 3.51c0 .54.41.87.97.87.75 0 1.44-.45 1.44-1.25V12.1h-.97c-1.02 0-1.44.4-1.44 1.12z"/>
          </svg>
          <span>Stripe</span>
        </div>

        <!-- Crypto Badge -->
        <div class="payment-badge" id="payment-crypto">
          <svg class="badge-crypto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.6 12.5c-.7-2.6-2.4-4.5-4.9-5.3l1.1-4.2-2.5-.6-1 4.1c-.7-.2-1.3-.3-2-.5l1.1-4.2-2.5-.6-1.1 4.2c-.5-.1-1.1-.2-1.6-.4l-3.5-.9-.7 2.7s1.9.4 1.8.5c1 .3 1.2 1 1.2 1.5l-1.2 4.9c.1 0 .2.1.3.1-.1 0-.2-.1-.3-.1l-1.7 6.8c-.1.3-.4.8-1.1.6 0 0-1.8-.4-1.8-.4l-1.3 3 3.3.8c.6.2 1.2.3 1.8.5l-1.1 4.3 2.5.6 1.1-4.2c.7.2 1.3.3 1.9.5l-1.1 4.2 2.5.6 1.1-4.2c4.3.8 7.5-.1 8.5-3.4.8-2.6-.1-4.2-2-5.1 1.3-.4 2.3-1.4 2.6-3.4zm-4.7 7.4c-.8 3.1-4.2 1.4-5.4 1.1l1.1-4.5c1.2.3 5.1.8 4.3 3.4zm1-6.9c-.7 2.8-3.5 1.4-4.5 1.1l1-4.1c1 .3 4.2.8 3.5 3zm0 0"/>
          </svg>
          <span>Crypto (BTC/USDT)</span>
        </div>

        <!-- Western Union Badge -->
        <div class="payment-badge" id="payment-wu">
          <svg class="badge-wu" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#ffcc00"/>
            <text x="12" y="16" font-family="'Outfit', sans-serif" font-weight="800" font-size="12" fill="#000000" text-anchor="middle">WU</text>
          </svg>
          <span>Western Union</span>
        </div>

        <!-- Ria Badge -->
        <div class="payment-badge" id="payment-ria">
          <svg class="badge-ria" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
          </svg>
          <span>Ria Money Transfer</span>
        </div>
      </div>

      <div class="footer-divider"></div>

      <!-- Legal & copyright -->
      <div class="footer-bottom-info">
        <div id="footer-copy">© 2026 RedStream™ IPTV. All rights reserved.</div>
        <ul class="footer-links" id="footer-links-list">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="https://wa.me/212694843943" target="_blank" rel="noopener noreferrer">Contact</a></li>
        </ul>
      </div>

      <!-- Compliance Disclaimer -->
      <p class="disclaimer-text">
        Disclaimer: RedStream™ does not host, upload, or stream any media files. We are a search and custom subscription delivery assistant that helps users connect to stable servers. All streams and TV channels listed are copyright of their respective owners.
      </p>
    </div>
  </footer>

  <!-- Floating Pulsing WhatsApp Button Widget -->
  <a href="https://wa.me/212694843943?text=Hello%20RedStream,%20I%20am%20on%20your%20website%20and%20would%20like%20to%20get%20a%20premium%20IPTV%20trial." class="whatsapp-floating" target="_blank" rel="noopener noreferrer" id="floating-whatsapp-btn" aria-label="Chat with our sales agent on WhatsApp">
    <div class="whatsapp-pulse"></div>
    <!-- Clean WhatsApp SVG -->
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.012 14.059.99 11.45.99c-5.442 0-9.866 4.372-9.87 9.802 0 1.672.454 3.302 1.313 4.735L1.87 20.895l5.59-1.452zm11.488-7.7c-.3-.15-1.774-.875-2.05-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-3.04-1.516-4.004-2.614-4.834-4.04-.22-.38-.02-.585.18-.78.18-.175.4-.475.6-.7.2-.225.27-.375.4-.625.13-.25.07-.475-.03-.675-.1-.2-.675-1.626-.925-2.225-.244-.589-.49-.51-.675-.52l-.575-.01c-.2 0-.525.075-.8.375-.275.3-1.05 1.026-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.225 5.116 4.525.715.31 1.273.495 1.708.633.72.23 1.374.197 1.892.12.577-.087 1.774-.725 2.025-1.425.25-.7.25-1.3 1.15-1.425.075-.013.15-.075.225-.11z"/>
    </svg>
  </a>
`;
