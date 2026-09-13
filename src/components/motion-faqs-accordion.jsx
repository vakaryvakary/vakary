"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "/src/lib/utils.js";

function AccordionItem({ item, isOpen, onToggle, itemId, panelId, onMeasure }) {
  const contentRef = React.useRef(null);
  const itemRef = React.useRef(null);
  const [contentH, setContentH] = React.useState(0);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const update = () => {
      setContentH(el.scrollHeight);
      onMeasure?.(isOpen ? itemRef.current?.scrollHeight ?? el.scrollHeight : 0);
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();

    return () => ro.disconnect();
  }, [isOpen, onMeasure]);

  return (
    <motion.div
      ref={itemRef}
      layout
      className={cn(
        "overflow-hidden rounded-[10px] bg-surface text-foreground bg-slate-50 shadow-lg w-full",
        isOpen && " ",
      )}
      transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
      animate={{ scale: isOpen ? 1 : 0.985 }}
      initial={false}
      style={{ originX: 0.5, originY: 0 }}
    >
      <button
        id={itemId}
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full cursor-pointer select-none items-center justify-between gap-4 px-7 py-5 text-left"
      >
        <h2 className="font-display text-2xl font-medium tracking-tight leading-snug max-[500px]:text-md">
          {item.question}
        </h2>

        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 480, damping: 28 }}
          className="inline-flex size-12 shrink-0 items-center justify-center text-foreground @media (max-width: 500px) { size-2 }"
        >
          {isOpen ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 2"
              fill="none"
              aria-hidden
            >
              <path
                d="M1 1h12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M7 1v12M1 7h12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          )}
        </motion.span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={itemId}
        animate={{
          height: isOpen ? contentH : 0,
          opacity: isOpen ? 1 : 0,
        }}
        initial={false}
        transition={{
          height: { type: "spring", stiffness: 340, damping: 34, mass: 0.9 },
          opacity: { duration: 0.2, ease: "easeOut" },
        }}
        style={{ overflow: "hidden" }}
      >
        <motion.div
          ref={contentRef}
          animate={{ y: isOpen ? 0 : -8 }}
          transition={{
            type: "spring",
            stiffness: 360,
            damping: 30,
            mass: 0.8,
          }}
          className="px-7 pb-7"
        >
          <p className="font-body text-md leading-8 tracking-normal text-foreground/75 max-[500px]:text-sm max-[500px]:leading-normal">
            {item.answer}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function MotionAccordion({ items, gap = 10, className, onAccordionHeightChange }) {
  const rawId = React.useId();
  const baseId = `accordion-${rawId.replace(/:/g, "")}`;

  const [openIndexes, setOpenIndexes] = React.useState([]);

  const toggle = (i) =>
    setOpenIndexes((prev) =>
      prev.includes(i) ? prev.filter((index) => index !== i) : [...prev, i],
    );

  const itemHeights = React.useRef({});

  const handleItemMeasure = React.useCallback(
    (index, height) => {
      itemHeights.current[index] = height;

      const nextHeight = items.reduce((total, _, itemIndex) => {
        const isActive = openIndexes.includes(itemIndex);
        return total + (isActive ? itemHeights.current[itemIndex] ?? 0 : 0);
      }, 0);

      onAccordionHeightChange?.(nextHeight);
    },
    [items, openIndexes, onAccordionHeightChange],
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col rounded-[50px] p-1 " style={{ gap }}>
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            isOpen={openIndexes.includes(i)}
            onToggle={() => toggle(i)}
            itemId={`${baseId}-trigger-${i}`}
            panelId={`${baseId}-panel-${i}`}
            onMeasure={(height) => handleItemMeasure(i, height)}
          />
        ))}
      </div>
    </div>
  );
}