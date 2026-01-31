# Portfolio Personal - Miguel Fuertes

Portfolio minimalista con diseño Swiss construido con Astro y desplegado en GitHub Pages.

## 🎨 Diseño

**Swiss Design / International Typographic Style**
- Grid preciso y tipografía clara
- Layout en columnas
- Mucho espacio negativo
- Bordes finos y elementos geométricos
- Jerarquía visual clara
- Color usado con moderación (azul como acento)

## 🚀 Características

- **Landing Minimalista**: Bio, contacto, y tech stack en grid de 3 columnas
- **Work Unificado**: Timeline cronológica mezclando experiencia, proyectos y posts
- **GitHub Gists como CMS**: Escribe en Gists, se importan automáticamente
- **100% Estático**: Build-time rendering, sin JavaScript del lado del cliente
- **SEO Optimizado**: Meta tags, sitemap, Open Graph

## 📁 Estructura

```
https://mfuertes.net/
├── /              # Landing page minimalista
├── /work          # Timeline unificado (todo mezclado)
├── /work/[id]     # Posts individuales
└── /Miguel_Fuertes_CV.pdf
```

## 🛠️ Stack Tecnológico

- **Framework**: [Astro 5.x](https://astro.build)
- **Estilos**: [TailwindCSS 4.x](https://tailwindcss.com)
- **CMS**: GitHub Gists + YAML
- **Deploy**: GitHub Pages + Actions

## 🚀 Comandos

```bash
# Desarrollo (Docker)
make up

# Desarrollo (local)
npm install
npm run dev

# Desarrollo limpiando caché (si cambias YAML)
npm run dev:clean

# Build
npm run build
```

## 📝 Gestión de Contenido

### Blog Posts (Gists)

Añadir URLs a `src/data/gists.yaml`:

```yaml
gists:
  - https://gist.github.com/hkfuertes/[gist-id]
```

### Proyectos GitHub

Añadir URLs a `src/data/projects.yaml`:

```yaml
# Proyectos que muestran el README completo
with_readme:
  - https://github.com/hkfuertes/proyecto-1

# Proyectos que solo muestran metadatos
without_readme:
  - https://github.com/hkfuertes/proyecto-2
```

### Contribuciones

Las contribuciones (PRs merged) se cargan automáticamente desde GitHub API.

### ⚠️ Importante: Caché de Content Loaders

Los loaders de Astro **cachean los datos** para mejorar el rendimiento. Si editas los archivos YAML:

**En desarrollo (Docker):**
```bash
docker compose down
docker compose up -d app
```

**En desarrollo (local):**
```bash
npm run dev:clean
# o manualmente:
rm -rf .astro && npm run dev
```

El simple `docker compose restart` **NO recarga los datos** porque el caché persiste en memoria.

## 🌐 Deploy

Push a `main` → Deploy automático a GitHub Pages

O manual:
1. Actions > Deploy to GitHub Pages
2. Run workflow

## 🎯 Filosofía de Diseño

Inspirado en el diseño suizo:
- **Claridad**: Jerarquía tipográfica obvia
- **Objetividad**: Sin elementos decorativos innecesarios
- **Funcionalidad**: Grid matemático y espaciado consistente
- **Universalidad**: Diseño atemporal y accesible

## 📄 Licencia

MIT

