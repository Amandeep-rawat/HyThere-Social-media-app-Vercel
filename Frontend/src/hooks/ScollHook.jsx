import { useEffect } from 'react';

export const useScrollRestoration = () => {
  useEffect(() => {
    // Save scroll position
    const scrollPosition = window.scrollY;
    window.sessionStorage.setItem("scrollPosition", scrollPosition);

    return () => {
      // Restore scroll position if available
      const savedPosition = window.sessionStorage.getItem("scrollPosition");
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    };
  }, []);
};
