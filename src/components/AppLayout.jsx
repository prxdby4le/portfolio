import React, { useState, useEffect } from 'react';
import NavBar from './NavBar.jsx';
import Hero from './Hero.jsx';
import MusicSection from './MusicSection.jsx';
import VisualSection from './VisualSection.jsx';
import AboutSection from './AboutSection.jsx';
import ContactSection from './ContactSection.jsx';
import BackgroundCanvas from './BackgroundCanvas.jsx';
import BlurText from './BlurText.jsx';
import ScrollMarquee from './ScrollMarquee.jsx';
import PlaylistModal from './PlaylistModal.jsx';
import PageTransition from './PageTransition.jsx';

// Layout principal com navegação simples entre seções
export default function AppLayout(){
	const [view, setView] = useState('home');
	const order = ['home','music','visual','about','contact'];
	const [prev,setPrev] = useState('home');
	useEffect(()=>{
		const saved = localStorage.getItem('app-view');
		if(saved) setView(saved);
	},[]);
	const handleNavigate = (id)=> { setPrev(view); setView(id); localStorage.setItem('app-view', id); };
	const enterFromHero = (section)=> handleNavigate(section);

	return (
			<div style={{ position:'relative', zIndex:0 }}>
				<a href="#main" className="skip-link">Pular para conteúdo</a>
				<BackgroundCanvas />
				<div style={{ padding:'1.25rem 1.4rem 3rem', maxWidth:1400, margin:'0 auto', position:'relative', zIndex:1 }}>
			<header style={{ marginBottom:'1.2rem' }}>
				<NavBar onNavigate={handleNavigate} current={view} />
			</header>
			<main id="main">
			<PageTransition direction={ order.indexOf(view) > order.indexOf(prev) ? 1 : -1 }>
			{view === 'home' && (
				<div style={{ display:'flex', flexDirection:'column', gap:'3rem' }}>
					<div style={{ textAlign:'center' }}>
						<h1 style={{ margin:'0 0 .55rem', fontSize:'clamp(3.2rem,8vw,5rem)', fontWeight:650, lineHeight:1.03, letterSpacing:'-.5px' }}>
							<BlurText text="prxdby4le" as="span" />
						</h1>
					</div>
					<Hero onEnter={enterFromHero} />
				</div>
			)}
			{view === 'music' && <MusicSection />}
			{view === 'visual' && <VisualSection />}
			{view === 'about' && <AboutSection />}
			{view === 'contact' && <ContactSection />}
			</PageTransition>
			</main>
					<footer style={{ marginTop:'4rem', textAlign:'center', fontSize:'.7rem', opacity:.55 }}>
						<div className="fg-divider" />
						<ScrollMarquee items={["retro-future","glass audio ui","creative coding","signal flow","shader vibes","lofi energy","hybrid mixing"]} />
						<span>© {new Date().getFullYear()} prxdby4le • experimental portfolio build</span>
					</footer>
					<PlaylistModal />
					</div>
		</div>
	);
}
