"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  // ms — for staggering siblings (grid items, list rows) without each one
  // needing its own Tailwind delay-* class.
  delay?: number;
  // px slid up from. 0 keeps it a plain fade.
  offset?: number;
};

// Fade/slide-up triggered by scroll position instead of mount time. The
// `animate-in ... fill-mode-both` classes used elsewhere play once when the
// component mounts regardless of whether it's on screen, so anything below
// the fold has already finished animating by the time it's scrolled to —
// this fires once per element via IntersectionObserver instead, the first
// time it actually enters the viewport, then stays revealed.
export default function Reveal({ children, className, delay = 0, offset = 16 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // True for anything already on screen at mount (typically the first row
  // of cards) — those skip the CSS transition entirely and just appear,
  // rather than relying on a transition that occasionally never finishes
  // playing (leaving the element stuck part-faded) when it's triggered
  // essentially the instant the observer starts watching it.
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyInView) {
      const timer = setTimeout(() => {
        setInstant(true);
        setVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        instant ? "" : "transition-all duration-700 ease-out",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
