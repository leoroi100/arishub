import type { ReactNode } from "react";
import styles from "./glass-pill.module.css";

type GlassPillProps = {
  children: ReactNode;
};

export function GlassPill({ children }: GlassPillProps) {
  return <span className={styles.pill}>{children}</span>;
}
