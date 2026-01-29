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
