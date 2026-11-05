import type {
  GameSession,
  PodiumResult,
  QuestionResult,
  Quiz,
  QuizDraft,
} from "@/types/klassia";
import { MOCK_PLAYERS, MOCK_QUIZZES, MOCK_STATS } from "./mock-data";
import { uid } from "@/lib/utils/format";

/**
 * Capa de acceso a datos.
 *
 * Hoy: mocks con localStorage (NEXT_PUBLIC_USE_MOCKS=true).
 * Mañana: el mismo contrato contra el backend real.
 *
 * Para conectar el backend basta con:
 *   1. NEXT_PUBLIC_USE_MOCKS=false
 *   2. NEXT_PUBLIC_API_URL=https://api.klassia.lat
 * Nada de los componentes cambia.
 */

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const STORAGE_KEY = "klassia-play:quizzes:v1";

const delay = (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms));

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function request<T>(path: string, init?: RequestInit): Promise<T> {
  return fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  }).then(async (res) => {
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return (await res.json()) as T;
  });
}

/* ------------------------------------------------------------------ */
/* Mock store                                                          */
/* ------------------------------------------------------------------ */

function readQuizzes(): Quiz[] {
  if (typeof window === "undefined") return clone(MOCK_QUIZZES);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(MOCK_QUIZZES);
    return JSON.parse(raw) as Quiz[];
  } catch {
    return clone(MOCK_QUIZZES);
  }
}

function writeQuizzes(quizzes: Quiz[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

const SESSIONS = new Map<string, GameSession>();

/* ------------------------------------------------------------------ */
/* Quizzes                                                             */
/* ------------------------------------------------------------------ */

export async function listQuizzes(): Promise<Quiz[]> {
  if (!USE_MOCKS) return request<Quiz[]>("/quizzes");
  await delay();
  return readQuizzes().sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1,
  );
}

export interface DashboardStats {
  playsThisMonth: number;
  participations: number;
  averageAccuracy: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!USE_MOCKS) return request<DashboardStats>("/stats/dashboard");
  await delay(120);
  return MOCK_STATS;
}

export async function getQuiz(id: string): Promise<Quiz> {
  if (!USE_MOCKS) return request<Quiz>(`/quizzes/${id}`);
  await delay(220);
  const quiz = readQuizzes().find((item) => item.id === id);
  if (!quiz) throw new Error("Quiz no encontrado");
  return quiz;
}

export async function createQuiz(draft: QuizDraft): Promise<Quiz> {
  if (!USE_MOCKS)
    return request<Quiz>("/quizzes", {
      method: "POST",
      body: JSON.stringify(draft),
    });
  await delay();
  const quiz: Quiz = {
    ...draft,
    id: uid("quiz"),
    accent: "brand",
    plays: 0,
    accuracy: 0,
    updatedAt: new Date().toISOString(),
  };
  const quizzes = readQuizzes();
  writeQuizzes([quiz, ...quizzes]);
  return quiz;
}

export async function updateQuiz(id: string, draft: QuizDraft): Promise<Quiz> {
  if (!USE_MOCKS)
    return request<Quiz>(`/quizzes/${id}`, {
      method: "PUT",
      body: JSON.stringify(draft),
    });
  await delay();
  const quizzes = readQuizzes();
  const index = quizzes.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Quiz no encontrado");
  const updated: Quiz = {
    ...quizzes[index],
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  quizzes[index] = updated;
  writeQuizzes(quizzes);
  return updated;
}

export async function deleteQuiz(id: string): Promise<void> {
  if (!USE_MOCKS) {
    await request<void>(`/quizzes/${id}`, { method: "DELETE" });
    return;
  }
  await delay(180);
  writeQuizzes(readQuizzes().filter((item) => item.id !== id));
}

/* ------------------------------------------------------------------ */
/* Sesión en vivo                                                      */
/* ------------------------------------------------------------------ */

function randomPin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function startSession(
  quizId: string,
): Promise<{ sessionId: string; pin: string }> {
  if (!USE_MOCKS)
    return request<{ sessionId: string; pin: string }>("/sessions", {
      method: "POST",
      body: JSON.stringify({ quizId }),
    });
  await delay(260);
  const sessionId = uid("ses");
  const pin = randomPin();
  SESSIONS.set(sessionId, {
    id: sessionId,
    quizId,
    pin,
    status: "lobby",
    questionIndex: 0,
    players: clone(MOCK_PLAYERS),
    answeredCount: 0,
  });
  return { sessionId, pin };
}

export async function getSession(sessionId: string): Promise<GameSession> {
  if (!USE_MOCKS) return request<GameSession>(`/sessions/${sessionId}`);
  await delay(120);
  const session = SESSIONS.get(sessionId);
  if (!session) throw new Error("Sesión no encontrada");
  return clone(session);
}

export async function advanceQuestion(
  sessionId: string,
): Promise<GameSession> {
  if (!USE_MOCKS)
    return request<GameSession>(`/sessions/${sessionId}/advance`, {
      method: "POST",
    });
  await delay(120);
  const session = SESSIONS.get(sessionId);
  if (!session) throw new Error("Sesión no encontrada");
  const next: GameSession = {
    ...session,
    questionIndex: session.questionIndex + 1,
    status: "question",
    answeredCount: 0,
  };
  SESSIONS.set(sessionId, next);
  return clone(next);
}

export async function closeQuestion(
  sessionId: string,
): Promise<QuestionResult> {
  if (!USE_MOCKS)
    return request<QuestionResult>(`/sessions/${sessionId}/close`, {
      method: "POST",
    });
  await delay(180);
  const session = SESSIONS.get(sessionId);
  if (!session) throw new Error("Sesión no encontrada");
  return {
    questionId: `q${session.questionIndex + 1}`,
    correctOptionId: null,
    distribution: {},
    answeredCount: session.players.length,
    leaderboard: clone(MOCK_PLAYERS).sort((a, b) => b.score - a.score).slice(0, 5),
  };
}

export async function finishSession(
  sessionId: string,
): Promise<PodiumResult> {
  if (!USE_MOCKS)
    return request<PodiumResult>(`/sessions/${sessionId}/finish`, {
      method: "POST",
    });
  await delay(200);
  const session = SESSIONS.get(sessionId);
  return {
    quizId: session?.quizId ?? "sistema-solar",
    quizTitle: "El sistema solar",
    players: clone(MOCK_PLAYERS).sort((a, b) => b.score - a.score),
    totalPlayers: MOCK_PLAYERS.length,
    avgAccuracy: 82,
    avgTime: 9.4,
    hardestQuestion: "¿Qué fuerza mantiene a los planetas en órbita?",
  };
}
