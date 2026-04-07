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
    displacementScale: 52,
    blurAmount: 0.09,
    saturation: 112,
    aberrationIntensity: 1.2,
    elasticity: 0.08,
    cornerRadius: 18,
    mode: "prominent",
  },
  pill: {
    displacementScale: 44,
    blurAmount: 0.08,
    saturation: 120,
    aberrationIntensity: 1.1,
    elasticity: 0.12,
    cornerRadius: 999,
    mode: "prominent",
  },
  button: {
    displacementScale: 58,
    blurAmount: 0.06,
    saturation: 126,
    aberrationIntensity: 1.3,
    elasticity: 0.16,
    cornerRadius: 14,
    mode: "shader",
  },
  panel: {
    displacementScale: 64,
    blurAmount: 0.08,
    saturation: 118,
    aberrationIntensity: 1.2,
    elasticity: 0.1,
    cornerRadius: 28,
    mode: "prominent",
  },
  metric: {
    displacementScale: 48,
    blurAmount: 0.08,
    saturation: 115,
    aberrationIntensity: 1.1,
    elasticity: 0.08,
    cornerRadius: 18,
    mode: "prominent",
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
