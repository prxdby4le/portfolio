import React from 'react';
import AsciiText from './AsciiText.jsx';
import BlurText from './BlurText.jsx';

export default function AboutSection(){
	return (
		<section style={{ maxWidth:880, margin:'0 auto', padding:'3rem 1.2rem 3.5rem', lineHeight:1.55 }}>
			<div style={{ textAlign:'center', marginBottom:'2.4rem' }}>
				<AsciiText text="SOBRE" />
			</div>
			<p style={{ margin:'0 0 1.4rem', fontSize:'clamp(.9rem,1.05vw,1rem)', opacity:.82 }}>
				<BlurText text="Explorando música, estética e código para criar experiências audiovisuais." />
			</p>
			<div style={{ display:'grid', gap:'1.6rem', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', marginTop:'2.2rem' }}>
				{[
					{ t:'Stack Criativo', d:'DAWs, synths virtuais, Three.js, shaders, motion design' },
					{ t:'Foco', d:'Narrativas sensoriais combinando ritmo, textura e luz' },
					{ t:'Processo', d:'Iteração rápida + prototipação visual + experimentação sonora' },
					{ t:'Objetivo', d:'Transpor identidade sonora para paisagens visuais reativas' }
				].map(card=> (
					<div key={card.t} className="fg-glass" style={{ padding:'1.1rem 1rem 1.2rem' }}>
						<strong style={{ fontSize:'.72rem', letterSpacing:'.6px', opacity:.75, textTransform:'uppercase' }}>{card.t}</strong>
						<p style={{ margin:'.55rem 0 0', fontSize:'.76rem', lineHeight:1.4, opacity:.72 }}>{card.d}</p>
					</div>
				))}
			</div>
		</section>
	);
}
