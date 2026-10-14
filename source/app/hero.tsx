'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDown, DownloadSimple as Download, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';
import { techs } from './skills';

function SplitName({text}:{text:string}){return <>{[...text].map((ch,i)=><span className="char" style={{'--i':i} as CSSProperties} key={i}>{ch}</span>)}</>}

const stats = [
  {value:4, label:'proyectos reales', href:'#proyectos'},
  {value:3, label:'demos en vivo', href:'#proyectos'},
  {value:techs.length, label:'tecnologías en uso', href:'#tecnologias'},
  {value:25, label:'minijuegos en MaxiJuegos', href:'#maxijuegos'},
];

// Numbers count up once the hero has finished assembling.
function useCountUp(target:number, delay:number){
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [value,setValue] = useState(reduced ? target : 0);
  useEffect(()=>{
    if(reduced)return;
    let frame = 0, start = 0;
    const step = (t:number)=>{
      start ||= t;
      const p = Math.min(1,(t-start)/1400);
      setValue(Math.round(target*(1-Math.pow(1-p,3))));
      if(p<1)frame = requestAnimationFrame(step);
    };
    const timer = setTimeout(()=>{frame = requestAnimationFrame(step)},delay);
    return ()=>{clearTimeout(timer);cancelAnimationFrame(frame)};
  },[target,delay,reduced]);
  return value;
}

function Stat({value,label,href,index}:{value:number;label:string;href:string;index:number}){
  const shown = useCountUp(value,1300+index*120);
  return <li><a href={href}><b aria-hidden="true">{shown}</b><span className="sr-only">{value} </span><span>{label}</span></a></li>;
}

export function Hero({cvUrl}:{cvUrl:string}){
  return <section className="hero" id="inicio">
    <div className="hero-glow" aria-hidden="true"/>
    <div className="hero-grid">
      <div className="hero-main">
        <div className="hero-top"><span className="availability"><i aria-hidden="true"/>Disponible para prácticas y primer empleo</span><span className="hero-place">Jerez, España</span></div>
        <h1 className="hero-name" aria-label="Rafael Deusto"><span className="name-line" aria-hidden="true"><SplitName text="RAFAEL"/></span><span className="name-line" aria-hidden="true"><SplitName text="DEUSTO"/></span></h1>
        <p className="hero-lead"><b>Desarrollador web junior.</b> Construyo aplicaciones completas, del servidor a la interfaz.</p>
        <p className="hero-copy">Un juego online con motor en Java, la web de mi equipo de pádel en Next.js, torneos en Django y un party game en Godot que puedes jugar aquí. Acabo de terminar DAW y busco mi primer equipo.</p>
        <div className="hero-actions">
          <a className="pill light" href={cvUrl} download>Descargar CV <Download size={18}/></a>
          <a className="pill ghost" href="#proyectos">Ver proyectos <ArrowDown size={18}/></a>
          <span className="hero-social">
            <a href="https://github.com/faliideusto" target="_blank" rel="noreferrer" aria-label="GitHub de Rafael Deusto"><GithubLogo size={22}/></a>
            <a href="https://www.linkedin.com/in/rafael-deusto-966447296/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Rafael Deusto"><LinkedinLogo size={22}/></a>
          </span>
        </div>
      </div>
      <figure className="hero-photo">
        <div className="hero-photo-frame"><img src={`${import.meta.env.BASE_URL}img/fotoperfil.jpg`} alt="Rafael Deusto Espinosa" width="1080" height="1346" fetchPriority="high"/></div>
        <figcaption className="hero-now"><i aria-hidden="true"/><span><small>AHORA MISMO</small>Tesis, un juego de cartas online en Java</span></figcaption>
        <span className="hero-badge" aria-hidden="true"><svg viewBox="0 0 100 100"><path id="hero-badge-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" fill="none"/><text><textPath href="#hero-badge-path" textLength="230" lengthAdjust="spacing">DESARROLLADOR WEB · JUNIOR · </textPath></text></svg><b>✳</b></span>
      </figure>
    </div>
    <ul className="hero-stats" aria-label="En cifras">{stats.map((s,i)=><Stat key={s.label} index={i} {...s}/>)}</ul>
  </section>
}

// Every technology from the skills section, in two rows that drift in opposite directions.
export function TechRibbon(){
  const half = Math.ceil(techs.length/2);
  const rows = [techs.slice(0,half), techs.slice(half)];
  return <div className="tech-ribbon" role="img" aria-label={`Tecnologías: ${techs.map(t=>t.name).join(', ')}`}>
    {rows.map((row,r)=><div className={`tech-track${r?' is-reverse':''}`} key={r} aria-hidden="true">
      {[0,1].map(copy=><div className="tech-set" key={copy}>{row.map(tech=><span key={tech.name} style={{'--c':tech.color} as CSSProperties}><em>{tech.icon}</em>{tech.name}</span>)}</div>)}
    </div>)}
  </div>
}
