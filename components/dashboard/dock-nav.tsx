"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./dock-nav.module.css";

export interface DockNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

interface DockItemProps {
  item: DockNavItem;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  spring: { mass: number; stiffness: number; damping: number };
  distance: number;
  magnification: number;
  baseItemSize: number;
  active: boolean;
  onSelect: (id: string) => void;
}

function DockItem({
  item,
  mouseY,
  spring,
  distance,
  magnification,
  baseItemSize,
  active,
  onSelect,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const isHovered = useMotionValue(0);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setShowLabel(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  const mouseDistance = useTransform(mouseY, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      top: 0,
      height: baseItemSize,
    };

    return value - rect.top - rect.height / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`${styles.item} ${active ? styles.itemActive : ""}`}
      style={{ width: size, height: size }}
      onClick={() => onSelect(item.id)}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      aria-label={item.label}
    >
      <span className={styles.icon}>{item.icon}</span>

      <AnimatePresence>
        {showLabel ? (
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.16 }}
            style={{ x: "-50%" }}
          >
            {item.label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

interface DockNavProps {
  items: DockNavItem[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export function DockNav({ items, activeId, onSelect }: DockNavProps) {
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const spring = useMemo(
    () => ({ mass: 0.14, stiffness: 170, damping: 14 }),
    [],
  );
  const panelWidth = 76;
  const dockWidth = 138;
  const baseItemSize = 52;
  const magnification = 74;
  const distance = 180;

  const maxWidth = useMemo(
    () => Math.max(dockWidth, magnification + magnification / 2 + 6),
    [dockWidth, magnification],
  );
  const widthRow = useTransform(isHovered, [0, 1], [panelWidth, maxWidth]);
  const width = useSpring(widthRow, spring);

  return (
    <motion.nav className={styles.outer} style={{ width }}>
      <motion.div
        className={styles.panel}
        style={{ width: panelWidth }}
        onMouseMove={({ clientY }) => {
          isHovered.set(1);
          mouseY.set(clientY);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseY.set(Infinity);
        }}
        aria-label="Dashboard dock"
      >
        {items.map((item) => (
          <DockItem
            key={item.id}
            item={item}
            mouseY={mouseY}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            active={item.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </motion.div>
    </motion.nav>
  );
}
