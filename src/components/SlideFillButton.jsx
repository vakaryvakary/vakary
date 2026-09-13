// Slide Fill Button — Originkit
// Converted from TSX to JSX (TypeScript types removed)
// Added: onClick / className pass-through, and width & height props for sizing
"use client";

import * as React from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useAnimate } from "framer-motion";

const radiusFromPercent = (w, h, pct) =>
  (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const getOffset = (dir, percent) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const fillRatio = clamped / 100;
  const emptyRatio = 1 - fillRatio;

  if (dir === "up") {
    if (clamped === 0) return { x: "0%", y: "calc(100% + 20px)" };
    return { x: "0%", y: `${emptyRatio * 100}%` };
  }
  if (dir === "down") {
    if (clamped === 0) return { x: "0%", y: "calc(-100% - 20px)" };
    return { x: "0%", y: `-${emptyRatio * 100}%` };
  }
  if (dir === "left") {
    if (clamped === 0) return { x: "calc(100% + 20px)", y: "0%" };
    return { x: `${emptyRatio * 100}%`, y: "0%" };
  }
  if (clamped === 0) return { x: "calc(-100% - 20px)", y: "0%" };
  return { x: `-${emptyRatio * 100}%`, y: "0%" };
};

const wavePath = (period, amp, invert = false) => {
  const count = Math.round(400 / period);
  const q = period / 4;
  const a = invert ? amp : -amp;
  let d = "M 0 15";
  for (let i = 0; i < count; i++) {
    const x0 = i * period;
    d += ` C ${x0 + q} ${15 + a}, ${x0 + period - q} ${15 - a}, ${
      x0 + period
    } 15`;
  }
  return `${d} V 40 H 0 Z`;
};

const BACK_PATH = wavePath(200, 9, true);
const FRONT_PATH = wavePath(100, 10);

const DEFAULT_TRANSITION = {
  type: "tween",
  ease: [0.25, 1, 0.5, 1],
  duration: 0.45,
};

function __OriginkitBase_SlideFillButton(props) {
  const {
    label = "WATER FILL",
    font = {
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: 40,
      lineHeight: "1.5em",
      letterSpacing: "0em",
      textAlign: "left",
    },
    showText = true,
    padding = "40px 64px 40px 64px",
    // New: set an explicit box size instead of letting padding drive it.
    // When provided, these win over padding/minWidth/minHeight for layout.
    width,
    height,
    rounded = 32,
    fill: fillProp,
    textColor: textColorProp,
    colors = { fill: "#f4d35e", textColor: "#0d3b66" },
    addIcon = false,
    icon = {
      side: "left",
      size: 45,
      type: "symbol",
      color: "#000000",
      image: "",
      symbol: "\u2192",
      padding: 0,
      rounded: 0,
      hoverColor: "#FFFFFF",
    },
    gap = 12,
    border = {
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: "#2A9DF400",
    },
    boxShadow,
    water = {
      color: "#0E87CC",
      direction: "up",
      textColor: "#FFFFFF",
      waveSpeed: 50,
      defaultFill: 0,
    },
    direction: directionLegacy,
    waveSpeed: waveSpeedLegacy,
    defaultFill: defaultFillLegacy,
    link = "",
    transition = DEFAULT_TRANSITION,
    newTab = false,
    style,
    onClick,
    className,
    ...rest
  } = props;

  const fill = colors?.fill ?? fillProp ?? "#f4d35e";
  const textColor = colors?.textColor ?? textColorProp ?? "#0d3b66";
  const {
    color: waterColor = colors?.hoverFill ?? "#0E87CC",
    textColor: waterTextColor = colors?.hoverTextColor ?? "#FFFFFF",
    direction = directionLegacy ?? "up",
    defaultFill = defaultFillLegacy ?? 0,
    waveSpeed: waveSpeedPctProp,
  } = water;

  const idleTextColor = "#0d3b66";

  const waveSpeedPct = waveSpeedPctProp ?? waveSpeedLegacy ?? 50;
  const waveSpeed =
    5 * (Math.max(0, Math.min(200, Math.round(waveSpeedPct))) / 50);

  const {
    type: iconKind = "symbol",
    symbol: iconSymbol = "\u2192",
    image,
    color: iconColor = "#000000",
    hoverColor: iconHoverColor = "#FFFFFF",
    side: iconSide = "left",
    size: iconSize = 24,
    padding: iconPaddingProp = 0,
    rounded: iconRounded = 0,
  } = icon;

  const iconSrc =
    typeof image === "string" ? image : image && image.src ? image.src : "";
  const iconMode = iconKind === "image" && iconSrc ? "image" : "symbol";
  const iconPx = Math.max(1, Math.round(iconSize));
  const iconPadPx = Math.max(0, Math.round(iconPaddingProp));
  const iconRadius = radiusFromPercent(iconPx, iconPx, iconRounded);
  const gapPx = Math.max(0, Math.round(gap));
  const hasIcon = addIcon;

  const [scope, animate] = useAnimate();

  const [radiusBox, setRadiusBox] = useState({ w: 0, h: 0 });
  useIsoLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const read = () =>
      setRadiusBox((prev) =>
        prev.w === el.offsetWidth && prev.h === el.offsetHeight
          ? prev
          : { w: el.offsetWidth, h: el.offsetHeight }
      );
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);
  const radiusPx = radiusFromPercent(radiusBox.w, radiusBox.h, rounded);
  const waterRef = useRef(null);
  const iconRef = useRef(null);
  const labelRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);

  const hovered = useRef(false);
  const focused = useRef(false);
  const filled = useRef(false);

  const [box, setBox] = useState({ w: 0, h: 0 });

  const loopsRef = useRef([]);

  const restOffset = getOffset(direction, defaultFill);
  const fullOffset = getOffset(direction, 100);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const read = () =>
      setBox((prev) =>
        prev.w === el.clientWidth && prev.h === el.clientHeight
          ? prev
          : { w: el.clientWidth, h: el.clientHeight }
      );
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);

  useEffect(() => {
    const rate = Math.max(0, Math.min(20, Math.round(waveSpeed)));
    if (rate === 0) {
      loopsRef.current = [];
      return;
    }
    const base = 15 / rate;
    const specs = [
      [backRef.current, base * 1.35, ["0%", "-50%"]],
      [frontRef.current, base, ["-50%", "0%"]],
    ];
    const controls = specs
      .map(([el, duration, keys]) =>
        el
          ? animate(
              el,
              { x: keys },
              { duration, repeat: Infinity, ease: "linear" }
            )
          : null
      )
      .filter(Boolean);
    loopsRef.current = controls;
    return () => {
      controls.forEach((c) => c?.stop());
      loopsRef.current = [];
    };
  }, [animate, waveSpeed]);

  const resetToEmpty = useCallback(() => {
    filled.current = false;
    if (!waterRef.current) return;
    animate(
      waterRef.current,
      { x: restOffset.x, y: restOffset.y },
      { duration: 0 }
    );
    const submerged = defaultFill >= 60;
    if (labelRef.current)
      animate(
        labelRef.current,
        { color: submerged ? waterTextColor : idleTextColor },
        { duration: 0 }
      );
    if (iconRef.current)
      animate(
        iconRef.current,
        { color: submerged ? iconHoverColor : iconColor },
        { duration: 0 }
      );
  }, [
    animate,
    restOffset.x,
    restOffset.y,
    idleTextColor,
    waterTextColor,
    iconColor,
    iconHoverColor,
    defaultFill,
  ]);

  const runFill = useCallback(() => {
    if (waterRef.current) {
      animate(
        waterRef.current,
        { x: fullOffset.x, y: fullOffset.y },
        transition
      );
    }
    if (labelRef.current) {
      animate(labelRef.current, { color: waterTextColor }, transition);
    }
    if (iconRef.current) {
      animate(iconRef.current, { color: iconHoverColor }, transition);
    }
  }, [
    animate,
    transition,
    fullOffset.x,
    fullOffset.y,
    waterTextColor,
    iconHoverColor,
  ]);

  const runDrain = useCallback(() => {
    if (waterRef.current) {
      animate(
        waterRef.current,
        { x: restOffset.x, y: restOffset.y },
        transition
      );
    }
    const submerged = defaultFill >= 60;
    if (labelRef.current) {
      animate(
        labelRef.current,
        { color: submerged ? waterTextColor : idleTextColor },
        transition
      );
    }
    if (iconRef.current) {
      animate(
        iconRef.current,
        { color: submerged ? iconHoverColor : iconColor },
        transition
      );
    }
  }, [
    animate,
    transition,
    restOffset.x,
    restOffset.y,
    idleTextColor,
    waterTextColor,
    iconColor,
    iconHoverColor,
    defaultFill,
  ]);

  useEffect(() => {
    if (hovered.current || focused.current) runFill();
    else resetToEmpty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToEmpty, runFill]);

  const sync = useCallback(() => {
    const want = hovered.current || focused.current;
    if (want === filled.current) return;
    filled.current = want;
    want ? runFill() : runDrain();
  }, [runFill, runDrain]);

  const onPointerEnter = useCallback(() => {
    hovered.current = true;
    sync();
  }, [sync]);

  const onPointerLeave = useCallback(() => {
    hovered.current = false;
    sync();
  }, [sync]);

  const onFocus = useCallback(
    (e) => {
      let visible = true;
      try {
        visible = e.currentTarget.matches(":focus-visible");
      } catch {
        // :focus-visible unsupported — fallback
      }
      if (!visible) return;
      focused.current = true;
      sync();
    },
    [sync]
  );

  const onBlur = useCallback(() => {
    focused.current = false;
    sync();
  }, [sync]);

  const fontStyles = font ?? {};
  const isLink = typeof link === "string" && link.length > 0;
  const Root = isLink ? motion.a : motion.button;
  const rootProps = {
    "aria-label": showText ? undefined : label || undefined,
    ...(isLink
      ? {
          href: link,
          target: newTab ? "_blank" : undefined,
          rel: newTab ? "noopener noreferrer" : undefined,
        }
      : { type: "button" }),
  };

  const CREST = 16;
  const AHEAD = 15;
  const crestFrame =
    direction === "up"
      ? { top: -AHEAD, left: 0, right: 0, height: CREST }
      : direction === "down"
      ? {
          bottom: -AHEAD,
          left: 0,
          right: 0,
          height: CREST,
          transform: "rotate(180deg)",
        }
      : direction === "left"
      ? {
          top: 0,
          left: 0,
          width: box.h,
          height: CREST,
          transformOrigin: "0 0",
          transform: `translate(${-AHEAD}px, ${box.h}px) rotate(-90deg)`,
        }
      : {
          top: 0,
          left: 0,
          width: box.h,
          height: CREST,
          transformOrigin: "0 0",
          transform: `translate(${box.w + AHEAD}px, 0px) rotate(90deg)`,
        };

  const layerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "200%",
    height: "100%",
  };

  // If width/height are given, they take over sizing and padding just
  // becomes inner breathing room (boxSizing keeps it from overflowing).
  const sizeStyle = {
    width: width ?? undefined,
    height: height ?? undefined,
    minWidth: width ? undefined : 80,
    minHeight: height ? undefined : 40,
    boxSizing: "border-box",
  };

  return (
    <Root
      ref={scope}
      {...rootProps}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      className={className}
      {...rest}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: hasIcon && showText ? gapPx : 0,
        flexDirection: iconSide === "right" ? "row-reverse" : "row",
        padding,
        borderRadius: radiusPx,
        border: `${border.borderWidth}px ${border.borderStyle} ${border.borderColor}`,
        boxShadow: boxShadow ?? "none",
        background: fill,
        cursor: "pointer",
        textDecoration: "none",
        WebkitTapHighlightColor: "transparent",
        ...sizeStyle,
        ...fontStyles,
        ...style,
      }}
    >
      <motion.div
        ref={waterRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: waterColor,
          pointerEvents: "none",
          zIndex: 1,
          x: restOffset.x,
          y: restOffset.y,
        }}
      >
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            overflow: "visible",
            ...crestFrame,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "50% 100%",
            }}
          >
            <motion.svg
              ref={backRef}
              viewBox="0 0 400 30"
              preserveAspectRatio="none"
              style={{ ...layerStyle, opacity: 0.45 }}
            >
              <path d={BACK_PATH} fill={waterColor} />
            </motion.svg>

            <motion.svg
              ref={frontRef}
              viewBox="0 0 400 30"
              preserveAspectRatio="none"
              style={layerStyle}
            >
              <path d={FRONT_PATH} fill={waterColor} />
            </motion.svg>

            <div
              style={{
                position: "absolute",
                top: "calc(100% - 2px)",
                left: 0,
                right: 0,
                height: 26,
                background: waterColor,
              }}
            />
          </div>
        </div>
      </motion.div>

      {hasIcon &&
        (iconMode === "image" ? (
          <img
            src={iconSrc}
            alt=""
            aria-hidden
            draggable={false}
            style={{
              position: "relative",
              zIndex: 2,
              width: iconPx,
              height: iconPx,
              margin: iconPadPx,
              objectFit: iconRadius > 0 ? "cover" : "contain",
              borderRadius: Math.min(iconRadius, iconPx / 2),
              display: "block",
              flex: "none",
              pointerEvents: "none",
            }}
          />
        ) : (
          <span
            ref={iconRef}
            aria-hidden
            style={{
              position: "relative",
              zIndex: 2,
              fontSize: iconPx,
              margin: iconPadPx,
              lineHeight: 1,
              color: iconColor,
              flex: "none",
              pointerEvents: "none",
            }}
          >
            {iconSymbol}
          </span>
        ))}

      {showText && (
        <motion.span
          ref={labelRef}
          style={{
            position: "relative",
            zIndex: 2,
            color: idleTextColor,
            whiteSpace: "nowrap",
            ...fontStyles,
          }}
        >
          {label}
        </motion.span>
      )}
    </Root>
  );
}

const __originkitPresetProps = {
  icon: {
    side: "right",
    size: 45,
    type: "symbol",
    color: "#0d3b66",
    image: "",
    symbol: "→",
    padding: 0,
    rounded: 0,
    hoverColor: "#FFFFFF",
  },
  transition: {
    ease: [0.44, 0, 0.56, 1],
    type: "tween",
    delay: 0,
    duration: 0.4,
  },
};

export default function SlideFillButton(props) {
  return (
    <__OriginkitBase_SlideFillButton
      {...__originkitPresetProps}
      {...props}
    />
  );
}