import React, { useEffect } from 'react';
import './clickspark.css';

// ClickSpark: cria pequenas faíscas na posição do clique
export default function ClickSpark(){
  useEffect(()=>{
    const spawn = (e)=>{
      const container = document.createElement('div');
      container.className='cs-container';
      container.style.left = e.clientX + 'px';
      container.style.top = e.clientY + 'px';
      for(let i=0;i<8;i++){
        const p=document.createElement('span');
        p.className='cs-spark';
        p.style.setProperty('--cs-angle', (360/8)*i + 'deg');
        container.appendChild(p);
      }
      document.body.appendChild(container);
      setTimeout(()=> container.remove(), 900);
    };
    window.addEventListener('click', spawn);
    return ()=> window.removeEventListener('click', spawn);
  },[]);
  return null;
}
