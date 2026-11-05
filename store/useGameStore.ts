"use client";

import { create } from "zustand";
import type { Player, Quiz } from "@/types/klassia";

interface GameState {
  quiz: Quiz | null;
  players: Player[];
  questionIndex: number;
  answeredCount: number;
  revealed: boolean;
  finished: boolean;

  init: (quiz: Quiz, players: Player[]) => void;
  setAnswered: (count: number) => void;
  reveal: () => void;
  next: () => void;
  reset: () => void;
  leaderboard: (size?: number) => Player[];
}

export const useGameStore = create<GameState>()((set, get) => ({
  quiz: null,
  players: [],
  questionIndex: 0,
  answeredCount: 0,
  revealed: false,
  finished: false,

  init: (quiz, players) =>
    set({
      quiz,
      players,
      questionIndex: 0,
      answeredCount: 0,
      revealed: false,
      finished: false,
    }),

  setAnswered: (answeredCount) => set({ answeredCount }),

  reveal: () => set({ revealed: true, answeredCount: 0 }),

  next: () =>
    set((state) => {
      const total = state.quiz?.questions.length ?? 0;
      const nextIndex = state.questionIndex + 1;
      return {
        questionIndex: Math.min(nextIndex, Math.max(total - 1, 0)),
        revealed: false,
        answeredCount: 0,
        finished: nextIndex >= total,
      };
    }),

  reset: () =>
    set({
      questionIndex: 0,
      answeredCount: 0,
      revealed: false,
      finished: false,
    }),

  leaderboard: (size = 5) =>
    [...get().players]
      .sort((a, b) => b.score - a.score)
      .slice(0, size),
}));
