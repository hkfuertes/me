# SEO Strategy Documentation

## Overview
Complete SEO implementation for the portfolio with meta tags, structured data, dynamic OG images, and semantic URLs.

## URLs Strategy

### Current Structure
All content uses `/blog/[id]` pattern:
- **Gists**: `/blog/9dd10da4a6bd0cdac6706400184539f7`
- **GitHub Repos**: `/blog/github-hkfuertes-virtual-screen`
- **Contributions**: External URLs only (no detail pages)

### Why This Approach?
- **Simplicity**: Single routing pattern, easier to maintain
- **Flexibility**: All "Writing" content in one place
- **SEO**: Meta tags and structured data differentiate content types

### Future: Semantic Slugs (Optional)
To implement semantic slugs like `/blog/deploying-rails-docker`:

1. Use `generateSlug()` from `src/utils/slugify.ts`
2. Add slug field to content schema
3. Update `getStaticPaths()` to use slugs instead of IDs
4. Handle redirects from old URLs if needed

## Configuration

### Domain Setup
Edit `src/data/seo.ts` or set environment variable:

```bash
# Development
export PUBLIC_SITE_URL=http://localhost:4321

# Production
export PUBLIC_SITE_URL=https://yourdomain.com
```

### Author Info
Update `src/data/seo.ts`:
```typescript
author: {
  name: 'Your Name',
  email: 'your@email.com',
  twitter: '@yourhandle', // Optional
}
```

## Meta Tags Implementation

### Pages Coverage
- ✅ **Homepage** (`/`): Basic meta tags
- ✅ **Blog List** (`/blog`): Collection meta tags
- ✅ **Article Detail** (`/blog/[id]`): Full article meta tags + JSON-LD

### Meta Tags Included
Each page includes:
- **Basic SEO**: title, description, canonical URL, keywords
- **Open Graph**: og:type, og:title, og:description, og:image, og:url, og:site_name
- **Twitter Cards**: summary_large_image, creator, title, description
- **Article Metadata**: published_time, modified_time, author, tags
- **Robots**: index/follow directives

### Example Output
```html
<!-- Homepage -->
<title>Miguel Fuertes - Senior Software Engineer</title>
<meta property="og:type" content="website" />

<!-- Article -->
<title>Virtual Screen - Miguel Fuertes</title>
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2025-01-15T00:00:00.000Z" />
<meta property="article:tag" content="linux" />
```

## Structured Data (JSON-LD)

### Schema Types
- **Articles** (Gists): `Article` schema
- **Projects** (GitHub Repos): `SoftwareSourceCode` schema

### Example JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "headline": "Virtual Screen",
  "description": "Utility to share...",
  "datePublished": "2025-01-15T00:00:00.000Z",
  "dateModified": "2025-01-20T00:00:00.000Z",
  "author": {
    "@type": "Person",
    "name": "Miguel Fuertes"
  },
  "codeRepository": "https://github.com/hkfuertes/virtual-screen",
  "programmingLanguage": "Shell"
}
```

## Open Graph Images

### How It Works

OG images are generated as **static routes** at build time:

**Blog Posts & Projects:**
- **Route**: `/og/[id].png.ts`
- **Output**: `/og/{id}.png` for each blog post/project
- **Method**: Uses `getStaticPaths()` to pre-generate all images

**Landing Page:**
- **Route**: `/og-home.png.ts`
- **Output**: `/og-home.png` (single static image)
- **Content**: Name, title, bio, and contact information

Both work in development and production (no adapter needed!)

### Build Process

**Blog/Project Images** (`src/pages/og/[id].png.ts`):

1. Uses `getStaticPaths()` to fetch content:
   - All gists (have detail pages)
   - GitHub repos with README only (`showReadme: true`, have detail pages)
   - Repos without README are excluded (no detail page = no OG image needed)
2. For each item, determines the optimal title and type
3. Generates a 1200x630 PNG using `@vercel/og`
4. Astro builds these as static files in `dist/og/`

**Landing Image** (`src/pages/og-home.png.ts`):

1. Generates single static image with contact info
2. Shows: Name, title, bio, email, GitHub, LinkedIn
3. Follows same Swiss Design aesthetic

Example build output:
```
λ src/pages/og/[id].png.ts
  ├─ /og/9dd10da4a6bd0cdac6706400184539f7.png (+363ms)  # Gist
  ├─ /og/a37776f4e94de34cc3a4658b15ec1545.png (+212ms)  # Gist
  ├─ /og/github-hkfuertes-virtual-screen.png (+187ms)   # Repo with README
  └─ /og/github-hkfuertes-phpchords.png (+170ms)        # Repo with README
  # Note: Repos without README are not included (no detail page)

λ src/pages/og-home.png.ts
  └─ /og-home.png (+180ms)
```

### Title Selection Logic

The OG image title is automatically determined in `getStaticPaths()`:

**For GitHub Projects:**
- If description exists and is > 20 chars: Use full description
  - Example: "Turn your iPad Air M1 into a second display for Linux Mint via USB"
- Otherwise: Format repo name with proper capitalization
  - `virtual-screen` → "Virtual Screen"
  - `pi_uvc_screen` → "Pi Uvc Screen"

**For Gists:**
- Always use the gist title as-is
  - Example: "Guide to install latest version of tailscale on OpenWRT"

### Design Features
- Dark background (#0f1114) with subtle grid pattern
- Type badge (top): Color-coded by content type
  - Writing: `#6ee7b7` (emerald-300)
  - Project: `#10b981` (emerald-500)
  - Contribution: `#6ee7b7` (emerald-300)
- Title: Large, bold, responsive font (48-80px based on length)
- Word wrapping for long titles
- Author name with accent line at bottom
- Dimensions: 1200x630 (optimal for social media)

### File Locations

- **Blog/Project Images**: `src/pages/og/[id].png.ts` (uses `getStaticPaths`)
- **Landing Image**: `src/pages/og-home.png.ts` (static endpoint)
- **SEO Helper**: `src/data/seo.ts` → `getOgImageUrl(id)`
- **Generated Images**: `dist/og/*.png` + `dist/og-home.png` (created during build)

### Usage in Pages

**Blog posts** (`src/pages/blog/[id].astro`):
```typescript
const ogImage = getOgImageUrl(post.id);
// Returns: https://mfuertes.net/og/{id}.png
```

**Landing page** (`src/pages/index.astro`):
```typescript
const ogImage = `${SEO_CONFIG.siteUrl}/og-home.png`;
// Returns: https://mfuertes.net/og-home.png
```

### Testing

**Development:**
```bash
npm run dev

# Test blog/project image
curl "http://localhost:4321/og/github-hkfuertes-virtual-screen.png" -o test-blog.png

# Test landing image
curl "http://localhost:4321/og-home.png" -o test-home.png
```

**Production (after build):**
```bash
npm run build
ls -lh dist/og/  # Check blog/project images (6 files: 3 gists + 3 repos with README)
ls -lh dist/og-home.png  # Check landing image
file dist/og-home.png  # Verify format
```

**Social Media Validators:**
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Troubleshooting

**Images not generating during build:**
- Check that `getStaticPaths` is returning items: look for `λ src/pages/og/[id].png.ts` in build output
- Verify content collections have data: `getCollection('gists')` and `getCollection('githubRepos')`

**Images show wrong title:**
- Check the title selection logic in `src/pages/og/[id].png.ts`
- For GitHub repos: verify `data.description` field
- Rebuild to regenerate images: `npm run build`

**Images not loading in social media:**
- Verify images exist: `ls dist/og/`
- Check URL in meta tag matches file path
- Use validators to debug (Facebook/Twitter debuggers)
- Clear social media cache (may take 24-48 hours)

**Build works but dev server shows 404:**
- Make sure dev server is running: `npm run dev`
- Static routes work in both dev and production with Astro 5.x

### Testing Locally
```bash
# Download example images
curl "http://localhost:4321/og-image.png?title=My%20Article&type=blog" -o blog.png
curl "http://localhost:4321/og-image.png?title=My%20Project&type=project" -o project.png
curl "http://localhost:4321/og-image.png?title=Bug%20Fix&type=contribution" -o contrib.png

# Verify dimensions
file blog.png  # Should show: PNG image data, 1200 x 630
```

### Preview Examples
- **Long Description**: `http://localhost:4321/og-image.png?title=Turn%20your%20iPad%20into%20a%20display&type=project`
- **Short Name**: `http://localhost:4321/og-image.png?title=Phpchords&type=project`
- **Gist**: `http://localhost:4321/og-image.png?title=Guide%20to%20install%20Tailscale&type=blog`

## Sitemap & Robots

### Sitemap (`/sitemap.xml`)
Auto-generated with:
- All static pages (/, /blog)
- All article pages (/blog/[id])
- Priorities and update frequencies
- Last modified dates from content

### Robots.txt (`/robots.txt`)
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

## SEO Checklist

### Pre-Deploy
- [ ] Set `PUBLIC_SITE_URL` environment variable
- [ ] Update author info in `src/config/seo.ts`
- [ ] Verify Twitter handle if using Twitter Cards
- [ ] Test OG images: `/og-image.png?title=Test&type=blog`
- [ ] Validate sitemap: `/sitemap.xml`

### Post-Deploy
- [ ] Submit sitemap to Google Search Console
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Validate structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Check canonical URLs are correct
- [ ] Verify robots.txt is accessible

### Monitoring
- Google Search Console: Track indexing status
- Analytics: Monitor organic traffic
- Rich results: Check if Google shows enhanced results

## File Structure

```
portfolio/src/
├── config/
│   └── seo.ts                    # SEO configuration
├── pages/
│   ├── blog/
│   │   ├── [id].astro           # Article pages (JSON-LD + meta)
│   │   └── index.astro          # Blog list
│   ├── sitemap.xml.astro        # Auto-generated sitemap
│   ├── robots.txt.astro         # Robots directives
│   └── og-image.png.ts          # Dynamic OG image endpoint
├── layouts/
│   └── BaseLayout.astro         # Meta tags template
└── utils/
    └── slugify.ts               # Slug generation (future use)
```

## Performance Tips

### OG Image Caching
The OG image endpoint generates images on-demand. For production:
1. Consider caching with CDN
2. Pre-generate common images at build time
3. Or use static fallback image

### Build Optimization
- Sitemap is generated at build time (static)
- Meta tags are pre-rendered (no client JS needed)
- Structured data is inline (no external requests)

## Testing

### Local Testing
```bash
# Start dev server
docker compose up -d app

# Test pages
curl -I http://localhost:4321/
curl -I http://localhost:4321/blog/
curl http://localhost:4321/sitemap.xml

# Test OG image
curl http://localhost:4321/og-image.png?title=Test > test.png
```

### Validation Tools
- **HTML**: [W3C Validator](https://validator.w3.org/)
- **Meta Tags**: [Metatags.io](https://metatags.io/)
- **Structured Data**: [Schema.org Validator](https://validator.schema.org/)
- **Open Graph**: [OpenGraph.xyz](https://www.opengraph.xyz/)

## Common Issues

### Issue: OG images not showing in social media
- **Fix**: Ensure `PUBLIC_SITE_URL` is set to production domain
- **Fix**: Clear social media cache (Facebook, Twitter debuggers)
- **Fix**: Verify image URL returns 200 status

### Issue: Sitemap shows localhost URLs
- **Fix**: Set `PUBLIC_SITE_URL` environment variable before build

### Issue: Canonical URLs are wrong
- **Fix**: Update `siteUrl` in `src/config/seo.ts`

### Issue: Missing meta tags on some pages
- **Fix**: Ensure all pages use `BaseLayout` component
- **Fix**: Pass required props: `title`, `description`, `image`

## Next Steps (Optional Enhancements)

1. **Semantic Slugs**: Implement readable URLs like `/blog/my-article`
2. **RSS Feed**: Add `/rss.xml` for blog subscribers
3. **Breadcrumbs**: Add breadcrumb structured data
4. **FAQ Schema**: Add FAQ schema if relevant
5. **Analytics**: Integrate Google Analytics or Plausible
6. **Search**: Add internal site search functionality
