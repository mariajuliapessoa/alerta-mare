export function normalizeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")          // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");    // substitui espaços por underscores
}
