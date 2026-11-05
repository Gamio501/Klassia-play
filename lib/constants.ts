import type { QuestionType, QuizAccent } from "@/types/klassia";

/**
 * IDENTIDAD KLASSIA (fuente de verdad del prompt).
 * El layout y la estructura vienen del Figma; el color, la tipografía y el
 * tono visual vienen de aquí. No reemplazar por los hex del Figma.
 */
export const KLASSIA = {
  primary: "#1769FF",
  primaryDark: "#0F55D6",
  primarySoft: "#EEF4FF",
  accent: "#C9F04A",
  accentInk: "#07152C",
  success: "#10B981",
  successSoft: "#ECFDF5",
  danger: "#EF4444",
  dangerSoft: "#FEF2F2",
  warning: "#F59E0B",
  warningSoft: "#FFFBEB",
  app: "#F8FAFC",
  surface: "#FFFFFF",
  ink: "#0F172A",
  muted: "#64748B",
  line: "#E2E8F0",
} as const;

/** Colores + formas de las 4 opciones (accesible para daltonismo). */
export const OPTION_ACCENTS = [
  { color: "#1769FF", soft: "#EEF4FF", shape: "triangle" as const },
  { color: "#EF4444", soft: "#FEF2F2", shape: "diamond" as const },
  { color: "#F59E0B", soft: "#FFFBEB", shape: "circle" as const },
  { color: "#10B981", soft: "#ECFDF5", shape: "square" as const },
];

export const OPTION_SLOTS = ["A", "B", "C", "D"];

export const QUESTION_TYPES: {
  value: QuestionType;
  label: string;
  needsOptions: boolean;
}[] = [
  { value: "multiple", label: "Opción múltiple", needsOptions: true },
  { value: "truefalse", label: "Verdadero / Falso", needsOptions: true },
  { value: "open", label: "Respuesta abierta", needsOptions: false },
];

export const TIME_OPTIONS = [10, 20, 30, 45, 60, 90, 120];

export const POINTS_OPTIONS = [500, 750, 1000, 1500, 2000];

export const PLAYER_COLORS = [
  "#1769FF",
  "#F97316",
  "#10B981",
  "#0EA5E9",
  "#A855F7",
  "#EF4444",
  "#14B8A6",
  "#EC4899",
  "#8B5CF6",
  "#22C55E",
];

/** Fondo de las portadas de los quizzes (sin degradados decorativos). */
export const ACCENT_STYLES: Record<
  QuizAccent,
  { bg: string; soft: string; text: string; label: string }
> = {
  brand: { bg: "#1769FF", soft: "#EEF4FF", text: "#0F55D6", label: "Azul" },
  success: {
    bg: "#10B981",
    soft: "#ECFDF5",
    text: "#047857",
    label: "Esmeralda",
  },
  danger: { bg: "#EF4444", soft: "#FEF2F2", text: "#B91C1C", label: "Coral" },
  warning: { bg: "#F59E0B", soft: "#FFFBEB", text: "#B45309", label: "Ámbar" },
};
