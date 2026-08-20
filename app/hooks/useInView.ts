import { useEffect, useRef, useState } from "react";

/**
 * React hook that reports whether a DOM element has scrolled into (or near)
 * the viewport, using the native IntersectionObserver API.
 *
 * This is intended for lazy-loading expensive, one-time third-party
 * embeds (e.g. Google Maps), so once the element has been observed as
 * visible, observation stops permanently -- the returned boolean will
 * never flip back to `false`. This is not meant for continuously tracking
 * visibility (e.g. for animations that should replay every time an
 * element scrolls into view).
 *
 * In environments without IntersectionObserver support, the hook
 * immediately reports `true` so consumers never get stuck waiting on
 * unsupported platforms.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = {}
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const { root, rootMargin, threshold } = options;

  useEffect(() => {
    if (isInView) {
      return undefined;
    }

    const node = ref.current;
    if (!node) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, root, rootMargin, threshold]);

  return [ref, isInView];
}
