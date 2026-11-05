import { cn } from "@/lib/utils/cn";

/**
 * Contenedor raíz de cada pantalla: 100dvh x 100vw, sin scroll.
 * El grid reserva 64px para el header y deja el resto al contenido.
 */
export function ScreenShell({
  children,
  className,
  bare = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** true = sin header propio (la pantalla maneja su propio layout). */
  bare?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[100dvh] w-full flex-col overflow-hidden",
        className,
      )}
    >
      {bare ? (
        children
      ) : (
        <div className="grid min-h-0 flex-1 grid-rows-[64px_minmax(0,1fr)]">
          {children}
        </div>
      )}
    </div>
  );
}

export function ScreenBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      {children}
    </main>
  );
}
