# Portfolio TODO List

## Pending Features

### 1. **Mostrar Contribuciones (PRs Merged)**
**Fecha**: 2026-01-30
**Descripción**: Añadir sección para mostrar contribuciones a proyectos de terceros (Pull Requests merged)

**Opciones de implementación**:
- **GitHub GraphQL API**: Consultar PRs merged del usuario
  - Endpoint: `https://api.github.com/graphql`
  - Query: `search(query: "is:pr author:hkfuertes is:merged", type: ISSUE)`
  - Datos: repo, título, fecha, URL, estado merged

- **GitHub REST API**: 
  - `GET /search/issues?q=author:hkfuertes+type:pr+is:merged`
  - Filtrar por repositorios externos (no propios)

**Posible estructura**:
```typescript
interface Contribution {
  repo: string;           // ej: "torvalds/linux"
  title: string;          // Título del PR
  url: string;            // URL del PR
  mergedAt: Date;         // Fecha de merge
  additions: number;      // Líneas añadidas
  deletions: number;      // Líneas eliminadas
}
```

**Diseño**:
- Nueva colección: `contributions`
- Loader: `contribution-loader.ts`
- Mostrar en `/blog` con badge "CONTRIBUTION"
- O nueva página `/contributions`

**Referencias**:
- GitHub GraphQL Explorer: https://docs.github.com/en/graphql/overview/explorer
- Search PRs API: https://docs.github.com/en/rest/search#search-issues-and-pull-requests

---

### 2. **Mostrar Estrellas y Forks en Tarjetas**
**Fecha**: 2026-01-30
**Descripción**: Añadir indicadores visuales de estrellas ⭐ y forks 🍴 en las tarjetas de proyectos y gists

**Datos disponibles**:
- Ya se cargan en los loaders:
  - `item.data.stars` - Número de estrellas
  - `item.data.forks` - Número de forks
- Disponibles para:
  - ✅ GitHub repos (desde `github-repos-loader.ts`)
  - ✅ Gists (desde GitHub API)

**Posible diseño**:
```
┌─────────────────────────────────────────┐
│ msm8916-openwrt                          │
│ OpenWRT for MSM8916 based devices...    │
│ Jan 2026 • PROJECT • ⭐ 12 • 🍴 3       │ ← Añadir aquí
└─────────────────────────────────────────┘
```

**Ubicación en código**:
- Archivo: `portfolio/src/pages/blog.astro`
- Línea ~151-156 (metadata footer)
- Añadir después del badge de tipo

**Notas**:
- Usar iconos o símbolos simples (⭐/🍴 o números solo)
- Mantener estilo minimalista Swiss Design
- Mostrar solo si > 0 para no saturar
- Color gris para no competir con el azul del hover

---

### 3. **Mejorar Pipeline de Development, Build y CV/PDF**
**Fecha**: 2026-01-30
**Descripción**: Optimizar y documentar el flujo de desarrollo, build y generación del CV

#### Estado Actual

**Archivos de pipeline**:
- ✅ `Makefile` - Comandos para CV (new, render)
- ✅ `docker-compose.yml` - Servicios: rendercv, build, app
- ✅ `dev.sh` - Script rápido para dev/build/logs
- ✅ `.github/workflows/deploy.yml` - CI/CD a GitHub Pages

**Servicios Docker**:
1. **rendercv**: Genera PDF del CV desde YAML
2. **build**: Build del portfolio Astro
3. **app**: Dev server (puerto 4321)

**GitHub Actions**:
- Trigger: push a main/master
- Build portfolio con Node 20
- Deploy a GitHub Pages
- ❌ NO genera CV/PDF en CI

#### Mejoras Propuestas

**1. Pipeline de CV/PDF**:
```yaml
# Añadir step en .github/workflows/deploy.yml
- name: Generate CV PDF
  run: |
    pip install rendercv
    rendercv render Miguel_Fuertes_CV.yaml
    cp rendercv_output/Miguel_Fuertes_CV.pdf portfolio/public/
```
- Generar PDF automáticamente en CI
- Publicar PDF en `/cv.pdf` del portfolio
- Versionar PDFs con fecha/commit

**2. Unificar comandos**:
```makefile
# Añadir al Makefile
.PHONY: dev build cv all

dev:
	@./dev.sh dev

build-portfolio:
	@./dev.sh build

build-cv:
	@$(MAKE) render

all: build-cv build-portfolio
	@echo "✅ CV y Portfolio generados"
```

**3. Script de deployment local**:
```bash
#!/bin/bash
# deploy.sh - Test build completo antes de push
make build-cv
./dev.sh build
echo "✅ Build completo OK - Ready to push"
```

**4. Environment variables**:
- ✅ `GITHUB_TOKEN` ya configurado en docker-compose
- ❌ Falta en GitHub Actions secrets
- Añadir: `GITHUB_TOKEN` en repo secrets para loaders

**5. Caché y optimización**:
```yaml
# En GitHub Actions
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      portfolio/node_modules
      portfolio/.astro
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

**6. Validación pre-build**:
```bash
# pre-build.sh
echo "🔍 Validando CV YAML..."
rendercv render Miguel_Fuertes_CV.yaml --validate-only

echo "🔍 Verificando gists.yaml..."
test -f blog/gists.yaml || echo "⚠️  gists.yaml no encontrado"

echo "🔍 Chequeando GITHUB_TOKEN..."
test -n "$GITHUB_TOKEN" || echo "⚠️  GITHUB_TOKEN no configurado"
```

#### Archivos a Modificar

1. **`.github/workflows/deploy.yml`**:
   - Añadir step de generación de CV
   - Añadir caché de node_modules
   - Añadir GITHUB_TOKEN secret
   - Añadir validaciones pre-build

2. **`Makefile`**:
   - Añadir target `all` (cv + portfolio)
   - Añadir target `deploy-test`
   - Simplificar comandos comunes

3. **`dev.sh`**:
   - Añadir comando `cv` (genera PDF)
   - Añadir comando `test` (valida build)
   - Añadir comando `deploy` (build completo)

4. **Nuevo `scripts/pre-build.sh`**:
   - Validaciones antes del build
   - Check de env vars
   - Verificación de archivos requeridos

#### Referencias
- RenderCV Docs: https://docs.rendercv.com/
- Astro Build: https://docs.astro.build/en/guides/deploy/
- GitHub Actions Cache: https://github.com/actions/cache

---

## Completed
- ✅ Grid de 3 columnas para timeline
- ✅ Gists automáticos desde YAML
- ✅ GitHub repos automáticos (25 repos públicos)
- ✅ Eliminados duplicados (CV YAML)
- ✅ Descripción de gist como título, filename como subtítulo
- ✅ Line-clamp en título (1 línea) y descripción (1 línea)
- ✅ Ordenación por fecha de creación (no última actualización)
- ✅ Solo gists + repos públicos (sin otros types)
- ✅ Archivo `projects.yml` con listado de URLs
