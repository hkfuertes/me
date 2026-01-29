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

# Build
npm run build
```

## 📝 Gestión de Contenido

### Blog Posts

Añadir URLs a `/blog/gists.yaml`:

```yaml
gists:
  - https://gist.github.com/hkfuertes/[gist-id]
```

### Proyectos y Experiencia

Editar `/Miguel_Fuertes_CV.yaml` - Se mezcla automáticamente en `/work`

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

