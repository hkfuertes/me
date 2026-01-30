# Pipeline Documentation

## Overview

El pipeline del portfolio está optimizado para desarrollo local y deployment automático a GitHub Pages.

## Componentes

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push a `main` o `master`
- Manual via `workflow_dispatch`

**Steps:**
1. ✅ **Validación** - Verifica configuración antes del build
2. 📄 **Generación de CV** - Genera PDF con RenderCV
3. 📦 **Build Astro** - Construye sitio estático con GITHUB_TOKEN
4. 🚀 **Deploy** - Despliega a GitHub Pages

**Optimizaciones:**
- ⚡ Caché de npm (`node_modules`)
- ⚡ Caché de Astro (`.astro`)
- 🔑 GITHUB_TOKEN configurado para loaders

### 2. Makefile

**Comandos CV:**
```bash
make new NAME="Your Name"  # Crear nuevo CV
make render                 # Generar PDF del CV
make build-cv              # Generar CV y copiar a public/
```

**Comandos Portfolio:**
```bash
make dev                   # Servidor de desarrollo
make build-portfolio       # Build del portfolio
```

**Comandos Combinados:**
```bash
make all                   # Build completo (CV + Portfolio)
make deploy-test           # Test build antes de push
```

**Comandos Docker:**
```bash
make up                    # Iniciar app
make down                  # Detener app
```

### 3. dev.sh Script

**Comandos disponibles:**
```bash
./dev.sh dev      # Servidor de desarrollo (live reload)
./dev.sh build    # Build del sitio estático
./dev.sh cv       # Generar CV PDF
./dev.sh test     # Validar y construir (pre-deploy)
./dev.sh deploy   # Build completo (CV + Portfolio)
./dev.sh down     # Detener servicios
./dev.sh logs     # Mostrar logs
./dev.sh clean    # Limpiar contenedores
```

### 4. Pre-build Validation (`scripts/pre-build.sh`)

**Validaciones:**
- ✅ CV YAML válido
- ✅ gists.yaml existe y es válido
- ⚠️  GITHUB_TOKEN configurado (warning si no está)
- ✅ package.json existe
- ✅ node_modules instalado
- ✅ astro.config.mjs existe
- ✅ content.config.ts existe

## Flujo de Trabajo

### Desarrollo Local

```bash
# 1. Iniciar desarrollo
./dev.sh dev

# 2. Hacer cambios en el código
# El servidor se recarga automáticamente

# 3. Generar CV actualizado (si cambió)
./dev.sh cv

# 4. Antes de hacer commit, probar build
./dev.sh test
```

### Deployment

```bash
# 1. Asegurar que todo funciona
./dev.sh test

# 2. Commit y push
git add .
git commit -m "Update portfolio"
git push origin main

# 3. GitHub Actions se encarga del resto:
#    - Valida configuración
#    - Genera CV PDF
#    - Build Astro con loaders
#    - Deploy a GitHub Pages
```

### Build Completo Local

```bash
# Opción 1: Con Makefile
make all

# Opción 2: Con dev.sh
./dev.sh deploy
```

## Environment Variables

### Local Development
```bash
# .env o docker-compose.yml
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### GitHub Actions
- `GITHUB_TOKEN`: Auto-proporcionado por GitHub Actions
- No requiere configuración manual

## Estructura de Archivos

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── scripts/
│   └── pre-build.sh            # Validación pre-build
├── portfolio/
│   ├── src/
│   │   ├── content.config.ts   # Configuración de contenido
│   │   ├── pages/              # Páginas Astro
│   │   └── utils/              # Loaders
│   ├── public/
│   │   └── cv.pdf              # CV generado (auto)
│   └── package.json
├── blog/
│   └── gists.yaml              # Gists configurados
├── Miguel_Fuertes_CV.yaml      # CV source
├── Makefile                    # Comandos make
├── dev.sh                      # Script de desarrollo
└── docker-compose.yml          # Servicios Docker
```

## Troubleshooting

### El CV no se genera
```bash
# Verificar YAML
make render

# Ver errores
docker compose run --rm rendercv render Miguel_Fuertes_CV.yaml
```

### Los loaders de GitHub fallan
```bash
# Verificar token
echo $GITHUB_TOKEN

# Configurar token
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### Build falla
```bash
# Ejecutar validación
./scripts/pre-build.sh

# Ver logs detallados
docker compose run --rm build
```

### Hot reload no funciona
```bash
# Reiniciar servidor
./dev.sh down
./dev.sh dev
```

## Performance

**Build times (aproximado):**
- 🚀 First build: ~2-3 min (con caché: ~1 min)
- ⚡ Subsequent builds: ~30-60s
- 🔄 Hot reload: <1s

**Optimizaciones aplicadas:**
- Caché de npm dependencies
- Caché de Astro build
- Validación temprana (fail fast)
- Paralelización donde es posible

## Referencias

- [Astro Documentation](https://docs.astro.build)
- [RenderCV Documentation](https://docs.rendercv.com)
- [GitHub Actions](https://docs.github.com/en/actions)
