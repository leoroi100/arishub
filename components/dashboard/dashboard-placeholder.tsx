"use client";

import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import styles from "./dashboard-placeholder.module.css";

interface DashboardPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}

export function DashboardPlaceholder({
  eyebrow,
  title,
  description,
  points,
}: DashboardPlaceholderProps) {
  return (
    <section className={styles.page}>
      <SpotlightCard className={styles.card} spotlightColor="rgba(207, 31, 63, 0.16)">
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>

        <div className={styles.points}>
          {points.map((point) => (
            <div key={point} className={styles.point}>
              <span className={styles.dot} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </section>
  );
}
