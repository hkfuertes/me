export const SEO_CONFIG = {
  // Use PUBLIC_SITE_URL from env, or SITE from astro.config, or fallback
  siteUrl: import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE || 'https://mfuertes.net',
  siteName: 'Miguel Fuertes',
  author: {
    name: 'Miguel Fuertes',
    email: 'mjfuertesf@gmail.com',
    github: 'hkfuertes',
    twitter: '@hkfuertes', // Opcional
  },
  defaultDescription: 'Senior Software Engineer with 10+ years experience in backend development, cloud platforms, and embedded systems.',
  defaultImage: '/images/profile.jpeg',
  locale: 'es_ES',
  twitterCard: 'summary_large_image' as const,
}

export function getCanonicalUrl(path: string): string {
  const url = new URL(path, SEO_CONFIG.siteUrl)
  return url.toString()
}

/**
 * Get OG image URL for a specific post
 * Uses pre-generated static images from /og/[id].png
 */
export function getOgImageUrl(id: string): string {
  return `${SEO_CONFIG.siteUrl}/og/${id}.png`
}
