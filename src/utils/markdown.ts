/**
 * Lightweight, high-performance Frontmatter & Markdown Compiler.
 * Designed specifically for optimal SEO and instant load times.
 */

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string;
  coverImage: string;
  author: string;
  readTime: string;
  tags: string[];
  contentHtml: string;
}

export function parseMarkdown(slug: string, mdContent: string): BlogPost {
  const frontmatter: Record<string, string> = {};
  let markdownBody = "";

  // Split on frontmatter boundaries
  if (mdContent.startsWith("---")) {
    const parts = mdContent.split("---");
    if (parts.length >= 3) {
      const frontmatterLines = parts[1].split("\n");
      frontmatterLines.forEach((line) => {
        const colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let val = line.substring(colonIndex + 1).trim();
          // Strip wrapping quotes if any
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          frontmatter[key] = val;
        }
      });
      // Re-join the remaining parts as markdown body
      markdownBody = parts.slice(2).join("---").trim();
    } else {
      markdownBody = mdContent.trim();
    }
  } else {
    markdownBody = mdContent.trim();
  }

  // Compile Markdown Body to SEO-optimized responsive HTML
  const contentHtml = compileMarkdownToHtml(markdownBody);

  return {
    slug,
    title: frontmatter.title || "Untitled Post",
    date: frontmatter.date || new Date().toISOString().split("T")[0],
    description: frontmatter.description || "",
    keywords: frontmatter.keywords || "",
    coverImage: frontmatter.coverImage || "",
    author: frontmatter.author || "RedStream Writer",
    readTime: frontmatter.readTime || "3 min read",
    tags: frontmatter.tags ? frontmatter.tags.split(",").map((t) => t.trim()) : [],
    contentHtml,
  };
}

function compileMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Escaping simple HTML tags to avoid security problems
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (```language ... ```)
  html = html.replace(/```([\s\S]*?)```/gm, (_, code) => {
    return `<pre class="bg-[#111] border border-white/10 rounded-lg p-4 font-mono text-sm overflow-x-auto text-[#eee] my-6"><code>${code.trim()}</code></pre>`;
  });

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded font-mono text-sm text-red-500">$1</code>');

  // Headings: # Header -> h1, ## Header -> h2, ### Header -> h3, etc.
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl md:text-4xl font-extrabold text-white mt-10 mb-6 font-display italic tracking-tight uppercase">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl md:text-3xl font-extrabold text-white mt-8 mb-4 border-b border-white/5 pb-2 font-display italic tracking-tight uppercase">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl md:text-2xl font-bold text-white mt-6 mb-3 font-display">$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4 class="text-lg md:text-xl font-semibold text-white mt-4 mb-2 font-display">$1</h4>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-white/10 my-8">');

  // Blockquotes: > quote
  html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-4 border-red-600 bg-white/5 pl-4 pr-2 py-3 italic rounded text-gray-300 my-6 font-serif">$1</blockquote>');

  // Lists: Unordered list items (- or *)
  // Match contiguous lines starting with - or * and group them under <ul>
  let inList = false;
  const lines = html.split("\n");
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[\-\*]\s(.*)$/);
    const olMatch = line.match(/^(\d+)\.\s(.*)$/);

    if (ulMatch) {
      if (!inList) {
        processedLines.push('<ul class="list-disc list-inside space-y-2 text-gray-300 my-4 pl-4 rtl:pr-4">');
        inList = true;
      }
      processedLines.push(`  <li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList) {
        processedLines.push('<ol class="list-decimal list-inside space-y-2 text-gray-300 my-4 pl-4 rtl:pr-4">');
        inList = true;
      }
      processedLines.push(`  <li>${olMatch[2]}</li>`);
    } else {
      if (inList) {
        processedLines.push(line.startsWith("</ul") || line.startsWith("</ol") ? "" : "</ul"); // closes the tag if appropriate
        inList = false;
      }
      processedLines.push(line);
    }
  }
  if (inList) {
    processedLines.push("</ul>");
  }
  html = processedLines.join("\n");

  // Bold (**text** or __text__)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong class="font-bold text-white">$1</strong>');

  // Italics (*text* or _text_)
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-200">$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em class="italic text-gray-200">$1</em>');

  // Images with referral policy and lazy load: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" referrerPolicy="no-referrer" class="w-full max-w-3xl mx-auto rounded-lg shadow-2xl border border-white/5 my-8">');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-500 hover:text-red-400 font-medium underline transition duration-200">$1</a>');

  // Paragraphs
  // Group separate lines into <p> unless they are block elements
  const blockTags = ["<h1", "<h2", "<h3", "<h4", "<ul", "<ol", "<li", "<pre", "<blockquote", "<hr", "<img", "</ul", "</ol", "</ul>", "</ol>"];
  const finalLines = html.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "";
    const isBlock = blockTags.some((tag) => trimmed.startsWith(tag));
    if (isBlock) return line;
    return `<p class="text-gray-300 leading-relaxed my-4 text-base md:text-lg">${line}</p>`;
  });

  return finalLines.filter((l) => l !== "").join("\n");
}
