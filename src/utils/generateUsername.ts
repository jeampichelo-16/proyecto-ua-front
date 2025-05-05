export function generateUsername(firstName: string, lastName: string): string {
  if (!firstName || !lastName) return ''

  const clean = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar tildes
      .replace(/[^a-z0-9]/g, '') // quitar caracteres especiales

  const first = clean(firstName.split(' ')[0]) // primer nombre
  const last = clean(lastName.split(' ')[0]) // primer apellido
  const random = Math.floor(Math.random() * 900 + 100) // número entre 100–999

  return `${first}.${last}${random}`
}
