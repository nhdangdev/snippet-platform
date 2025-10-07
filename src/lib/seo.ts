import { Metadata } from 'next';

type SEOConfig = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
};

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const siteName = 'Snippet Platform';
const defaultOgImage = `${baseUrl}/og-image.png`;

export function generateSEO({
  title,
  description,
  keywords = [],
  ogImage = defaultOgImage,
  noIndex = false,
  canonical,
}: SEOConfig): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Snippet Platform Team' }],
    creator: 'Snippet Platform',
    publisher: 'Snippet Platform',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: canonical || baseUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical || baseUrl,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@snippetplatform',
    },
    metadataBase: new URL(baseUrl),
  };
}

export function generateProfileSEO(
  username: string,
  snippetCount: number = 0
): Metadata {
  return generateSEO({
    title: `${username}'s Profile`,
    description: `View ${username}'s code snippets and contributions. ${snippetCount} snippets shared with the developer community.`,
    keywords: ['developer', 'profile', username, 'code snippets'],
    canonical: `${baseUrl}/profile/${username}`,
  });
}

export function generateSnippetSEO(
  title: string,
  description: string,
  language: string,
  author: string
): Metadata {
  return generateSEO({
    title,
    description: description || `Code snippet in ${language} by ${author}`,
    keywords: ['code', 'snippet', language, 'programming', author],
  });
}

// JSON-LD structured data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'A modern platform for developers to share and discover code snippets',
    sameAs: [
      'https://twitter.com/snippetplatform',
      'https://github.com/snippetplatform',
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    description:
      'Share code snippets with time complexity analysis. A platform for developers to learn and collaborate.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePersonSchema(user: {
  name: string;
  username: string;
  bio?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.name,
    alternateName: user.username,
    description: user.bio || `Developer profile for ${user.name}`,
    image: user.image || `${baseUrl}/default-avatar.png`,
    url: `${baseUrl}/profile/${user.username}`,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
