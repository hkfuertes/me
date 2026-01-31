# GitHub Pages Setup Guide

## Standard GitHub Pages Setup (username.github.io/repo-name)

### 1. Fork or Clone Repository

```bash
# Option A: Fork via GitHub UI
# Visit https://github.com/hkfuertes/me and click "Fork"

# Option B: Create from scratch
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
cd REPO-NAME
```

### 2. Update Configuration

#### 2.1 Environment Variables

Create `.env` file in project root:

```bash
# .env
GITHUB_TOKEN=ghp_YourTokenHere
PUBLIC_SITE_URL=https://YOUR-USERNAME.github.io/REPO-NAME
```

**Generate GITHUB_TOKEN:**
1. Visit https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `gist`
4. Copy generated token

#### 2.2 Update astro.config.mjs

If repository name is not `me`, edit `portfolio/astro.config.mjs`:

```js
// Change site URL
export default defineConfig({
  site: 'https://YOUR-USERNAME.github.io',
  base: '/REPO-NAME',
  // ...
});
```

### 3. Configure GitHub Pages

1. Repository Settings → Pages
2. Source: GitHub Actions
3. Branch: leave as default
4. Save

### 4. Configure GitHub Actions Secrets

1. Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GITHUB_TOKEN`
4. Value: Your GitHub token
5. Add secret

### 5. Deploy

#### Option A: Automatic Push

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

Workflow executes automatically.

#### Option B: Manual Trigger

1. Go to Actions tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"
4. Wait approximately 2 minutes

### 6. Verify Deployment

Visit: `https://YOUR-USERNAME.github.io/REPO-NAME`

## Troubleshooting

### CSS not loading (404 on /_astro/* files)

**Problem:** Base path not configured correctly

**Solution:**
1. Verify `PUBLIC_SITE_URL` includes repo name:
   ```
   PUBLIC_SITE_URL=https://username.github.io/REPO-NAME
   ```

2. Verify `astro.config.mjs` has correct base:
   ```js
   export default defineConfig({
     site: 'https://username.github.io',
     base: '/REPO-NAME',
   });
   ```

3. Rebuild and redeploy

### Images not loading

**Problem:** Incorrect absolute paths

**Solution:**
Use relative paths or `import.meta.env.BASE_URL`:
```astro
<img src={import.meta.env.BASE_URL + '/images/profile.jpg'} />
```

### Internal links broken

**Problem:** Links missing base path

**Solution:**
Use Astro components or manually include base:
```astro
<a href={import.meta.env.BASE_URL + '/blog'}>Blog</a>
```

### 404 Page Not Found

**Problem:** GitHub Pages cannot find site

**Solution:**
1. Verify GitHub Pages configured as "GitHub Actions"
2. Verify workflow completed successfully
3. Wait 2-3 minutes for GitHub Pages update

### Build fails in GitHub Actions

**Problem:** Missing GITHUB_TOKEN or build error

**Solution:**
1. Verify `GITHUB_TOKEN` in Secrets
2. Check workflow logs in Actions tab
3. Test build locally: `npm run build`

## Custom Domain vs GitHub Pages Comparison

| Aspect | Custom Domain | GitHub Pages Standard |
|--------|---------------|----------------------|
| URL | `mfuertes.net` | `username.github.io/repo` |
| Configuration | CNAME + DNS | GitHub Settings only |
| Base Path | Not required | `/repo` required |
| SEO | Better | Good |
| Cost | Domain fee | Free |
| Setup | More complex | Simpler |

## Complete Example

User: `johnsmith`, Repository: `portfolio`

**1. .env:**
```bash
GITHUB_TOKEN=ghp_abc123...
PUBLIC_SITE_URL=https://johnsmith.github.io/portfolio
```

**2. astro.config.mjs:**
```js
export default defineConfig({
  site: 'https://johnsmith.github.io',
  base: '/portfolio',
});
```

**3. GitHub Pages:**
- Source: GitHub Actions
- Result URL: `https://johnsmith.github.io/portfolio`

**4. Verification:**
- Home: `https://johnsmith.github.io/portfolio/`
- Blog: `https://johnsmith.github.io/portfolio/blog/`
- CSS: `https://johnsmith.github.io/portfolio/_astro/...`

## Migrate to Custom Domain Later

To use custom domain later:

1. Purchase domain
2. Configure DNS (see main README.md)
3. Update `PUBLIC_SITE_URL=https://yourdomain.com`
4. Create `portfolio/public/CNAME` with your domain
5. Update GitHub Pages Settings with domain
6. Remove `base` from astro.config.mjs
7. Redeploy

Site will automatically stop using `/portfolio` prefix in URLs.
