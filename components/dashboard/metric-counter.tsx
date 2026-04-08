"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import styles from "./metric-counter.module.css";

function NumberColumn({
  motionValue,
  number,
  height,
}: {
  motionValue: ReturnType<typeof useSpring>;
  number: number;
  height: number;
}) {
  const y = useTransform(motionValue, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let value = offset * height;

    if (offset > 5) {
      value -= 10 * height;
    }

    return value;
  });

  return (
    <motion.span className={styles.number} style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(value: number) {
  const nearest = Math.round(value);
  const tolerance = 1e-9 * Math.max(1, Math.abs(value));
  return Math.abs(value - nearest) < tolerance ? nearest : value;
}

function getValueRoundedToPlace(value: number, place: number) {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

function Digit({
  place,
  value,
  height,
}: {
  place: number | ".";
  value: number;
  height: number;
}) {
  const isDecimal = place === ".";
  const roundedValue = isDecimal ? 0 : getValueRoundedToPlace(value, place);
  const animatedValue = useSpring(roundedValue);

  useEffect(() => {
    if (!isDecimal) {
      animatedValue.set(roundedValue);
    }
  }, [animatedValue, isDecimal, roundedValue]);

  if (isDecimal) {
    return (
      <span className={`${styles.digit} ${styles.decimal}`} style={{ height }}>
        .
      </span>
    );
  }

  return (
    <span className={styles.digit} style={{ height }}>
      {Array.from({ length: 10 }, (_, index) => (
        <NumberColumn
          key={index}
          motionValue={animatedValue}
          number={index}
          height={height}
        />
      ))}
    </span>
  );
}

function RollingCounter({ value }: { value: number }) {
  const places = [...value.toString()].map((character, index, all) => {
    if (character === ".") {
      return ".";
    }

    return (
      10 **
      (all.indexOf(".") === -1
        ? all.length - index - 1
        : index < all.indexOf(".")
          ? all.indexOf(".") - index - 1
          : -(index - all.indexOf(".")))
    );
  });
  const height = 80;

  return (
    <span className={styles.counter}>
      {places.map((place, index) => (
        <Digit key={`${place}-${index}`} place={place} value={value} height={height} />
      ))}
      <span className={styles.gradientMask}>
        <span className={styles.gradientTop} />
        <span className={styles.gradientBottom} />
      </span>
    </span>
  );
}

interface MetricCounterProps {
  label: string;
  value: number;
  detail: string;
  suffix?: string;
}

export function MetricCounter({
  label,
  value,
  detail,
  suffix = "",
}: MetricCounterProps) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueRow}>
        <RollingCounter value={value} />
        {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </div>
      <p className={styles.detail}>{detail}</p>
    </article>
  );
}
