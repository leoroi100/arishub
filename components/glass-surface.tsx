"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, ReactNode } from "react";
import { useSyncExternalStore } from "react";

type GlassVariant = "navbar" | "pill" | "button" | "panel" | "metric";

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: GlassVariant;
};

const LiquidGlass = dynamic(() => import("liquid-glass-react"), {
  ssr: false,
});

const glassPresets: Record<
  GlassVariant,
  {
    displacementScale: number;
    blurAmount: number;
    saturation: number;
    aberrationIntensity: number;
    elasticity: number;
    cornerRadius: number;
    mode: "standard" | "polar" | "prominent" | "shader";
  }
> = {
  navbar: {
    displacementScale: 34,
    blurAmount: 0.045,
    saturation: 118,
    aberrationIntensity: 0.65,
    elasticity: 0.04,
    cornerRadius: 18,
    mode: "prominent",
  },
  pill: {
    displacementScale: 30,
    blurAmount: 0.04,
    saturation: 122,
    aberrationIntensity: 0.55,
    elasticity: 0.05,
    cornerRadius: 999,
    mode: "standard",
  },
  button: {
    displacementScale: 32,
    blurAmount: 0.04,
    saturation: 124,
    aberrationIntensity: 0.6,
    elasticity: 0.06,
    cornerRadius: 14,
    mode: "standard",
  },
  panel: {
    displacementScale: 36,
    blurAmount: 0.05,
    saturation: 120,
    aberrationIntensity: 0.65,
    elasticity: 0.04,
    cornerRadius: 28,
    mode: "standard",
  },
  metric: {
    displacementScale: 28,
    blurAmount: 0.04,
    saturation: 118,
    aberrationIntensity: 0.55,
    elasticity: 0.04,
    cornerRadius: 18,
    mode: "standard",
  },
};

export function GlassSurface({
  children,
  className,
  style,
  variant = "panel",
}: GlassSurfaceProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const preset = glassPresets[variant];

  return (
    <LiquidGlass
      aberrationIntensity={preset.aberrationIntensity}
      blurAmount={preset.blurAmount}
      className={className}
      cornerRadius={preset.cornerRadius}
      displacementScale={preset.displacementScale}
      elasticity={preset.elasticity}
      mode={preset.mode}
      padding="0px"
      saturation={preset.saturation}
      style={style}
    >
      {children}
    </LiquidGlass>
  );
}
