'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ShotReel, type Shot } from './shot-reel';
import { ArrowsOut, ArrowUpRight, Check, Code as CodeXml, Copy, DownloadSimple as Download, EnvelopeSimple as Mail, Play, ShareNetwork, X } from '@phosphor-icons/react';
import { Brand, SkillsSection, techs } from './skills';
import { siApple, siGithubactions, siWebassembly } from 'simple-icons';
import { CursorCircle } from './cursor';
import { Hero, TechRibbon } from './hero';

const CV_URL = `${import.meta.env.BASE_URL}assets/Rafael-Deusto-CV.pdf`;
const EMAIL = 'radeusto@gmail.com';
// Demos on Render's free plan sleep when idle; pinging them on load gets them waking up before the visitor clicks.
const SLEEPING_DEMOS = ['https://tesis-dm5l.onrender.com/'];
const demoNote = <p className="demo-note">Servidor gratuito: la primera carga puede tardar hasta un minuto.</p>;

function CopyEmail(){
  const [copied,setCopied] = useState(false);
  const copy = ()=>navigator.clipboard?.writeText(EMAIL).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}).catch(()=>{});
  return <button className="copy-email" type="button" onClick={copy} aria-live="polite">{copied?<><Check size={18}/> Correo copiado</>:<><Copy size={18}/> Copiar correo</>}</button>
}
const navLinks = [
  {id:'proyectos',label:'Proyectos'},
  {id:'sobre-mi',label:'Sobre mí'},
  {id:'tecnologias',label:'Herramientas'},
  {id:'contacto',label:'Contacto'},
];
const tagline = 'Me gusta entender cómo funcionan las cosas y convertir ese aprendizaje en aplicaciones que se puedan usar.';



// What each project touches: the overview map and each card's breakdown share these areas.
const areas = {
  ui:{label:'Interfaz',short:'UI'},
  server:{label:'Servidor y API',short:'API'},
  data:{label:'Datos y cuentas',short:'BD'},
  realtime:{label:'Multijugador',short:'RED'},
  bots:{label:'Bots e IA',short:'IA'},
  integration:{label:'Integraciones',short:'INT'},
  quality:{label:'Tests y CI',short:'QA'},
  deploy:{label:'Despliegue',short:'OPS'},
} as const;
type Area = keyof typeof areas;
type Use = {tech:string;use:string};
type ProjectSummary = {id:string;number:string;name:string;areas:Area[];stack:Use[]};

// Each use was checked against the project's repository.
const projectMap:ProjectSummary[] = [
  {id:'fito-raya',number:'01',name:'Escuela Fito Raya',areas:['ui','server','data','integration','quality','deploy'],stack:[
    {tech:'Next.js',use:'La web y su servidor: páginas de cada equipo y rutas API que leen la competición con caché.'},
    {tech:'React',use:'La interfaz, como el laboratorio para arrastrar jugadores y montar las parejas de cada jornada.'},
    {tech:'TypeScript',use:'Tipos para los datos de la federación y para las reglas de puntuación de cada encuentro.'},
    {tech:'Tailwind CSS',use:'Los estilos de toda la web, adaptada a móvil.'},
    {tech:'Supabase',use:'Cuentas de jugadores, alineaciones guardadas, MVP del mes y la caché compartida entre servidores.'},
    {tech:'Playwright',use:'Inicia sesión en la web de Series Nacionales de Pádel para leer clasificaciones, actas y plantillas.'},
    {tech:'Apple Wallet',use:'Un pase con tu convocatoria que se actualiza solo y aparece en la pantalla de bloqueo el día del partido.'},
    {tech:'GitHub Actions',use:'Lint, tipos, tests y build automáticos en cada cambio.'},
    {tech:'Vercel',use:'Despliegue de la web.'},
  ]},
  {id:'tesis',number:'02',name:'Tesis',areas:['ui','server','data','realtime','bots','quality','deploy'],stack:[
    {tech:'Java',use:'El motor de reglas y un servidor HTTP propio con salas, turnos y los patrones State, Command, Strategy y Observer.'},
    {tech:'Maven',use:'Compila el proyecto, gestiona las dependencias y lanza los tests.'},
    {tech:'JavaScript',use:'La interfaz del navegador sin frameworks: mesa, mano privada, diálogos y animaciones.'},
    {tech:'Supabase',use:'Cuentas opcionales: perfil con niveles, amigos, ranking global y misiones.'},
    {tech:'JUnit',use:'Tests del motor con partidas completas de 3 a 5 jugadores.'},
    {tech:'Playwright',use:'QA de la interfaz con varios jugadores en navegadores distintos, también en móvil.'},
    {tech:'Docker',use:'Imagen del servidor para desplegarlo en Render.'},
  ]},
  {id:'padelbracket',number:'03',name:'PadelBracket',areas:['ui','server','data'],stack:[
    {tech:'Python',use:'La lógica del torneo: inscripciones, cuadro de eliminatorias y avance de los ganadores.'},
    {tech:'Django',use:'El servidor, las cuentas de jugador y organizador con permisos distintos, y las plantillas de las páginas.'},
    {tech:'MySQL',use:'Base de datos de usuarios, parejas, torneos y resultados.'},
    {tech:'JavaScript',use:'Interacción en el navegador para seguir el cuadro y los resultados.'},
  ]},
  {id:'maxijuegos',number:'04',name:'MaxiJuegos',areas:['ui','realtime','bots','quality','deploy'],stack:[
    {tech:'Godot',use:'El motor: escenas 2D y 3D, física e interfaz de los 25 minijuegos.'},
    {tech:'GDScript',use:'Toda la lógica: cada minijuego en su carpeta, que se registra solo, y una IA propia por minijuego para los bots.'},
    {tech:'ENet',use:'Red con un PC como host autoritativo. Si alguien se desconecta, un bot ocupa su sitio.'},
    {tech:'WebAssembly',use:'Exportación para jugar en el navegador, con controles táctiles en móvil.'},
  ]},
];
const projectById = Object.fromEntries(projectMap.map(p=>[p.id,p]));
const touches = (p:ProjectSummary)=>new Set<Area>(p.areas);

// Overview: which areas each project works on, so a recruiter can compare them at a glance.
function ProjectMap(){
  const order = Object.keys(areas) as Area[];
  return <div className="project-map" data-reveal>
    <div className="map-head"><span className="eyebrow">QUÉ SE TOCA EN CADA PROYECTO</span><span className="map-legend"><i className="dot is-on" aria-hidden="true"/>parte importante del proyecto</span></div>
    <table>
      <thead><tr><th scope="col"><span className="sr-only">Proyecto</span></th>{order.map(a=><th scope="col" key={a}>{areas[a].label}</th>)}</tr></thead>
      <tbody>{projectMap.map(p=>{const set=touches(p);return <tr key={p.id}>
        <th scope="row"><a href={`#${p.id}`}><span>{p.number}</span>{p.name}</a></th>
        {order.map(a=><td key={a} data-label={areas[a].label}>{set.has(a)?<><i className="dot is-on" aria-hidden="true"/><span className="sr-only">Sí</span></>:<><i className="dot" aria-hidden="true"/><span className="sr-only">No</span></>}</td>)}
        <td className="map-chips">{order.filter(a=>set.has(a)).map(a=><span key={a}>{areas[a].label}</span>)}</td>
      </tr>})}</tbody>
    </table>
  </div>
}

// Icons for the project stacks: the skills section's marks, plus the few tools that only appear here.
const extraIcons:Record<string,{color:string;icon:ReactNode}> = {
  'Apple Wallet':{color:'var(--foreground)',icon:<Brand icon={siApple} color="currentColor"/>},
  'GitHub Actions':{color:'#4d8ef7',icon:<Brand icon={siGithubactions} color="#4d8ef7"/>},
  'WebAssembly':{color:'#8f7cf7',icon:<Brand icon={siWebassembly} color="#8f7cf7"/>},
  'ENet':{color:'#83d3c7',icon:<ShareNetwork weight="fill"/>},
};
const stackIcon = (name:string)=>extraIcons[name] ?? techs.find(t=>t.name===name) ?? {color:'var(--accent)',icon:null};

// Card breakdown: the technologies the project uses, and what each one is for.
function ProjectStack({id}:{id:string}){
  const p = projectById[id];
  return <div className="project-stack"><span className="work-label">TECNOLOGÍAS Y PARA QUÉ LAS HE USADO</span><ul>{p.stack.map(u=>{const t=stackIcon(u.tech);return <li key={u.tech} style={{'--tech':t.color} as CSSProperties}><span className="stack-icon" aria-hidden="true">{t.icon}</span><div><b>{u.tech}</b><p>{u.use}</p></div></li>})}</ul></div>
}

function TournamentDiagram(){return <div className="tournament" aria-label="Esquema del flujo de un torneo en PadelBracket"><div className="tournament-top"><span>PADEL<span>BRACKET</span></span><span className="diagram-label">FLUJO DEL TORNEO</span></div><div className="tournament-title">Del primer partido<br/>a la gran final<span>.</span></div><div className="bracket"><div className="round"><span>SEMIFINALES</span><div className="match"><p>Pareja A <b>↗</b></p><p>Pareja B</p></div><div className="match"><p>Pareja C <b>↗</b></p><p>Pareja D</p></div></div><div className="connector" aria-hidden="true"/><div className="round final"><span>FINAL</span><div className="match"><p>Pareja A</p><p>Pareja C</p></div></div></div><div className="diagram-footer"><span>Inscripciones</span><span>Eliminatorias</span><span>Resultados</span></div></div>}

const fitoShots:Shot[] = [
  {file:'fito-inicio.jpg',title:'Inicio',alt:'Inicio de Escuela Fito Raya: el próximo partido del equipo A contra CD Padel Arcos, con los puntos de cada pareja',width:1440,height:900},
  {file:'fito-equipo.jpg',title:'El equipo',alt:'Resumen del equipo A: puesto, puntos, balance de victorias y la próxima jornada',width:1440,height:900},
  {file:'fito-calendario.jpg',title:'Calendario',alt:'Calendario de octubre con las jornadas del equipo y el resultado de cada encuentro',width:1440,height:900},
  {file:'fito-clasificacion.jpg',title:'Clasificación',alt:'Clasificación de la liga con el equipo A destacado en segunda posición',width:1440,height:900},
  {file:'fito-encuentro.jpg',title:'Encuentro',alt:'Detalle de un encuentro: resultado 10–2 contra Top Bal Pádel Game B y el acta del partido',width:1440,height:900},
  {file:'fito-competicion.jpg',title:'Competición',alt:'Explorador de la competición con filtros por zona, fase, categoría, grupo y división',width:1440,height:900},
  {file:'fito-patrocinadores.jpg',title:'Patrocinadores',alt:'Página de patrocinadores del club con tarjetas para cada empresa',width:1440,height:900},
];

const tesisShots:Shot[] = [
  {file:'tesis-inicio.jpg',title:'Inicio',alt:'Portada de Tesis: biblioteca nocturna, cartas de personaje y panel para buscar partida o crear una sala privada',width:1440,height:900},
  {file:'tesis-personajes.jpg',title:'Elegir personaje',alt:'Selección privada de personaje: siete cartas ilustradas, algunas ya no disponibles',width:1440,height:900},
  {file:'tesis-mesa.jpg',title:'La mesa',alt:'Mesa de juego con tres investigadores, sus estudios en desarrollo y publicados, y la barra de acciones',width:1440,height:900},
  {file:'tesis-estudio.jpg',title:'Iniciar estudio',alt:'Diálogo para iniciar un estudio con las cartas de idea de la mano y su coste',width:1440,height:900},
  {file:'tesis-reglas.jpg',title:'Reglas',alt:'Guía de cómo jugar a Tesis con el objetivo, las fases y los recursos',width:1440,height:900},
];

const GAME_URL = `${import.meta.env.BASE_URL}maxijuegos/`;
const gameShots = [
  {file:'maxijuegos-rainbow-kart.jpg',name:'Karts Arcoíris',alt:'Carrera de karts 3D por una pista arcoíris en el espacio'},
  {file:'maxijuegos-impostor.jpg',name:'Impostor a Bordo',alt:'Nave espacial 3D con tripulantes de colores y la lista de tareas'},
  {file:'maxijuegos-sniper-town.jpg',name:'Francotiradores',alt:'Mira telescópica sobre un pueblo 3D con el radar en la esquina'},
];
// Poster wall: three rows of minigames drifting in opposite directions behind the play button.
const posterRows = [
  ['rainbow_kart','impostor','word_fight','sniper_town','rail_cannons','uphill_rush','pair_escape'],
  ['knife_log','spotlight','feather_catch','personal_bridge','diligent_shots','ninja_climb','moon_hop','target_range'],
  ['short_fuse','blind_timer','coin_grab','shrinking_platform','tongue_swing','wave_dash','button_mash'],
  ['sniper_town','feather_catch','rail_cannons','moon_hop','word_fight','personal_bridge','rainbow_kart','spotlight'],
];
const GAME_COUNT = 25;

// Fourth project: the game itself runs inside the card, loaded only when the visitor asks for it.
function MaxiJuegosProject(){
  const [playing,setPlaying] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const play = ()=>{
    // Phones and tablets: the card is too small to play in, so the game opens on its own page (landscape, touch controls).
    if(window.matchMedia('(hover: none) and (pointer: coarse)').matches){window.location.href = GAME_URL;return}
    setPlaying(true);stage.current?.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
  const stop = ()=>{if(document.fullscreenElement)document.exitFullscreen();setPlaying(false)};
  const fullscreen = ()=>{if(document.fullscreenElement)document.exitFullscreen();else stage.current?.requestFullscreen?.().then(()=>frame.current?.focus()).catch(()=>{})};
  return <article className="project game-project" id="maxijuegos" data-reveal>
    <div className="project-info"><div className="project-index">04 <span>PARTY GAME MULTIJUGADOR</span></div><h3>MaxiJuegos</h3><p>Un party game de minijuegos para 2–8 jugadores hecho en Godot, con partidas online de un jugador por PC. La versión de esta página corre en tu navegador contra 3 bots.</p><div className="project-actions"><button className="btn btn-primary" type="button" onClick={play} aria-label="Jugar a MaxiJuegos contra bots en esta página"><Play size={18} weight="fill"/> Jugar ahora</button><a className="btn btn-secondary" href={GAME_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir MaxiJuegos en una pestaña nueva">Pantalla completa <ArrowUpRight size={18}/></a></div></div>
    <figure className="game-visual">
      <div className="game-bar"><span className={`game-status${playing?' is-live':''}`}><i aria-hidden="true"/>{playing?'EN JUEGO':'DEMO JUGABLE'}</span><span className="game-bar-title">Tú contra 3 bots</span>{playing&&<div className="game-tools"><button type="button" onClick={fullscreen} aria-label="Pantalla completa"><ArrowsOut size={18}/></button><button type="button" onClick={stop} aria-label="Cerrar el juego"><X size={18}/></button></div>}</div>
      <div className="game-stage" ref={stage}>{playing
        ? <iframe ref={frame} src={GAME_URL} title="MaxiJuegos: partida contra bots" allow="fullscreen; gamepad" onLoad={()=>frame.current?.focus()}/>
        : <button className="game-poster" type="button" onClick={play} aria-label="Jugar a MaxiJuegos contra bots"><span className="poster-wall" aria-hidden="true">{posterRows.map((row,r)=><span className={`poster-row row-${r}`} key={r}>{[...row,...row].map((id,i)=><img key={i} src={`${import.meta.env.BASE_URL}assets/minijuegos/${id}.jpg`} alt="" width="400" height="225" loading="lazy" decoding="async"/>)}</span>)}</span><span className="poster-title" aria-hidden="true"><small>PARTY GAME · {GAME_COUNT} MINIJUEGOS</small>Maxi<b>Juegos</b></span><span className="game-play" aria-hidden="true"><Play size={32} weight="fill"/></span><span className="game-cta">Jugar en el navegador<small>Sin instalar nada · descarga de unos 10 MB · sin sonido · también en móvil</small></span></button>}</div>
      <ul className="game-strip" aria-label="Algunos de los minijuegos">{gameShots.map(shot=><li key={shot.file}><img src={`${import.meta.env.BASE_URL}assets/${shot.file}`} alt={shot.alt} width="640" height="360" loading="lazy"/><span>{shot.name}</span></li>)}</ul>
      <figcaption><span className="game-keys"><kbd>WASD</kbd> moverte <kbd>Espacio</kbd> o clic, acción</span><span className="game-touch">Se abre a pantalla completa, con joystick y botones táctiles</span><span>{GAME_COUNT} MINIJUEGOS</span></figcaption>
    </figure>
    <ProjectStack id="maxijuegos"/>
  </article>
}

export default function Home(){
  const [menuOpen,setMenuOpen] = useState(false);
  const [active,setActive] = useState('');

  useEffect(()=>{document.body.classList.toggle('menu-open',menuOpen)},[menuOpen]);

  useEffect(()=>{SLEEPING_DEMOS.forEach(url=>fetch(url,{mode:'no-cors',cache:'no-store'}).catch(()=>{}))},[]);

  // Current section in the navigation.
  useEffect(()=>{
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id)}),{rootMargin:'-45% 0px -50% 0px'});
    navLinks.forEach(link=>{const el=document.getElementById(link.id);if(el)observer.observe(el)});
    return ()=>observer.disconnect();
  },[]);

  // Scroll reveals: heavy fade up with blur as each block enters the viewport.
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    document.documentElement.classList.add('motion');
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:0.15});
    document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);

  // Scroll driven scenes, one listener throttled through requestAnimationFrame.
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>('.hero');
    const ribbon = document.querySelector<HTMLElement>('.tech-ribbon');
    const tagSection = document.querySelector<HTMLElement>('.tagline');
    const words = [...document.querySelectorAll<HTMLElement>('.tagline .word')];
    const projects = [...document.querySelectorAll<HTMLElement>('.project')];
    let lastY = window.scrollY, skew = 0, frame = 0;
    const clamp = (v:number)=>Math.min(1,Math.max(0,v));
    const update = ()=>{
      frame = 0;
      const y = window.scrollY, vh = window.innerHeight;
      root.style.setProperty('--page-progress',String(clamp(y/(root.scrollHeight-vh))));
      if(hero)hero.style.setProperty('--hero-out',String(clamp(y/(hero.offsetHeight*0.85))));
      skew += ((y-lastY)*0.12 - skew)*0.2; lastY = y;
      if(ribbon)ribbon.style.setProperty('--skew',`${Math.max(-8,Math.min(8,skew)).toFixed(2)}deg`);
      if(tagSection){
        const r = tagSection.getBoundingClientRect();
        const progress = clamp((vh*0.5 - r.top)/(r.height - vh*0.9));
        const lit = Math.round(progress*words.length);
        words.forEach((w,i)=>w.classList.toggle('lit',i<lit));
      }
      projects.forEach((p,i)=>{
        const next = projects[i+1];
        const amount = next ? clamp(1 - next.getBoundingClientRect().top/vh) : 0;
        p.style.setProperty('--stack',amount.toFixed(3));
      });
      if(Math.abs(skew)>0.05 && !frame)frame = requestAnimationFrame(update);
    };
    const onScroll = ()=>{if(!frame)frame = requestAnimationFrame(update)};
    // Cards taller than the viewport stick by their bottom edge instead of the top, so nothing stays hidden under the next card.
    const fit = ()=>projects.forEach(p=>{
      const content = p.offsetHeight - parseFloat(getComputedStyle(p).paddingBottom);
      p.style.setProperty('--stick-top',`${Math.min(96,Math.round(window.innerHeight - content - 24))}px`);
    });
    const onResize = ()=>{fit();onScroll()};
    fit();
    document.fonts?.ready.then(onResize);
    update();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onResize);
    return ()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onResize);cancelAnimationFrame(frame)};
  },[]);

  const closeMenu = ()=>setMenuOpen(false);
  return <main>
    <CursorCircle/>
    <a className="skip-link" href="#proyectos">Saltar a los proyectos</a>
    <div className="scroll-progress" aria-hidden="true"/>
    <header className={`island${menuOpen?' is-open':''}`}>
      <a className="brand" href="#inicio" aria-label="Rafael Deusto, inicio" onClick={closeMenu}>rd<span>.</span></a>
      <nav className="island-links" aria-label="Navegación principal">{navLinks.map(link=><a key={link.id} href={`#${link.id}`} aria-current={active===link.id?'true':undefined}>{link.label}</a>)}</nav>
      <a className="nav-cv" href={CV_URL} download>Descargar CV <Download size={16}/></a>
      <button className="burger" type="button" aria-expanded={menuOpen} aria-controls="menu-movil" aria-label={menuOpen?'Cerrar menú':'Abrir menú'} onClick={()=>setMenuOpen(o=>!o)}><span/><span/></button>
    </header>
    <div className={`menu-overlay${menuOpen?' is-open':''}`} id="menu-movil" aria-hidden={!menuOpen}>
      <nav aria-label="Menú móvil">{navLinks.map((link,i)=><a key={link.id} href={`#${link.id}`} style={{'--d':i} as React.CSSProperties} tabIndex={menuOpen?0:-1} onClick={closeMenu}>{link.label}</a>)}<a className="menu-cv" href={CV_URL} download style={{'--d':navLinks.length} as React.CSSProperties} tabIndex={menuOpen?0:-1} onClick={closeMenu}>Descargar CV <Download size={20}/></a></nav>
    </div>
    <Hero cvUrl={CV_URL}/>
    <TechRibbon/>
    <section className="projects" id="proyectos">
      <div className="section-head" data-reveal><div><span className="eyebrow">01 / PROYECTOS SELECCIONADOS</span><p className="section-aside">Cuatro proyectos reales.<br/>La misma forma de aprender: hacer.</p></div><h2>Código que<br/><em>toma forma.</em></h2></div>
      <ProjectMap/>
      <article className="project" id="fito-raya" data-reveal><div className="project-info"><div className="project-index">01 <span>WEB PARA MI EQUIPO DE PÁDEL</span></div><h3>Escuela Fito Raya</h3><p>La web de los equipos A y B de Escuela Fito Raya, con datos reales de la competición: clasificación, plantillas, jornadas, actas y un laboratorio para preparar las parejas de cada partido.</p><div className="project-actions"><a className="btn btn-primary" href="https://fito-snp.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Ver la demo de Escuela Fito Raya">Ver demo <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="https://github.com/faliideusto/Equipo-P-del-Fito-Raya" target="_blank" rel="noreferrer" aria-label="Ver el código de Escuela Fito Raya en GitHub"><CodeXml size={18}/> Código</a></div></div><ShotReel shots={fitoShots} site="fito-snp.vercel.app" href="https://fito-snp.vercel.app" label="Capturas de Escuela Fito Raya"/><ProjectStack id="fito-raya"/></article>
      <article className="project tesis-project" id="tesis" data-reveal><div className="project-info"><div className="project-index">02 <span>PROYECTO UNIVERSITARIO</span></div><h3>Tesis</h3><p>Un juego de cartas online sobre investigación académica, hecho como proyecto universitario para un profesor de la universidad. Es para 3–5 personas: cada uno juega desde su dispositivo, con salas privadas, búsqueda de partida y cuentas con progresión.</p><div className="project-actions"><a className="btn btn-primary" href="https://tesis-dm5l.onrender.com/" target="_blank" rel="noopener noreferrer" aria-label="Ver la demo de Tesis">Ver demo <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="https://github.com/faliideusto/Ciudadela-Academica" target="_blank" rel="noreferrer" aria-label="Ver el código de Tesis en GitHub"><CodeXml size={18}/> Código</a></div>{demoNote}</div><ShotReel shots={tesisShots} site="tesis-dm5l.onrender.com" href="https://tesis-dm5l.onrender.com/" label="Capturas de Tesis"/><ProjectStack id="tesis"/></article>
      <article className="project" id="padelbracket" data-reveal><div className="project-info"><div className="project-index">03 <span>PROYECTO FINAL DE DAW</span></div><h3>PadelBracket</h3><p>Una aplicación para organizar torneos de pádel de principio a fin: parejas, inscripciones, cruces y resultados en un mismo lugar.</p><div className="project-actions"><a className="btn btn-secondary" href="https://github.com/faliideusto/PadelBracket" target="_blank" rel="noreferrer" aria-label="Ver el código de PadelBracket en GitHub"><CodeXml size={18}/> Código</a></div></div><TournamentDiagram/><ProjectStack id="padelbracket"/></article>
      <MaxiJuegosProject/>
    </section>
    <section className="tagline" aria-label="Lo que me mueve"><div className="tagline-sticky"><p>{tagline.split(' ').map((w,i)=><span className="word" key={i}>{w} </span>)}</p></div></section>
    <section className="about" id="sobre-mi"><div className="about-head" data-reveal><span className="eyebrow">02 / UN POCO SOBRE MÍ</span><span className="asterisk" aria-hidden="true">✳</span></div><h2 data-reveal>Aprender haciendo.<br/><em>Crecer en equipo.</em></h2><div className="about-body" data-reveal><span className="about-label">MÁS ALLÁ DEL CÓDIGO</span><div><p>Soy Rafael, desarrollador junior de Jerez. Me gusta entender cómo funcionan las cosas y convertir ese aprendizaje en aplicaciones que se puedan usar.</p><p>He completado la formación académica de Desarrollo de Aplicaciones Web y estoy pendiente de las prácticas. Busco un equipo donde aportar, recibir feedback y seguir aprendiendo con proyectos reales.</p><p>Uso la IA como apoyo durante el desarrollo: para explorar soluciones, revisar ideas y aprender tecnologías. Me interesa comprender lo que construyo y comprobar que funciona.</p><a className="text-link" href={CV_URL} download>Descargar mi CV <Download size={18}/></a></div></div><div className="experience-note" data-reveal><span>EXPERIENCIA · DUBLÍN 2021</span><p>Ocho meses en Starbucks del aeropuerto de Dublín: cuatro como barista y cuatro como responsable de equipo. Una experiencia trabajando íntegramente en inglés que me enseñó a comunicarme, coordinarme y responder bajo presión.</p></div></section>
    <SkillsSection/>
    <section className="contact" id="contacto"><div className="contact-top" data-reveal><span className="eyebrow">04 / SIGUIENTE PASO</span><span>PRIMER EMPLEO · PRÁCTICAS</span></div><h2 data-reveal>¿Construimos<br/><em>algo juntos?</em></h2><div className="contact-bottom" data-reveal><p>Estoy buscando mi primera oportunidad<br/>en desarrollo de software.<br/><span>Me encantará conocer a tu equipo.</span></p><div className="contact-actions"><a className="pill contact-pill" href={`mailto:${EMAIL}`}><Mail size={21}/> Hablemos <ArrowUpRight size={22}/></a><CopyEmail/></div></div><div className="contact-links"><a href="mailto:radeusto@gmail.com">radeusto@gmail.com</a><a href="https://github.com/faliideusto" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a><a href="https://www.linkedin.com/in/rafael-deusto-966447296/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16}/></a><a href={CV_URL} download>Descargar CV <Download size={16}/></a></div></section>
    <footer><a className="brand" href="#inicio" aria-label="Volver al inicio">rd<span>.</span></a><span>© 2026 Rafael Deusto Espinosa</span><a href="#inicio">Volver arriba ↑</a></footer>
  </main>
}

