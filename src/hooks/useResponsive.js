import { useState, useEffect } from 'react';

const breakpoints = {
	mobile: 768,
	tablet: 1024,
	desktop: 1200,
	wide: 1400
};

export function useBreakpoint() {
	const [dims, setDims] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 1200,
		height: typeof window !== 'undefined' ? window.innerHeight : 800
	});
	const [orientation, setOrientation] = useState(
		typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
	);

	useEffect(() => {
		const onResize = () => {
			setDims({ width: window.innerWidth, height: window.innerHeight });
			setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
		};
		window.addEventListener('resize', onResize);
		onResize();
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const { width } = dims;
	const isMobile = width < breakpoints.mobile;
	const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;
	const isDesktop = width >= breakpoints.tablet && width < breakpoints.desktop;
	const isWide = width >= breakpoints.desktop;

	return {
		width: dims.width,
		height: dims.height,
		orientation,
		isLandscape: orientation === 'landscape',
		isPortrait: orientation === 'portrait',
		isMobile,
		isTablet,
		isDesktop,
		isWide,
		isMobileOrTablet: isMobile || isTablet,
		isDesktopOrWide: isDesktop || isWide,
		breakpoints
	};
}

export function useMediaQuery(query) {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia(query);
		const handler = () => setMatches(mq.matches);
		handler();
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, [query]);
	return matches;
}

export function useResponsiveQueries() {
	const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobile - 1}px)`);
	const isTablet = useMediaQuery(`(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`);
	const isDesktop = useMediaQuery(`(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`);
	const isWide = useMediaQuery(`(min-width: ${breakpoints.desktop}px)`);
	const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const isHighDPI = useMediaQuery('(min-resolution: 2dppx)');
	return { isMobile, isTablet, isDesktop, isWide, prefersReducedMotion, prefersDarkMode, isHighDPI };
}

export default useBreakpoint;
