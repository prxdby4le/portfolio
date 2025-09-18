import React from 'react';
import styles from './ContactSection.module.css';

export function ContactSection(){
  const socials = [
    {label:'Instagram', href:'https://www.instagram.com/prxdby4le/'},
    {label:'Twitter (X)', href:'https://x.com/prxdby4le'},
    {label:'YouTube (o violino)', href:'https://www.youtube.com/@oviolino'},
    {label:'YouTube (prxdby4le)', href:'https://www.youtube.com/@prxdby4le'}
  ];
  return (
    <section className={styles.section}>
      <h2 style={{marginTop:0}}>Contato</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Email</h3>
          <a href="mailto:kleber0611@gmail.com" className={styles.link}>kleber0611@gmail.com</a>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Social</h3>
          <div className={styles.socials}>
            {socials.map(s=> <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={styles.link}>{s.label}</a>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
