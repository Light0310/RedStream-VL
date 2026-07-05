/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost, Language } from './types';

// Statically query all markdown files in /src/content/blog using Vite's glob import
const markdownModules = import.meta.glob<string>('/src/content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Parses raw markdown content with standard Frontmatter
 */
export function parseMarkdown(rawContent: string): { frontmatter: any; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  const defaultFrontmatter = {
    title: 'Untitled Post',
    date: new Date().toISOString().split('T')[0],
    author: 'Admin',
    tags: [] as string[],
    description: '',
  };

  if (!match) {
    return { frontmatter: defaultFrontmatter, content: rawContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const frontmatter = { ...defaultFrontmatter };

  yamlBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let val = line.slice(colonIndex + 1).trim();

      // Clean wrapping quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      if (key === 'tags') {
        if (val.startsWith('[') && val.endsWith(']')) {
          frontmatter.tags = val
            .slice(1, -1)
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        } else {
          frontmatter.tags = val
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        }
      } else {
        (frontmatter as any)[key] = val;
      }
    }
  });

  return { frontmatter, content };
}

/**
 * Compiles all loaded markdown modules into structured BlogPost objects
 */
export function loadBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const filePath in markdownModules) {
    const rawContent = markdownModules[filePath];
    if (typeof rawContent !== 'string') continue;

    // File path format: /src/content/blog/{lang}/{slug}.md
    const pathParts = filePath.split('/');
    // Extract lang and slug
    const langIndex = pathParts.indexOf('blog') + 1;
    const lang = pathParts[langIndex] as Language;
    const fileName = pathParts[langIndex + 1];
    const slug = fileName.replace('.md', '');

    const { frontmatter, content } = parseMarkdown(rawContent);

    // Calculate reading time (approx. 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    posts.push({
      slug,
      lang,
      title: frontmatter.title || 'Untitled Post',
      date: frontmatter.date || '',
      author: frontmatter.author || 'Anonymous',
      tags: frontmatter.tags || [],
      description: frontmatter.description || '',
      content,
      readingTime,
    });
  }

  // Sort posts by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Helper to fetch posts for a specific language
 */
export function getPostsByLanguage(lang: Language): BlogPost[] {
  return loadBlogPosts().filter((post) => post.lang === lang);
}

/**
 * Helper to fetch a single blog post
 */
export function getPostBySlug(slug: string, lang: Language): BlogPost | undefined {
  return loadBlogPosts().find((post) => post.slug === slug && post.lang === lang);
}
