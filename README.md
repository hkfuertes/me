# Miguel Fuertes - Portfolio

Personal portfolio and professional website built with Astro, featuring automated CV generation and GitHub integration.

## Live Site

- **Production**: [mfuertes.net](https://mfuertes.net)
- **GitHub Pages**: [hkfuertes.github.io](https://hkfuertes.github.io)

## Repository Structure

This monorepo contains:

- **`portfolio/`** - Portfolio website (Astro + TailwindCSS)
  - **`src/data/`** - Content configuration (gists.yaml, projects.yaml)
- **`Miguel_Fuertes_CV.yaml`** - CV in YAML format (RenderCV compatible)

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: TailwindCSS 4.x
- **CV Generation**: RenderCV (Python)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Linting**: ESLint with Astro plugin
- **Content**: GitHub Gists + Markdown

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

## Deployment

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

### Projects

Add GitHub repository URLs to `portfolio/src/data/projects.yaml`:
```yaml
projects:
  - https://github.com/username/repo-name
```

Projects will automatically:
- Fetch repository metadata (stars, forks, description)
- Load README if available
- Display in timeline with proper formatting

### CV Updates

Edit `Miguel_Fuertes_CV.yaml` - Changes reflect automatically in the generated PDF.

## Environment Variables

### Local Development

```bash
# Optional: For GitHub API loaders
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

Add to `.env` or `docker-compose.yml`:
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### GitHub Actions

- `GITHUB_TOKEN`: Auto-provided by GitHub Actions
- No manual configuration required

## File Structure

```
.
├── .github/
│   └── workflows/
│       ├── deploy.yml              # CI/CD pipeline
│       └── lint.yml                # PR lint check
├── scripts/
│   ├── pre-build.sh                # Pre-build validation
│   └── dev.sh                      # Development script
├── portfolio/
│   ├── src/
│   │   ├── data/
│   │   │   ├── gists.yaml          # Configured gists
│   │   │   └── projects.yaml       # GitHub projects
│   │   ├── content.config.ts       # Content configuration
│   │   ├── pages/                  # Astro pages
│   │   └── utils/                  # GitHub loaders
│   ├── public/
│   │   └── cv.pdf                  # Generated CV (auto)
│   ├── eslint.config.js            # ESLint config
│   └── package.json
├── Miguel_Fuertes_CV.yaml          # CV source
├── Makefile                        # Make commands
└── docker-compose.yml              # Docker services
```

## Troubleshooting

### CV Generation Fails

```bash
# Verify YAML syntax
make render

# View detailed errors
docker compose run --rm rendercv render Miguel_Fuertes_CV.yaml
```

### GitHub Loaders Fail

```bash
# Check token
echo $GITHUB_TOKEN

# Set token
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### Build Fails

```bash
# Run validation
./scripts/pre-build.sh

# View detailed logs
docker compose run --rm build
```

### Lint Fails

```bash
# Run lint locally
make lint

# Auto-fix issues
docker compose run --rm app npm run lint:fix
```

### Hot Reload Not Working

```bash
# Restart server
./scripts/dev.sh down
./scripts/dev.sh dev
```

## Performance

**Build times (approximate):**
- First build: ~2-3 min (with cache: ~1 min)
- Subsequent builds: ~30-60s
- Hot reload: <1s

**Optimizations:**
- npm dependencies cache
- Astro build cache
- Early validation (fail fast)
- Parallelization where possible

## License

MIT
