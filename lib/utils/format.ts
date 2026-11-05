/** IDs cortos y estables para entidades creadas en el cliente. */
export function uid(prefix = "id"): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}

/** PIN de 6 dígitos, formateado como "384 216". */
export function formatPin(pin: string): string {
  return `${pin.slice(0, 3)} ${pin.slice(3)}`;
}

/** "85" -> "85%" */
export function pct(value: number): string {
  return `${Math.round(value)}%`;
}

/** 3720 -> "3.720 pts" (formato es-CO). */
export function points(value: number): string {
  return `${value.toLocaleString("es-CO")} pts`;
}

/** Iniciales de un nombre: "Mateo R." -> "MR", "Valentina" -> "VA". */
export function initials(name: string): string {
  const parts = name
    .replace(/\./g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
  });
}
