import type { CSSProperties, ReactNode } from "react";
import styles from "./liquid-glass.module.css";

type LiquidGlassVariant = "pill" | "panel";
type LiquidGlassTone = "neutral" | "accent";

type LiquidGlassProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  interactive?: boolean;
  style?: CSSProperties;
  tone?: LiquidGlassTone;
  variant?: LiquidGlassVariant;
};

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function LiquidGlass({
  children,
  className,
  contentClassName,
  interactive = false,
  style,
  tone = "neutral",
  variant = "pill",
}: LiquidGlassProps) {
  return (
    <div
      className={joinClasses(
        styles.root,
        styles[variant],
        styles[tone],
        interactive && styles.interactive,
        className,
      )}
      style={style}
    >
      <span aria-hidden="true" className={styles.highlight} />
      <div className={joinClasses(styles.content, contentClassName)}>{children}</div>
    </div>
  );
}
