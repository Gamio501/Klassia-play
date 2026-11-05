import { LiveGameScreen } from "@/components/live/LiveGameScreen";

// La ruta depende de params dinámicos: no se puede prerenderizar.
export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LiveGameScreen quizId={id} />;
}
