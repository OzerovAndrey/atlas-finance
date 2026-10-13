import { useEffect, useRef, useState } from "react";

/** Width of an element, updated on resize (charts draw to their container). */
export function useWidth<T extends HTMLElement>(fallback = 320) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(
      ([e]) => e && setWidth(Math.max(120, Math.round(e.contentRect.width))),
    );
    ro.observe(el);
    setWidth(Math.max(120, Math.round(el.getBoundingClientRect().width)));
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}
