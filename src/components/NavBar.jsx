import React from 'react';

export function NavBar({ onNavigate, current }) {
  const links = [
    {id:'home', label:'Home'},
    {id:'music', label:'Produção'},
    {id:'visual', label:'Visual'},
    {id:'about', label:'Sobre'},
    {id:'contact', label:'Contato'}
  ];
  return (
    <nav style={{display:'flex',gap:'1rem',padding:'1rem 1.5rem',borderBottom:'1px solid #222',backdropFilter:'blur(8px)'}}>
      <strong style={{color:'#4ecdc4'}}>prxdby4le</strong>
      {links.map(l=> (
        <button key={l.id} onClick={()=>onNavigate(l.id)} style={{
          background:'none',border:'none',cursor:'pointer',color: current===l.id? '#4ecdc4':'#bbb',
          fontWeight: current===l.id?600:400
        }}>{l.label}</button>
      ))}
    </nav>
  );
}

export default NavBar;
