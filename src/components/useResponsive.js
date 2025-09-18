import { useState, useEffect } from 'react';

// Breakpoint definitions
const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
  wide: 1400
};

export function useBreakpoint() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight 
      ? 'landscape' 
      : 'portrait'
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoint helpers
  const isMobile = screenSize.width < breakpoints.mobile;
  const isTablet = screenSize.width >= breakpoints.mobile && screenSize.width < breakpoints.tablet;
  const isDesktop = screenSize.width >= breakpoints.tablet && screenSize.width < breakpoints.desktop;
  const isWide = screenSize.width >= breakpoints.desktop;
  
  // Combined helpers
  const isMobileOrTablet = screenSize.width < breakpoints.tablet;
  const isDesktopOrWide = screenSize.width >= breakpoints.tablet;

  return {
    // Screen dimensions
    width: screenSize.width,
    height: screenSize.height,
    
    // Orientation
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    
    // Breakpoint flags
    isMobile,
    isTablet,  
    isDesktop,
    isWide,
    
    // Combined flags
    isMobileOrTablet,
    isDesktopOrWide,
    
    // Breakpoint values
    breakpoints
  };
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// Predefined media queries
export function useResponsiveQueries() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobile - 1}px)`);
  const isTablet = useMediaQuery(`(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`);
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`);
  const isWide = useMediaQuery(`(min-width: ${breakpoints.desktop}px)`);
  
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isHighDPI = useMediaQuery('(min-resolution: 2dppx)');

  return {
    isMobile,
    isTablet,
    isDesktop, 
    isWide,
    prefersReducedMotion,
    prefersDarkMode,
    isHighDPI
  };
}

export default useBreakpoint;
