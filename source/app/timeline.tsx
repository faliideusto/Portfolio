'use client';

import { useEffect, useRef } from 'react';

type Step = {year:string; title:string; place:string; text:string};

// Newest first, like a CV: the rail fills downwards as the visitor scrolls back in time.
const steps: Step[] = [
  {year:'Ahora', title:'Prácticas de DAW', place:'Buscando equipo', text:'He terminado la formación académica de DAW y busco empresa para las prácticas o un primer empleo donde seguir aprendiendo con proyectos reales.'},
  {year:'2024–2026', title:'Técnico Superior en DAW', place:'IES Romero Vargas · ILERNA', text:'Desarrollo de Aplicaciones Web: el primer curso en el IES Romero Vargas y el segundo en ILERNA. Mi proyecto final fue PadelBracket.'},
  {year:'2022–2023', title:'Cursos de Python y Java', place:'Aprendizaje autodidacta', text:'Primeros pasos en programación por mi cuenta, con cursos online de Python y Java, antes de dar el salto a la formación reglada.'},
  {year:'2021', title:'Starbucks, aeropuerto de Dublín', place:'Barista y responsable de equipo', text:'Ocho meses en Irlanda para mejorar el inglés: cuatro como barista y cuatro al frente del equipo, trabajando íntegramente en inglés.'},
  {year:'2020', title:'Ingeniería Electrónica', place:'Donde descubrí la programación', text:'Empecé la carrera y la dejé porque no era lo mío, pero allí descubrí que lo que de verdad me gustaba era programar.'},
  {year:'2018–2020', title:'Bachillerato Tecnológico', place:'IES Santa Isabel de Hungría', text:'Mi base en matemáticas, física y tecnología.'},
];

export function EducationTimeline() {
  const list = useRef<HTMLOListElement>(null);

  // Each row fills its own stretch of the rail, so the glowing tip travels down the list with the scroll.
  useEffect(()=>{
    const rows = [...(list.current?.children ?? [])] as HTMLElement[];
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){rows.forEach(r=>{r.style.setProperty('--fill','1');r.classList.add('is-lit')});return}
    let frame = 0;
    const update = ()=>{
      frame = 0;
      const anchor = window.innerHeight*0.55;
      rows.forEach(r=>{
        const box = r.getBoundingClientRect();
        const fill = Math.min(1,Math.max(0,(anchor - box.top)/box.height));
        r.style.setProperty('--fill',fill.toFixed(3));
        r.classList.toggle('is-lit',fill>=0.5);
        r.classList.toggle('is-current',fill>0 && fill<1);
      });
    };
    const onScroll = ()=>{if(!frame)frame = requestAnimationFrame(update)};
    update();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
    return ()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(frame)};
  },[]);

  return <div className="timeline">
    <div className="timeline-head" data-reveal><span className="eyebrow">FORMACIÓN Y TRAYECTORIA</span><h3>Mi camino<br/><em>hasta aquí.</em></h3></div>
    <ol className="timeline-list" ref={list}>
      {steps.map(step=><li className="timeline-row" key={step.title}>
        <div className="timeline-title"><h4>{step.title}</h4><span>{step.place}</span></div>
        <span className="timeline-year">{step.year}</span>
        <span className="timeline-rail" aria-hidden="true"><i/><b/></span>
        <p className="timeline-text">{step.text}</p>
      </li>)}
    </ol>
    <div className="timeline-languages"><span>IDIOMAS</span><p>Español: nativo · Inglés: B1 (Cambridge English) · Experiencia profesional trabajando íntegramente en inglés en Dublín.</p></div>
  </div>;
}
