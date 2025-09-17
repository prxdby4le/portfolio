import React from 'react';

export function Hero({ onEnter }) {
  return (
    <section style={{padding:'4rem 1.5rem', textAlign:'center'}}>
      <h2 style={{fontSize:'2.2rem', marginBottom:'1rem'}}>Escolha o que quer ver</h2>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'1.5rem',maxWidth:1000,margin:'0 auto'}}>
        <Card title="Produção Musical" img="assets/images/flsudio.png" onClick={()=>onEnter('music')} />
        <Card title="Visualizers" img="assets/images/aftereffects.png" onClick={()=>onEnter('visual')} />
      </div>
    </section>
  );
}

function Card({ title, img, onClick }) {
  return (
    <div onClick={onClick} style={{cursor:'pointer',width:260,background:'rgba(255,255,255,0.03)',padding:'1.5rem',border:'1px solid rgba(255,255,255,0.08)',borderRadius:18,transition:'0.3s',backdropFilter:'blur(4px)'}}>
      <div style={{height:80,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src={img} alt={title} style={{maxHeight:70}} />
      </div>
      <h3 style={{margin:'1rem 0 0.5rem',fontSize:'1.1rem'}}>{title}</h3>
      <p style={{fontSize:'.85rem',color:'#aaa'}}>Clique para explorar</p>
    </div>
  );
}

export default Hero;
