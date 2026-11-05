/**
 * Klassia Play — contratos de datos compartidos entre frontend y backend.
 * Cuando se conecte el backend real, estos tipos deben seguir siendo la
 * fuente de verdad del contrato de la API.
 */

export type QuestionType = "multiple" | "truefalse" | "open";

export type QuizAccent = "brand" | "success" | "danger" | "warning";

export interface AnswerOption {
  id: string;
  text: string;
  /** Solo una opción puede ser correcta en "multiple" y "truefalse". */
  correct: boolean;
}

export interface Question {
  id: string;
  statement: string;
  type: QuestionType;
  options: AnswerOption[];
  /** Segundos que dura la pregunta en vivo. */
  timeLimit: number;
  points: number;
  mediaUrl?: string | null;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  status: "draft" | "published";
  accent: QuizAccent;
  questions: Question[];
  plays: number;
  accuracy: number;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  streak: number;
  connected: boolean;
  correctCount: number;
}

export type GameStatus =
  | "lobby"
  | "question"
  | "reveal"
  | "leaderboard"
  | "podium";

export interface GameSession {
  id: string;
  quizId: string;
  pin: string;
  status: GameStatus;
  questionIndex: number;
  players: Player[];
  answeredCount: number;
}

export interface QuestionResult {
  questionId: string;
  correctOptionId: string | null;
  /** optionId -> número de respuestas. */
  distribution: Record<string, number>;
  answeredCount: number;
  leaderboard: Player[];
}

export interface PodiumResult {
  quizId: string;
  quizTitle: string;
  players: Player[];
  totalPlayers: number;
  avgAccuracy: number;
  avgTime: number;
  hardestQuestion: string;
}

/** Payload para crear/actualizar un quiz desde el editor. */
export type QuizDraft = Pick<
  Quiz,
  "title" | "description" | "subject" | "grade" | "status" | "questions"
>;

/** Respuesta de validación local del editor. */
export interface QuizValidation {
  valid: boolean;
  errors: { questionId: string; message: string }[];
}
