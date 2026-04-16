import { cn } from "@/lib/utils";

export const FIXPASS_TAGLINE = "Home maintenance, handled.";

type FixpassMarkProps = {
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
};

/**
 * FixpassMark — house + F brand mark, traced from the approved identity
 * asset. Matches the mobile app one-to-one so the marketing site, auth
 * flows, and native app all share the same silhouette.
 */
export function FixpassMark({
  size = 48,
  className,
  color = "currentColor",
  strokeWidth = 6,
}: FixpassMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* House — roof chevron + walls + rounded-bottom-corner floor */}
      <path d="M 22 76 L 22 38 L 50 12 L 78 38 L 78 76 Q 78 88 66 88 L 34 88 Q 22 88 22 76 Z" />
      {/* F — vertical stem */}
      <path d="M 38 38 L 38 76" />
      {/* F — top bar runs along the roof-wall junction */}
      <path d="M 38 38 L 72 38" />
      {/* F — middle crossbar */}
      <path d="M 38 57 L 56 57" />
    </svg>
  );
}

type FixpassWordmarkProps = {
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  showTagline?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { mark: 32, mark_stroke: 7, word: "text-sm", tag: "text-[10px]" },
  md: { mark: 44, mark_stroke: 6.5, word: "text-xl", tag: "text-[11px]" },
  lg: { mark: 64, mark_stroke: 6, word: "text-3xl", tag: "text-xs" },
} as const;

/**
 * FixpassWordmark — horizontal lockup combining the house mark with the
 * FIXPASS wordmark and optional tagline. Used in the site header and
 * footer, on the auth hero, and anywhere else we introduce the brand.
 */
export function FixpassWordmark({
  size = "md",
  onDark = false,
  showTagline = false,
  className,
}: FixpassWordmarkProps) {
  const { mark, mark_stroke, word, tag } = sizeMap[size];
  const markColor = onDark ? "#F7F5F0" : "#0B1B36";
  const wordColor = onDark ? "text-parchment" : "text-ink";
  const tagColor = onDark ? "text-parchment/70" : "text-ink/60";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <FixpassMark size={mark} color={markColor} strokeWidth={mark_stroke} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-black tracking-[0.14em]",
            word,
            wordColor,
          )}
        >
          FIXPASS
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 font-semibold uppercase tracking-[0.18em]",
              tag,
              tagColor,
            )}
          >
            {FIXPASS_TAGLINE}
          </span>
        ) : null}
      </div>
    </div>
  );
}
