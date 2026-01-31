# Maintenance Guide

## Repository Structure

This monorepo contains:

- **`portfolio/`** - Portfolio website (Astro + TailwindCSS)
- **`Miguel_Fuertes_CV.yaml`** - CV in YAML format (RenderCV compatible)
- **`scripts/`** - Development helper scripts

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: TailwindCSS 4.x
- **CV Generation**: RenderCV (Python)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Linting**: ESLint with Astro plugin
- **Content**: GitHub Gists + GitHub API

## Quick Start

### Development (Docker - Recommended)

```bash
# Start dev server (http://localhost:4321)
./scripts/dev.sh dev

# Build site
./scripts/dev.sh build

# Generate CV PDF
./scripts/dev.sh cv

# Run linter
./scripts/dev.sh lint

# Test build (validation + build)
./scripts/dev.sh test

# Build everything (CV + Portfolio)
./scripts/dev.sh all

# Stop services
./scripts/dev.sh down

# View logs
./scripts/dev.sh logs

# Clean containers
./scripts/dev.sh clean
```

### Development (Local)

```bash
cd portfolio
npm install
npm run dev
```

### Make Commands

```bash
# CV
make cv                    # Generate CV PDF and copy to public/
make render                # Generate CV PDF only

# Portfolio
make dev                   # Start dev server
make build                 # Build portfolio
make lint                  # Run ESLint

# Combined
make all                   # Build CV + Portfolio
make test                  # Validate and build

# Docker
make up                    # Start app
make down                  # Stop app
```

## Environment Configuration

### Required Variables

Create `.env` file in project root:

```bash
# GitHub API Token (Required)
# Generate at: https://github.com/settings/tokens
# Required scopes: public_repo, gist
GITHUB_TOKEN=your_github_token_here

# Site URL (Required for SEO)
# Production: https://mfuertes.net
# Development: http://localhost:4321
PUBLIC_SITE_URL=http://localhost:4321
```

## Deployment

### GitHub Pages Configuration

**Custom Domain Setup (mfuertes.net)**

1. Configure in GitHub Settings:
   - Repository → Settings → Pages
   - Custom domain: `mfuertes.net`
   - Enforce HTTPS: enabled

2. Configure DNS (at domain provider):
   ```
   A Record:    @ → 185.199.108.153
   A Record:    @ → 185.199.109.153
   A Record:    @ → 185.199.110.153
   A Record:    @ → 185.199.111.153
   CNAME Record: www → hkfuertes.github.io
   ```

3. Configure environment variables:
   ```bash
   # .env
   PUBLIC_SITE_URL=https://mfuertes.net
   ```

**For standard GitHub Pages setup, see GITHUB_PAGES_SETUP.md**

### Automatic Deployment

The site automatically deploys to GitHub Pages via GitHub Actions on:
- Push to `main` or `master` branch
- Manual trigger via GitHub Actions UI

### Manual Deployment

1. Go to GitHub Actions
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Pipeline Overview

### GitHub Actions Workflow

**Triggers:**
- Push to main/master
- Manual via workflow_dispatch

**Steps:**
1. Pre-build validation
2. CV PDF generation with RenderCV
3. Astro build with GITHUB_TOKEN
4. Deploy to GitHub Pages

**Optimizations:**
- npm cache (node_modules)
- Astro build cache (.astro)
- GITHUB_TOKEN for API loaders

### Pre-build Validation

Validates before building:
- CV YAML syntax
- gists.yaml existence and syntax
- GITHUB_TOKEN presence (warning if missing)
- package.json, node_modules, configs

### Lint Check (PR Only)

ESLint runs automatically on Pull Requests:
- Checks all Astro files
- Must pass before merge
- Can run locally: `make lint`

## Adding Content

### Blog Posts

**Option 1: GitHub Gists**
1. Create a public gist on GitHub
2. Add URL to `portfolio/src/data/gists.yaml`:
   ```yaml
   gists:
     - https://gist.github.com/hkfuertes/[gist-id]
   ```

**Option 2: GitHub Repository with README**
Automatically loaded via GitHub API if `showReadme: true` in frontmatter.

### Projects

Projects are loaded automatically from your GitHub repositories via the GitHub API.

To feature a project:
1. Ensure repository is public
2. Add good README.md
3. Add topics/tags
4. System will auto-detect and display

### CV Updates

1. Edit `Miguel_Fuertes_CV.yaml`
2. Run `make cv` to regenerate PDF
3. PDF auto-copies to `portfolio/public/cv.pdf`
4. Commit changes

## Project Structure

```
portfolio/
├── src/
│   ├── content/
│   │   ├── config.ts           # Content collections schema
│   │   ├── gists/              # Auto-loaded from GitHub Gists
│   │   ├── githubRepos/        # Auto-loaded from GitHub API
│   │   └── contributions/      # Auto-loaded from GitHub API
│   ├── data/
│   │   ├── gists.yaml          # List of gist URLs to load
│   │   └── seo.ts              # SEO configuration
│   ├── layouts/
│   │   └── BaseLayout.astro    # Main layout with SEO
│   ├── pages/
│   │   ├── index.astro         # Landing page
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing
│   │   │   └── [id].astro      # Blog post detail
│   │   ├── og/
│   │   │   └── [id].png.ts     # Dynamic OG images
│   │   ├── og-home.png.ts      # Home OG image
│   │   ├── sitemap.xml.astro   # XML sitemap
│   │   └── robots.txt.astro    # Robots.txt
│   ├── components/
│   ├── styles/
│   │   └── global.css          # Global styles + Tailwind
│   └── utils/
│       ├── api/                # GitHub API loaders
│       ├── slugify.ts          # URL slug generation
│       └── add-heading-ids.ts  # Markdown heading parser
├── public/
│   ├── images/
│   │   └── profile.jpeg        # Profile photo
│   ├── favicon.svg             # Favicon (vector)
│   ├── favicon*.png            # Favicon (raster sizes)
│   ├── manifest.json           # PWA manifest
│   └── CNAME                   # GitHub Pages custom domain
└── astro.config.mjs            # Astro configuration
```

## Key Features

### SEO Optimization

- **Canonical URLs**: Proper canonical tags on all pages
- **OG Images**: Dynamic generation for blog posts
- **Structured Data**: JSON-LD for articles and projects
- **Sitemap**: Auto-generated XML sitemap
- **Meta Tags**: Comprehensive Open Graph and Twitter Card tags

### URL Structure

- **SEO-Friendly Slugs**: `virtual-screen` instead of hash IDs
- **Clean URLs**: No `/me` prefix with custom domain
- **Canonical URLs**: Always points to mfuertes.net

### Content Loading

- **Gists**: Auto-loads from GitHub Gists API
- **Projects**: Auto-loads from GitHub Repositories API
- **Contributions**: Auto-loads PRs from GitHub API
- **Caching**: Minimal API calls during development

## Troubleshooting

### Build Fails

**Missing GITHUB_TOKEN:**
```bash
# Set in .env
GITHUB_TOKEN=your_token_here
```

**Invalid YAML:**
```bash
# Validate CV
python -c "import yaml; yaml.safe_load(open('Miguel_Fuertes_CV.yaml'))"

# Validate gists
python -c "import yaml; yaml.safe_load(open('portfolio/src/data/gists.yaml'))"
```

### Content Not Loading

**Gists not appearing:**
- Verify gist is public
- Verify URL in `gists.yaml` is correct
- Check GITHUB_TOKEN has `gist` scope

**Projects not appearing:**
- Verify repository is public
- Check GITHUB_TOKEN has `public_repo` scope
- Verify README.md exists

### GitHub API Rate Limits in GitHub Actions

**Symptoms:**
```
[WARN] [gist-loader] Failed to fetch gist: 403
[WARN] [github-projects-loader] Failed to fetch repo: 404
```

**Cause:**
GitHub Actions `GITHUB_TOKEN` has rate limits (1,000 requests/hour per repository).

**Solutions:**

1. **Verify token permissions in repository settings:**
   - Go to: Settings → Actions → General → Workflow permissions
   - Select: "Read and write permissions"
   - Enable: "Allow GitHub Actions to create and approve pull requests"

2. **Add metadata permission to workflow:**
   Already configured in `.github/workflows/deploy_github.yml`:
   ```yaml
   permissions:
     contents: read
     metadata: read  # Required for API loaders
   ```

3. **Use Personal Access Token (if needed):**
   - Create PAT with `public_repo` and `gist` scopes
   - Add as repository secret: `GH_PERSONAL_TOKEN`
   - Update workflow to use it:
     ```yaml
     env:
       GITHUB_TOKEN: ${{ secrets.GH_PERSONAL_TOKEN }}
     ```

4. **Reduce API calls:**
   - Remove unused gists from `gists.yaml`
   - Remove unused projects from `projects.yaml`
   - Content will gracefully fallback if API fails

**Rate Limit Info:**
- Without token: 60 requests/hour
- With GITHUB_TOKEN: 1,000 requests/hour per repo
- With Personal Access Token: 5,000 requests/hour

### Styling Issues

**Tailwind classes not working:**
```bash
# Rebuild with clean cache
rm -rf .astro node_modules/.vite
npm install
npm run build
```

**CSS not loading on GitHub Pages:**
- Verify `site` URL in `astro.config.mjs`
- Verify CNAME file exists in public/
- Check GitHub Pages custom domain settings

## Performance

### Build Time

- **Average**: ~10-15 seconds
- **First build**: ~30 seconds (no cache)
- **With cache**: ~8-10 seconds

### Optimization Tips

1. Use Astro cache between builds
2. Minimize API calls (gists cached)
3. Optimize images before adding to public/
4. Use SVG for icons when possible

## License

See LICENSE file for details.
