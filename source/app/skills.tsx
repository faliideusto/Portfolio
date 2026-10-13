'use client';

import { useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { ArrowUpRight, Coffee, OpenAiLogo, TestTube } from '@phosphor-icons/react';
import {
  siApachemaven, siAstro, siClaude, siCss, siDjango, siDocker, siGit, siGithub, siGodotengine,
  siHtml5, siJavascript, siJunit5, siMysql, siNextdotjs, siNodedotjs, siPnpm, siPostgresql, siPython, siReact,
  siRender, siSupabase, siTailwindcss, siTypescript, siVercel, siVite,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

type Category = 'frontend' | 'backend' | 'datos' | 'juegos' | 'calidad' | 'flujo';
type Tech = {name: string; category: Category; color: string; icon: ReactNode; usedIn: string};

// Brand marks that are black or near-black would vanish on the dark section, so they use the page foreground.
function Brand({icon, color}: {icon: SimpleIcon; color?: string}) {
  return <svg viewBox="0 0 24 24" role="img" aria-hidden="true" fill={color ?? `#${icon.hex}`}><path d={icon.path}/></svg>;
}
const brand = (icon: SimpleIcon, light = false) => ({color: light ? 'var(--foreground)' : `#${icon.hex}`, icon: <Brand icon={icon} color={light ? 'currentColor' : undefined}/>});

// Each entry is used in at least one real project (checked against the project repositories).
const techs: Tech[] = [
  {name:'React', category:'frontend', usedIn:'Fito Raya · Portfolio', ...brand(siReact)},
  {name:'TypeScript', category:'frontend', usedIn:'Fito Raya · Aerointer · Portfolio', ...brand(siTypescript)},
  {name:'JavaScript', category:'frontend', usedIn:'Tesis · PadelBracket', ...brand(siJavascript)},
  {name:'Next.js', category:'frontend', usedIn:'Fito Raya', ...brand(siNextdotjs, true)},
  {name:'Astro', category:'frontend', usedIn:'Aerointer', ...brand(siAstro)},
  {name:'Vite', category:'frontend', usedIn:'Portfolio', ...brand(siVite)},
  {name:'Tailwind CSS', category:'frontend', usedIn:'Fito Raya · Portfolio', ...brand(siTailwindcss)},
  {name:'HTML', category:'frontend', usedIn:'Todos los proyectos web', ...brand(siHtml5)},
  {name:'CSS', category:'frontend', usedIn:'Todos los proyectos web', color:'#7d5bd6', icon:<Brand icon={siCss} color="#7d5bd6"/>},
  {name:'Java', category:'backend', usedIn:'Tesis', color:'#f89820', icon:<Coffee weight="fill"/>},
  {name:'Python', category:'backend', usedIn:'PadelBracket', ...brand(siPython)},
  {name:'Django', category:'backend', usedIn:'PadelBracket', color:'#44b78b', icon:<Brand icon={siDjango} color="#44b78b"/>},
  {name:'Node.js', category:'backend', usedIn:'Fito Raya', ...brand(siNodedotjs)},
  {name:'Maven', category:'backend', usedIn:'Tesis', ...brand(siApachemaven)},
  {name:'Supabase', category:'datos', usedIn:'Tesis · Fito Raya', ...brand(siSupabase)},
  {name:'PostgreSQL', category:'datos', usedIn:'Tesis · Fito Raya', color:'#6b9cf0', icon:<Brand icon={siPostgresql} color="#6b9cf0"/>},
  {name:'MySQL', category:'datos', usedIn:'PadelBracket', color:'#5e9fd6', icon:<Brand icon={siMysql} color="#5e9fd6"/>},
  {name:'Godot', category:'juegos', usedIn:'MaxiJuegos', ...brand(siGodotengine)},
  {name:'GDScript', category:'juegos', usedIn:'MaxiJuegos · 24 minijuegos', color:'#8fc1e6', icon:<Brand icon={siGodotengine} color="#8fc1e6"/>},
  {name:'JUnit', category:'calidad', usedIn:'Tesis', ...brand(siJunit5)},
  {name:'Playwright', category:'calidad', usedIn:'Tesis · Fito Raya', color:'#2ead33', icon:<TestTube weight="fill"/>},
  {name:'Docker', category:'calidad', usedIn:'Tesis', ...brand(siDocker)},
  {name:'Render', category:'calidad', usedIn:'Tesis · Fito Raya', ...brand(siRender, true)},
  {name:'Vercel', category:'calidad', usedIn:'Fito Raya', ...brand(siVercel, true)},
  {name:'Git', category:'flujo', usedIn:'Todos los proyectos', ...brand(siGit)},
  {name:'GitHub', category:'flujo', usedIn:'Todos los proyectos', ...brand(siGithub, true)},
  {name:'pnpm', category:'flujo', usedIn:'Fito Raya', ...brand(siPnpm)},
  {name:'Claude Code', category:'flujo', usedIn:'MaxiJuegos · Portfolio', ...brand(siClaude)},
  {name:'Codex', category:'flujo', usedIn:'Tesis · Fito Raya', color:'var(--foreground)', icon:<OpenAiLogo weight="fill"/>},
];

const categories: {id: Category | 'todo'; label: string}[] = [
  {id:'todo', label:'Todo'},
  {id:'frontend', label:'Frontend'},
  {id:'backend', label:'Backend'},
  {id:'datos', label:'Datos'},
  {id:'juegos', label:'Videojuegos'},
  {id:'calidad', label:'Pruebas y despliegue'},
  {id:'flujo', label:'Flujo e IA'},
];

const orbitInner = [siReact, siTypescript, siPython, siSupabase].map(icon => brand(icon));
const orbitOuter = [
  {color:'#f89820', icon:<Coffee weight="fill"/>}, brand(siNextdotjs, true), brand(siGodotengine),
  brand(siDocker), brand(siAstro), brand(siJavascript),
];

// Rotating rings of the main tools; the icons counter-rotate so they stay upright.
function Orbit() {
  const ring = (items: {color: string; icon: ReactNode}[], name: string) =>
    <div className={`orbit-ring ${name}`}>{items.map((item, i) =>
      <span className="orbit-icon" key={i} style={{'--a':`${(360 / items.length) * i}deg`, '--c':item.color} as CSSProperties}><span>{item.icon}</span></span>)}</div>;
  return <div className="orbit" aria-hidden="true">
    <div className="orbit-core"><b>{techs.length}</b><span>tecnologías<br/>en uso</span></div>
    {ring(orbitInner, 'inner')}
    {ring(orbitOuter, 'outer')}
  </div>;
}

function TechCard({tech, index}: {tech: Tech; index: number}) {
  // The glow follows the pointer inside the card.
  const track = (e: PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return <li className="tech-card" style={{'--c':tech.color, '--i':index} as CSSProperties} onPointerMove={track}>
    <span className="tech-icon">{tech.icon}</span>
    <span className="tech-name">{tech.name}</span>
    <span className="tech-used">{tech.usedIn}</span>
  </li>;
}

export function SkillsSection() {
  const [filter, setFilter] = useState<Category | 'todo'>('todo');
  const shown = filter === 'todo' ? techs : techs.filter(t => t.category === filter);
  return <section className="skills" id="tecnologias">
    <div className="section-head skills-head" data-reveal>
      <div><span className="eyebrow">03 / HERRAMIENTAS Y APRENDIZAJE</span><h2>Mi caja<br/>de herramientas.</h2><p className="skills-intro">Las tecnologías que uso en mis proyectos reales, de la interfaz al despliegue. Cada una indica dónde la he aplicado.</p></div>
      <Orbit/>
    </div>
    <div className="tech-explorer" data-reveal>
      <div className="tech-filters" role="group" aria-label="Filtrar tecnologías por área">
        {categories.map(c => {
          const count = c.id === 'todo' ? techs.length : techs.filter(t => t.category === c.id).length;
          return <button type="button" key={c.id} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}<span>{count}</span></button>;
        })}
      </div>
      <ul className="tech-grid" key={filter} aria-live="polite">{shown.map((tech, i) => <TechCard tech={tech} index={i} key={tech.name}/>)}</ul>
    </div>
    <div className="learning-grid"><div data-reveal><span className="eyebrow">FORMACIÓN</span><h3>Desarrollo de<br/>Aplicaciones Web</h3><p className="learning-date">2024–2026</p><p>IES Romero Vargas · 2024–2025<br/>ILERNA · 2025–2026</p><p className="status">Formación académica completada · prácticas pendientes</p></div><div data-reveal><span className="eyebrow">APRENDIZAJE CONTINUO</span><h3>La curiosidad<br/>sigue abierta.</h3><p>Cursos de Java y Python · 2022–2024</p><a className="course-link" href="https://www.youtube.com/watch?v=XcUOWCXP5u8" target="_blank" rel="noreferrer">Curso de Codex y agentes de IA <ArrowUpRight size={16}/></a><p className="course-meta">Formación online · Benjamín Cordero</p><div className="languages"><span>IDIOMAS</span><p>Español: nativo · Inglés: B1 certificado</p><p>Experiencia profesional trabajando íntegramente en inglés en Dublín.</p></div></div></div>
  </section>;
}
