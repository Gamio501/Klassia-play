import { cn } from "@/lib/utils/cn";
import { KlassiaGoLogo } from "./KlassiaGoLogo";

/**
 * Logo oficial de Klassia GO.
 *
 * El icono azul y la píldora lima son fijos (asset de marca); el wordmark
 * hereda el color del contexto para funcionar en fondos claros y de marca.
 */
export function Brand({
  tone = "default",
  compact = false,
  className,
}: {
  tone?: "default" | "onBrand";
  compact?: boolean;
  className?: string;
}) {
  return (
    <KlassiaGoLogo
      iconOnly={compact}
      className={cn(
        "block w-auto",
        compact ? "h-9" : "h-9 sm:h-10",
        tone === "onBrand" ? "text-white" : "text-ink",
        className,
      )}
    />
  );
}
