"use client";

import * as React from "react";
import { motion } from "motion/react";
import uparrow from "/src/assets/uparrow.png";
import downarrow from "/src/assets/downarrow.png";
import "/src/Homepage.css";

import { cn } from "/src/lib/utils.js";

function HoverExpand({
  items,
  collapsedHeight = 104,
  // CHANGED: bumped default expanded height a bit to make more room for
  // longer descriptions. Feel free to raise this further (e.g. 380–420)
  // if you have very long paragraphs.
  expandedHeight = 400,
  className,
}) {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    const sync = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', sync);

    return () => mediaQuery.removeEventListener?.('change', sync);
  }, []);

  const effectiveCollapsedHeight = isMobile ? Math.max(collapsedHeight, 84) : collapsedHeight;
  const effectiveExpandedHeight = isMobile ? Math.max(expandedHeight, 650) : expandedHeight;

  const handleCardToggle = (index) => {
    setHoveredIndex((current) => (current === index ? null : index));
  };

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="w-full border-t border-current opacity-15" />

      {items.map((item, i) => {
        const isHovered = hoveredIndex === i;
        const isOtherHovered = hoveredIndex !== null && !isHovered;

        return (
          <React.Fragment key={i}>
            <motion.div
              className="relative w-full overflow-hidden cursor-default"
              animate={{
                height: isHovered ? effectiveExpandedHeight : effectiveCollapsedHeight,
                opacity: isOtherHovered ? 0.38 : 1,
              }}
              transition={{
                height: {
                  type: "spring",
                  stiffness: 280,
                  damping: 32,
                  mass: 0.9,
                },
                opacity: { duration: 0.22, ease: "easeOut" },
              }}
              onClick={() => handleCardToggle(i)}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              aria-expanded={isHovered}
            >
              <motion.div
                className="absolute inset-0 w-full h-full z-0"
                initial={false}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 1.06,
                }}
                transition={{
                  opacity: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
                  scale: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
                }}
              >

                <img
                  src={item.image}
                  alt={item.imageAlt ?? ""}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_38%),linear-gradient(to_top,_rgba(0,0,80,0.75),rgba(0,0,30,0.40)_100%,rgba(0,0,99,1))]" />
              </motion.div>

              <div className="absolute inset-0 z-10 flex items-start px-0 pt-4 ">
                <div className="flex w-full flex-col gap-2">
                  <div
                    className={
                      isMobile
                        ? "flex w-full items-start justify-between gap-1 px-4 py-5 max-[328px]: py-1"
                        : "flex w-full items-baseline justify-between gap-4 px-8 pr-20 py-4"
                    }
                  >
                    <div
                      className={
                        isMobile
                          ? "flex min-w-0 flex-1 items-baseline gap-3"
                          : "flex items-baseline text-4xl gap-3 min-w-0"
                      }
                    >
                      <motion.span
                        className="font-display text-md tabular-nums shrink-0 opacity-100"
                        animate={{
                          color: isHovered ? "#f8f3ea" : "#000000",
                          opacity: isHovered ? 1 : 0.65,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </motion.span>

                      <motion.span
                        className=" item-label font-display tracking-tight "
                        animate={{
                          color: isHovered ? "#f8f3ea" : "#0d3b66",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    </div>

                    <motion.span
                      className={
                        isMobile
                          ? "flex h-4 w-4 shrink-0 items-center justify-center leading-none"
                          : "hidden"
                      }
                      animate={{
                        color: isHovered ? "#f8f3ea" : "#0d3b66",
                        borderColor: isHovered ? "#f8f3ea" : "#0d3b66",
                      }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    >
                      {isHovered ? <img src={uparrow} alt="Up arrow" /> : <img src={downarrow} alt="Down arrow" />}
                    </motion.span>            

                    {item.sublabel && (
                      <motion.span
                        className={
                          isMobile
                            ? "hidden"
                            : "font-display text-xs tracking-[0.14em] uppercase shrink-0"
                        }
                        animate={{
                          color: isHovered ? "#f8f3ea" : "#0d3b66",
                          opacity: isHovered ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.sublabel}
                      </motion.span>
                    )}
                  </div>

                  {/* CHANGED: description now lives on its own row below
                      the label, instead of inline next to it. Removed
                      "truncate" and "hidden sm:block" so long paragraphs
                      can wrap across multiple lines on all screen sizes.
                      "max-w-2xl" keeps line length readable instead of
                      stretching edge-to-edge. */}
                  {item.description && (
                    <motion.p
                      className="font-body px-6 py-2 max-w-3xl whitespace-normal leading-normal text-shadow-2xl text-[0.95rem] md:text-[1rem]"
                      style={{ color: "#f8f3ea" }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : -8,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: isHovered ? 0.12 : 0,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      {item.description}
                    </motion.p>
                  )}

                  {(item.href || item.onLearnMore || item.linkText) && (
                    <motion.a
                      href={item.href ?? "#"}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!item.href) {
                          event.preventDefault();
                        }
                        if (item.onLearnMore) {
                          item.onLearnMore();
                        }
                      }}
                      className="font-body mt-1 px-6 inline-flex items-center gap-2 self-start text-m font-medium transition-colors"
                      style={{ color: "#f4d35e" }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : -8,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: isHovered ? 0.18 : 0,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      {item.linkText ?? "Learn more"}
                      <span aria-hidden="true">→</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="w-full border-t border-current opacity-15" />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default HoverExpand;