import { useState, useEffect } from 'react';

/**
 * Enterprise viewport responsive breakpoint hook
 * Breakpoint scale:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Laptop: 1024px - 1439px (e.g. 1366x768)
 * - Desktop: 1440px - 2559px (e.g. 1920x1080)
 * - 4K / Ultrawide: >= 2560px
 */
export function useBreakpoint() {
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200;
  });

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      // Debounce slightly for buttery-smooth render performance
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    width: windowWidth,
    isMobile: windowWidth < 768,
    isTablet: windowWidth >= 768 && windowWidth < 1024,
    isLaptop: windowWidth >= 1024 && windowWidth < 1440,
    isDesktop: windowWidth >= 1440 && windowWidth < 2560,
    is4K: windowWidth >= 2560,
    isTouchDevice: typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  };
}

export default useBreakpoint;
