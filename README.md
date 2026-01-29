# Miguel Fuertes - Personal Website

Repositorio del portfolio personal y profesional de Miguel Fuertes.

## 🌐 Ver Online

- **Producción**: [mfuertes.net](https://mfuertes.net)
- **GitHub Pages**: [hkfuertes.github.io](https://hkfuertes.github.io)

## 📦 Contenido del Repositorio

Este monorepo contiene:

- **`portfolio/`** - Portfolio web (Astro + TailwindCSS)
- **`blog/`** - Contenido del blog (Markdown + Gists YAML)
- **`Miguel_Fuertes_CV.yaml`** - CV en formato YAML (RenderCV compatible)

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Desarrollo
./dev.sh dev

# Build
./dev.sh build

# Ver logs
./dev.sh logs

# Detener
./dev.sh down
```

### Opción 2: Local

```bash
cd portfolio
npm install
npm run dev
```

## 📝 Estructura del Sitio

```
https://mfuertes.net/
├── /                   # Landing page (tarjeta de visita)
├── /projects           # Proyectos y experiencia profesional
├── /blog               # Blog posts y gists
└── /blog/[id]          # Post individual
```

## ✍️ Añadir Contenido

### Blog Posts

**Opción 1: Markdown local**
1. Crea un archivo `.md` en `/blog/`
2. El post aparecerá automáticamente

**Opción 2: GitHub Gists**
1. Crea un gist público en GitHub
2. Añade la URL a `/blog/gists.yaml`:
   ```yaml
   gists:
     - https://gist.github.com/hkfuertes/[tu-gist-id]
   ```

### Proyectos y Experiencia

Edita `/Miguel_Fuertes_CV.yaml` - Los cambios se reflejan automáticamente en `/projects`

## 🚢 Deploy

El sitio se despliega automáticamente a GitHub Pages mediante GitHub Actions cuando haces push a `main`.

### Deploy Manual

1. Ve a Actions en GitHub
2. Selecciona "Deploy to GitHub Pages"
3. Click en "Run workflow"

## 🛠️ Stack Tecnológico

- **Framework**: Astro 5.x
- **Estilos**: TailwindCSS 4.x
- **Deploy**: GitHub Pages
- **CI/CD**: GitHub Actions
- **CMS**: GitHub Gists + Markdown

## 📄 Documentación

Para más detalles sobre el portfolio, ver [`portfolio/README.md`](portfolio/README.md)

## 📜 Licencia

MIT
