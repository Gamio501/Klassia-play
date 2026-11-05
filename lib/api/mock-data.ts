import type { AnswerOption, Player, Question, Quiz } from "@/types/klassia";

const opt = (id: string, text: string, correct = false): AnswerOption => ({
  id,
  text,
  correct,
});

const q = (
  id: string,
  statement: string,
  options: AnswerOption[],
  timeLimit = 30,
  points = 1000,
): Question => ({
  id,
  statement,
  type: "multiple",
  options,
  timeLimit,
  points,
  mediaUrl: null,
});

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "sistema-solar",
    title: "El sistema solar",
    description:
      "Repaso de planetas, órbitas y escalas del sistema solar para cerrar la unidad.",
    subject: "Ciencias Naturales",
    grade: "4° Primaria",
    status: "published",
    accent: "brand",
    plays: 3,
    accuracy: 82,
    updatedAt: "2026-11-02T14:20:00.000Z",
    questions: [
      q("q1", "¿Cuál es el planeta más grande del sistema solar?", [
        opt("q1a", "Saturno"),
        opt("q1b", "Júpiter", true),
        opt("q1c", "Neptuno"),
        opt("q1d", "La Tierra"),
      ]),
      q(
        "q2",
        "¿Qué fuerza mantiene a los planetas en órbita alrededor del Sol?",
        [
          opt("q2a", "La gravedad", true),
          opt("q2b", "El magnetismo"),
          opt("q2c", "La fricción"),
          opt("q2d", "La presión atmosférica"),
        ],
        20,
      ),
      q("q3", "La luz del Sol tarda aproximadamente 8 minutos en llegar a la Tierra.", [
        opt("q3a", "Verdadero", true),
        opt("q3b", "Falso"),
      ], 20),
      q("q4", "¿Cuál es el planeta más cercano al Sol?", [
        opt("q4a", "Venus"),
        opt("q4b", "Mercurio", true),
        opt("q4c", "Marte"),
        opt("q4d", "Júpiter"),
      ]),
      q("q5", "¿Cuántos planetas tiene el sistema solar?", [
        opt("q5a", "Siete"),
        opt("q5b", "Ocho", true),
        opt("q5c", "Nueve"),
        opt("q5d", "Diez"),
      ], 20),
      q("q6", "¿Qué planeta es conocido como el planeta rojo?", [
        opt("q6a", "Marte", true),
        opt("q6b", "Venus"),
        opt("q6c", "Urano"),
        opt("q6d", "Saturno"),
      ]),
    ],
  },
  {
    id: "fracciones",
    title: "Fracciones equivalentes",
    description:
      "Identificar fracciones equivalentes y comparar fracciones con distinto denominador.",
    subject: "Matemáticas",
    grade: "5° Primaria",
    status: "published",
    accent: "success",
    plays: 5,
    accuracy: 76,
    updatedAt: "2026-10-28T09:10:00.000Z",
    questions: [
      q("f1", "¿Cuál fracción es equivalente a 1/2?", [
        opt("f1a", "2/4", true),
        opt("f1b", "2/3"),
        opt("f1c", "3/5"),
        opt("f1d", "1/3"),
      ], 30),
      q("f2", "¿Cuánto es 1/4 + 1/4?", [
        opt("f2a", "2/8"),
        opt("f2b", "1/2", true),
        opt("f2c", "1/8"),
        opt("f2d", "2/4 + 1/4"),
      ], 30),
      q("f3", "3/6 es equivalente a 1/2.", [
        opt("f3a", "Verdadero", true),
        opt("f3b", "Falso"),
      ], 20),
      q("f4", "¿Qué fracción es mayor: 2/3 o 3/5?", [
        opt("f4a", "2/3", true),
        opt("f4b", "3/5"),
        opt("f4c", "Son iguales"),
        opt("f4d", "No se puede saber"),
      ], 30),
      q("f5", "Simplifica 8/12.", [
        opt("f5a", "4/6"),
        opt("f5b", "2/3", true),
        opt("f5c", "1/2"),
        opt("f5d", "3/4"),
      ], 30),
    ],
  },
  {
    id: "celula-animal",
    title: "La célula animal",
    description:
      "Partes de la célula animal y la función de cada organelo en el nivel celular.",
    subject: "Biología",
    grade: "6° Primaria",
    status: "draft",
    accent: "danger",
    plays: 2,
    accuracy: 88,
    updatedAt: "2026-10-21T16:45:00.000Z",
    questions: [
      q("c1", "¿Qué organelo se encarga de producir energía en la célula?", [
        opt("c1a", "El núcleo"),
        opt("c1b", "La mitocondria", true),
        opt("c1c", "El ribosoma"),
        opt("c1d", "El aparato de Golgi"),
      ], 30),
      q("c2", "La pared celular es característica de la célula animal.", [
        opt("c2a", "Verdadero"),
        opt("c2b", "Falso", true),
      ], 20),
      q("c3", "¿Qué contiene el material genético de la célula?", [
        opt("c3a", "El citoplasma"),
        opt("c3b", "La membrana"),
        opt("c3c", "El núcleo", true),
        opt("c3d", "El lisosoma"),
      ], 30),
      q("c4", "¿Qué función cumple la membrana celular?", [
        opt("c4a", "Regular el paso de sustancias", true),
        opt("c4b", "Producir proteínas"),
        opt("c4c", "Almacenar agua"),
        opt("c4d", "Dividir la célula"),
      ], 30),
    ],
  },
];

export const MOCK_STATS = {
  playsThisMonth: 10,
  participations: 128,
  averageAccuracy: 81,
};

const PLAYER_SEED: [string, number, number][] = [
  ["Sofía M.", 3850, 5],
  ["Mateo R.", 3720, 4],
  ["Valentina", 3570, 4],
  ["Lucas G.", 3410, 4],
  ["Emma C.", 3280, 3],
  ["Thiago", 3140, 3],
  ["Isabella", 2980, 3],
  ["Martín P.", 2860, 3],
  ["Camila T.", 2740, 2],
  ["Santiago L.", 2650, 2],
  ["Mariana", 2510, 2],
  ["Diego F.", 2400, 2],
  ["Lucía V.", 2280, 2],
  ["Tomás A.", 2170, 2],
  ["Renata", 2050, 2],
  ["Emiliano", 1940, 1],
  ["Antonella", 1830, 1],
  ["Samuel D.", 1720, 1],
  ["Julieta", 1610, 1],
  ["Nicolás", 1500, 1],
  ["Paula M.", 1380, 1],
  ["Andrés", 1270, 1],
  ["Daniela", 1150, 1],
  ["Bruno", 1040, 1],
  ["Sara", 920, 1],
];

export const MOCK_PLAYERS: Player[] = PLAYER_SEED.map(
  ([name, score, correctCount], index) => ({
    id: `p${index + 1}`,
    name,
    score,
    correctCount,
    streak: index % 4,
    connected: true,
    color: [
      "#1769FF",
      "#F97316",
      "#10B981",
      "#0EA5E9",
      "#A855F7",
      "#EF4444",
      "#14B8A6",
      "#EC4899",
    ][index % 8],
  }),
);
