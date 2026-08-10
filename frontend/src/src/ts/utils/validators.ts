/** Regex simple, suficiente para validar el formato de un correo en el cliente. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidRoleName(name: string): boolean {
  return name.trim().length >= 3 && name.trim().length <= 20;
}
