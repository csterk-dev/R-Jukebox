"use client"

import { Box, BoxProps } from "@chakra-ui/react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";
import { christmasPalette, halloweenPalette, jukeboxPalette } from "theme/definitions";


type AnimatedBackgroundProps = BoxProps & {
  animationsEnabled: boolean;
  themeSeason: "halloween" | "christmas" | "none";
}

export const AnimatedBackground: FC<AnimatedBackgroundProps> = ({ animationsEnabled, themeSeason }) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curX = useRef(0);
  const curY = useRef(0);
  const tgX = useRef(0);
  const tgY = useRef(0);


  const [animationReady, setAnimationReady] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Get the appropriate palette based on theme season */
  const palette = useMemo(() => {
    if (themeSeason === "halloween") return halloweenPalette;
    if (themeSeason === "christmas") return christmasPalette;
    return jukeboxPalette;
  }, [themeSeason]);

  /** Apply palette colors as CSS variables */
  useEffect(() => {
    if (containerRef.current) {
      const root = containerRef.current;
      root.style.setProperty("--circle-color-1", hexToRgb(palette.circleColor1));
      root.style.setProperty("--circle-color-2", hexToRgb(palette.circleColor2));
      root.style.setProperty("--circle-color-3", hexToRgb(palette.circleColor3));
      root.style.setProperty("--circle-color-4", hexToRgb(palette.circleColor4));
      root.style.setProperty("--circle-color-5", hexToRgb(palette.circleColor5));
      root.style.setProperty("--circle-color-6", hexToRgb(palette.circleColor6));
      root.style.setProperty("--circle-color-7", hexToRgb(palette.circleColor7));
      root.style.setProperty("--circle-color-8", hexToRgb(palette.circleColor8));
      root.style.setProperty("--circle-color-9", hexToRgb(palette.circleColor9));
      root.style.setProperty("--color-interactive", hexToRgb(palette.interactive));
    }
  }, [palette]);

  /** Delay animation start to improve LCP score. */
  useEffect(() => {
    // Delay animation start until after initial render and LCP measurement
    // Small delay to allow LCP measurement to complete
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);


  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);


      const handleMotionChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
      mediaQuery.addEventListener("change", handleMotionChange);


      const shouldAnimate = animationsEnabled && !prefersReducedMotion && animationReady;

      if (shouldAnimate) {
        const move = () => {
          curX.current += (tgX.current - curX.current) / 20;
          curY.current += (tgY.current - curY.current) / 20;
          if (interactiveRef.current) {
            interactiveRef.current.style.transform = `translate(${Math.round(curX.current)}px, ${Math.round(curY.current)}px)`;
          }
          requestAnimationFrame(move);
        };

        const handleMouseMove = (event: MouseEvent) => {
          tgX.current = event.clientX;
          tgY.current = event.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);
        move();

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      }
    }
  }, [animationsEnabled, prefersReducedMotion, animationReady]);


  // Conditionally apply classes to control animation states
  const animationClass = useMemo(() => {
    if (!animationReady) return styles["animations-not-ready"];
    if (!animationsEnabled) return styles["animations-disabled"];
    return "";
  }, [animationsEnabled, animationReady]);

  const shouldAnimate = animationsEnabled && animationReady;

  return (
    <Box className={`${styles["hero-container"]}`} position="relative" ref={containerRef}>
      <div className={`${styles["gradient-bg"]} ${animationClass}`}>
        {/* Only render expensive SVG filter when animations are enabled */}
        {shouldAnimate ? (
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  result="blur"
                  stdDeviation="10"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  result="goo"
                  values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="goo"
                />
              </filter>
            </defs>
          </svg>
        ) : null}
        {/* Always show circles - they'll be static when animations are disabled */}
        <div className={styles["circles-container"]}>
          <div className={styles.c1} />
          <div className={styles.c2} />
          <div className={styles.c3} />
          <div className={styles.c4} />
          <div className={styles.c5} />
          <div className={styles.c6} />
          {/* Only show interactive circle when animations are enabled */}
          {shouldAnimate ? <div className={styles["interactive"]} ref={interactiveRef} /> : null}
        </div>
      </div>
    </Box>
  );
};

/** Convert hex color to RGB format for CSS variables */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
};