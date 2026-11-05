import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Klassia Play — Quizzes en vivo",
  description:
    "Crea, juega y descubre cómo aprende tu clase. Módulo de quizzes en vivo para profesores de Klassia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="h-full overflow-hidden bg-app text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
