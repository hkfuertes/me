# Portfolio - Miguel Fuertes

Minimalist portfolio with Swiss Design aesthetic built with Astro and deployed to GitHub Pages.

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: TailwindCSS 4.x
- **Content**: GitHub Gists + YAML configuration
- **Deployment**: GitHub Pages (automated via Actions)

## Site Structure

```
https://mfuertes.net/
├── /              Landing page
├── /blog          Timeline of blog posts, projects, and contributions
├── /blog/[id]     Individual post pages
└── /Miguel_Fuertes_CV.pdf
```

## Development

### Requirements

- Node.js 18+
- Docker (optional)
- GitHub Personal Access Token (for API rate limits)

### Setup

**With Docker:**
```bash
# Set GitHub token in .env
echo "GITHUB_TOKEN=your_token_here" > .env

# Start dev server
make up
# or
docker compose up -d app

# View logs
docker compose logs -f app
```

**Without Docker:**
```bash
# Install dependencies
npm install

# Set GitHub token
export GITHUB_TOKEN=your_token_here

# Start dev server
npm run dev
```

Access at `http://localhost:4321`

### Commands

```bash
npm run dev         # Start dev server
npm run dev:clean   # Start dev server with clean cache
npm run build       # Build for production
npm run preview     # Preview production build
```

## Content Management

### Blog Posts (Gists)

Edit `src/data/gists.yaml`:

```yaml
gists:
  - https://gist.github.com/hkfuertes/9dd10da4a6bd0cdac6706400184539f7
  - https://gist.github.com/hkfuertes/a37776f4e94de34cc3a4658b15ec1545
```

Each gist must contain a Markdown file. Gist metadata (title, date, stars) is fetched from GitHub API.

### GitHub Projects

Edit `src/data/projects.yaml`:

```yaml
# Projects that render full README
with_readme:
  - https://github.com/hkfuertes/virtual-screen
  - https://github.com/hkfuertes/hyprland

# Projects that only show metadata
without_readme:
  - https://github.com/hkfuertes/blueprints
  - https://github.com/hkfuertes/AAGW
```

Metadata (stars, forks, language, topics) is fetched from GitHub API.

### Contributions

Merged pull requests to third-party repositories are automatically loaded from GitHub API. No configuration needed.

### Important: Content Loader Cache

Astro caches content loader results. After editing YAML files, you must restart completely:

**With Docker:**
```bash
docker compose down
docker compose up -d app
```

**Without Docker:**
```bash
npm run dev:clean
# or manually:
rm -rf .astro && npm run dev
```

Note: `docker compose restart` does NOT reload data because cache persists in memory.

## Deployment

### Automatic

Push to `main` branch triggers automatic deployment to GitHub Pages via GitHub Actions.

### Manual

1. Go to Actions tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### Build Output

Static files are generated in `dist/` directory. GitHub Pages serves from `gh-pages` branch.

## Project Structure

```
portfolio/
├── src/
│   ├── components/      Component library
│   ├── content.config.ts    Content collections config
│   ├── data/
│   │   ├── gists.yaml       Gist URLs
│   │   └── projects.yaml    GitHub project URLs
│   ├── layouts/         Page layouts
│   ├── pages/           Route pages
│   │   ├── index.astro      Landing page
│   │   ├── blog.astro       Blog timeline
│   │   └── blog/[id].astro  Post detail page
│   ├── styles/          Global styles
│   └── utils/
│       ├── gist-loader.ts              Loads gists from GitHub API
│       ├── github-projects-loader.ts   Loads projects from GitHub API
│       └── github-contributions-loader.ts  Loads PRs from GitHub API
├── public/              Static assets
├── astro.config.mjs     Astro configuration
├── tailwind.config.cjs  Tailwind configuration
└── package.json         Dependencies
```

## Environment Variables

Create `.env` file:

```bash
GITHUB_TOKEN=ghp_your_personal_access_token
```

Required for:
- Increased API rate limits (60 req/hour without, 5000 req/hour with token)
- Access to private gists (if needed)

Generate token at: https://github.com/settings/tokens

Required scopes: `public_repo`, `gist`

## Troubleshooting

### Content not updating after YAML changes

Run full restart:
```bash
docker compose down && docker compose up -d app
# or
npm run dev:clean
```

### GitHub API rate limit errors

Add `GITHUB_TOKEN` to `.env` file

### Build fails with module errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json .astro
npm install
npm run build
```

## Design Philosophy

Swiss Design / International Typographic Style:
- Clear typographic hierarchy
- Mathematical grid system
- Minimal decorative elements
- Functional and timeless

## License

MIT
