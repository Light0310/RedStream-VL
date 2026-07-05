/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ar' | 'es' | 'nl' | 'fr' | 'ru' | 'de';

export type View = 'home' | 'blog' | 'post' | 'about';

export interface Route {
  lang: Language;
  view: View;
  slug?: string;
}

export interface Frontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  description: string;
}

export interface BlogPost {
  slug: string;
  lang: Language;
  title: string;
  date: string;
  author: string;
  tags: string[];
  description: string;
  content: string;
  readingTime: number; // in minutes
}

export interface TranslationDictionary {
  navHome: string;
  navBlog: string;
  navAbout: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutText3: string;
  blogTitle: string;
  blogSubtitle: string;
  searchPlaceholder: string;
  noPosts: string;
  readMore: string;
  backToBlog: string;
  publishedOn: string;
  writtenBy: string;
  readingTimeLabel: string;
  minutesRead: string;
  filterByTag: string;
  allTags: string;
  footerRights: string;
  footerDesc: string;
}
