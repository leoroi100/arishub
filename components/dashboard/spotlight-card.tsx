"use client";

import { useRef } from "react";
import styles from "./spotlight-card.module.css";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(207, 31, 63, 0.18)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();

    if (!rect || !cardRef.current) {
      return;
    }

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    cardRef.current.style.setProperty("--spotlight-color", spotlightColor);
  }

  return (
    <div
      ref={cardRef}
      className={[styles.card, className].filter(Boolean).join(" ")}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}
