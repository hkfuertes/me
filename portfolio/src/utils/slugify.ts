/**
 * Convierte un string en un slug SEO-friendly
 * Ejemplo: "My Cool Project!" → "my-cool-project"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres especiales
    .replace(/\s+/g, '-') // Espacios → guiones
    .replace(/-+/g, '-') // Múltiples guiones → uno solo
    .replace(/^-+|-+$/g, '') // Elimina guiones al inicio/final
}

/**
 * Genera un slug único basado en título y fecha
 * Para evitar colisiones si hay títulos iguales en años diferentes
 */
export function generateSlug(title: string, date: Date): string {
  const baseSlug = slugify(title)
  const year = date.getFullYear()
  
  // Si el slug es muy corto, añade el año para hacerlo más descriptivo
  if (baseSlug.length < 10) {
    return `${year}-${baseSlug}`
  }
  
  return baseSlug
}

/**
 * Extrae el slug del ID actual de GitHub repos
 * Ejemplo: "hkfuertes-my-project" → "my-project"
 */
export function extractSlugFromGithubId(id: string): string {
  // Los IDs de GitHub repos son "username-reponame"
  const parts = id.split('-')
  if (parts.length > 1 && parts[0] === 'hkfuertes') {
    return parts.slice(1).join('-')
  }
  return id
}
