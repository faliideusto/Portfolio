'use client';

import { useEffect, useRef, useState } from 'react';
import { ShotReel, type Shot } from './shot-reel';
import { ArrowsOut, ArrowUpRight, Check, Code as CodeXml, Copy, DownloadSimple as Download, EnvelopeSimple as Mail, Play, X } from '@phosphor-icons/react';
import { SkillsSection } from './skills';
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
type Work = {area:Area;title:string;detail:string};
type ProjectSummary = {id:string;number:string;name:string;works:Work[];also?:Area[]};

const projectMap:ProjectSummary[] = [
  {id:'fito-raya',number:'01',name:'Escuela Fito Raya',works:[
    {area:'ui',title:'Laboratorio de parejas',detail:'Next.js y React: arrastrar jugadores, intercambios, orden por puntos y diálogo accesible con teclado.'},
    {area:'integration',title:'Conexión con la federación',detail:'El servidor inicia sesión en las Series Nacionales de Pádel, lee clasificaciones, actas y plantillas y las normaliza con caché.'},
    {area:'data',title:'Cuentas de jugadores',detail:'Supabase: registro, ficha vinculada a la plantilla y editor de posiciones protegido por contraseña.'},
    {area:'quality',title:'Tests y CI',detail:'Tests de las reglas de puntuación; lint, tipos, tests y build en GitHub Actions en cada cambio.'},
  ],also:['server','deploy']},
  {id:'tesis',number:'02',name:'Tesis',works:[
    {area:'server',title:'Motor y servidor en Java',detail:'Reglas con los patrones State, Command, Strategy y Observer, y una API HTTP propia con salas, tokens y control de revisiones.'},
    {area:'realtime',title:'Partidas online',detail:'Salas privadas por código, búsqueda de partida con colas de 3, 4 y 5 jugadores y reconexión al recargar.'},
    {area:'data',title:'Cuentas y comunidad',detail:'Supabase: perfil con niveles y rangos, amigos, ranking global, misiones y pase de temporada.'},
    {area:'quality',title:'Pruebas de partidas completas',detail:'JUnit con partidas de 3 a 5 jugadores y QA con Playwright simulando varios navegadores, también en móvil.'},
  ],also:['ui','bots','deploy']},
  {id:'padelbracket',number:'03',name:'PadelBracket',works:[
    {area:'data',title:'Usuarios y roles',detail:'Cuentas de jugador y organizador con permisos distintos, sobre Django y MySQL.'},
    {area:'server',title:'Lógica del torneo',detail:'Inscripciones de parejas y generación de eliminatorias con avance automático de ganadores.'},
    {area:'ui',title:'Interfaz web',detail:'Plantillas de Django con JavaScript para seguir el cuadro y los resultados.'},
  ]},
  {id:'maxijuegos',number:'04',name:'MaxiJuegos',works:[
    {area:'realtime',title:'Red con host autoritativo',detail:'Un PC hace de host y simula; los demás envían su entrada. Si alguien se desconecta, un bot ocupa su sitio.'},
    {area:'ui',title:'25 minijuegos en 2D y 3D',detail:'Cada minijuego es una carpeta independiente que se registra sola: de carreras de karts a duelos de palabras.'},
    {area:'bots',title:'Bots que juegan',detail:'Una IA propia para cada minijuego, que completa la sala y permite jugar en solitario.'},
    {area:'deploy',title:'En tu navegador',detail:'Exportación a WebAssembly con controles táctiles, y tests sin ventana de cada minijuego.'},
  ],also:['quality']},
];
const projectById = Object.fromEntries(projectMap.map(p=>[p.id,p]));
const touches = (p:ProjectSummary)=>new Set<Area>([...p.works.map(w=>w.area),...(p.also??[])]);

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

// Card breakdown: the main pieces of work in the project, each tagged with its area.
function ProjectWork({id}:{id:string}){
  const p = projectById[id];
  return <div className="project-work"><span className="work-label">QUÉ HE HECHO</span><ol>{p.works.map(w=><li key={w.title}><span className={`work-area area-${w.area}`}>{areas[w.area].label}</span><div><b>{w.title}</b><p>{w.detail}</p></div></li>)}</ol></div>
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
    <div className="project-info"><div className="project-index">04 <span>PARTY GAME MULTIJUGADOR</span></div><h3>MaxiJuegos</h3><p>Un party game de minijuegos para 2–8 jugadores hecho en Godot, con partidas online de un jugador por PC. La versión de esta página corre en tu navegador contra 3 bots.</p><div className="tags">{['Godot 4','GDScript','Multijugador','WebAssembly'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><button className="btn btn-primary" type="button" onClick={play} aria-label="Jugar a MaxiJuegos contra bots en esta página"><Play size={18} weight="fill"/> Jugar ahora</button><a className="btn btn-secondary" href={GAME_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir MaxiJuegos en una pestaña nueva">Pantalla completa <ArrowUpRight size={18}/></a></div></div>
    <figure className="game-visual">
      <div className="game-bar"><span className={`game-status${playing?' is-live':''}`}><i aria-hidden="true"/>{playing?'EN JUEGO':'DEMO JUGABLE'}</span><span className="game-bar-title">Tú contra 3 bots</span>{playing&&<div className="game-tools"><button type="button" onClick={fullscreen} aria-label="Pantalla completa"><ArrowsOut size={18}/></button><button type="button" onClick={stop} aria-label="Cerrar el juego"><X size={18}/></button></div>}</div>
      <div className="game-stage" ref={stage}>{playing
        ? <iframe ref={frame} src={GAME_URL} title="MaxiJuegos: partida contra bots" allow="fullscreen; gamepad" onLoad={()=>frame.current?.focus()}/>
        : <button className="game-poster" type="button" onClick={play} aria-label="Jugar a MaxiJuegos contra bots"><span className="poster-wall" aria-hidden="true">{posterRows.map((row,r)=><span className={`poster-row row-${r}`} key={r}>{[...row,...row].map((id,i)=><img key={i} src={`${import.meta.env.BASE_URL}assets/minijuegos/${id}.jpg`} alt="" width="400" height="225" loading="lazy" decoding="async"/>)}</span>)}</span><span className="poster-title" aria-hidden="true"><small>PARTY GAME · {GAME_COUNT} MINIJUEGOS</small>Maxi<b>Juegos</b></span><span className="game-play" aria-hidden="true"><Play size={32} weight="fill"/></span><span className="game-cta">Jugar en el navegador<small>Sin instalar nada · descarga de unos 10 MB · sin sonido · también en móvil</small></span></button>}</div>
      <ul className="game-strip" aria-label="Algunos de los minijuegos">{gameShots.map(shot=><li key={shot.file}><img src={`${import.meta.env.BASE_URL}assets/${shot.file}`} alt={shot.alt} width="640" height="360" loading="lazy"/><span>{shot.name}</span></li>)}</ul>
      <figcaption><span className="game-keys"><kbd>WASD</kbd> moverte <kbd>Espacio</kbd> o clic, acción</span><span className="game-touch">Se abre a pantalla completa, con joystick y botones táctiles</span><span>{GAME_COUNT} MINIJUEGOS</span></figcaption>
    </figure>
    <ProjectWork id="maxijuegos"/>
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
      <article className="project" id="fito-raya" data-reveal><div className="project-info"><div className="project-index">01 <span>WEB PARA MI EQUIPO DE PÁDEL</span></div><h3>Escuela Fito Raya</h3><p>La web de los equipos A y B de Escuela Fito Raya, con datos reales de la competición: clasificación, plantillas, jornadas, actas y un laboratorio para preparar las parejas de cada partido.</p><div className="tags">{['TypeScript','Next.js','React','Supabase','GitHub Actions','Vercel'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><a className="btn btn-primary" href="https://fito-snp.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Ver la demo de Escuela Fito Raya">Ver demo <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="https://github.com/faliideusto/Equipo-P-del-Fito-Raya" target="_blank" rel="noreferrer" aria-label="Ver el código de Escuela Fito Raya en GitHub"><CodeXml size={18}/> Código</a></div></div><ShotReel shots={fitoShots} site="fito-snp.vercel.app" href="https://fito-snp.vercel.app" label="Capturas de Escuela Fito Raya"/><ProjectWork id="fito-raya"/></article>
      <article className="project tesis-project" id="tesis" data-reveal><div className="project-info"><div className="project-index">02 <span>JUEGO ONLINE · HECHO EN SOLITARIO</span></div><h3>Tesis</h3><p>Un juego de cartas online sobre investigación académica para 3–5 personas: cada uno juega desde su dispositivo, con salas privadas, búsqueda de partida y cuentas con progresión. Lo he desarrollado yo solo, del motor a la interfaz.</p><div className="tags">{['Java','JavaScript','Supabase','JUnit','Playwright','Docker'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><a className="btn btn-primary" href="https://tesis-dm5l.onrender.com/" target="_blank" rel="noopener noreferrer" aria-label="Ver la demo de Tesis">Ver demo <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="https://github.com/faliideusto/Ciudadela-Academica" target="_blank" rel="noreferrer" aria-label="Ver el código de Tesis en GitHub"><CodeXml size={18}/> Código</a></div>{demoNote}</div><ShotReel shots={tesisShots} site="tesis-dm5l.onrender.com" href="https://tesis-dm5l.onrender.com/" label="Capturas de Tesis"/><ProjectWork id="tesis"/></article>
      <article className="project" id="padelbracket" data-reveal><div className="project-info"><div className="project-index">03 <span>PROYECTO FINAL DE DAW</span></div><h3>PadelBracket</h3><p>Una aplicación para organizar torneos de pádel de principio a fin: parejas, inscripciones, cruces y resultados en un mismo lugar.</p><div className="tags">{['Python','Django','MySQL','JavaScript'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><a className="btn btn-secondary" href="https://github.com/faliideusto/PadelBracket" target="_blank" rel="noreferrer" aria-label="Ver el código de PadelBracket en GitHub"><CodeXml size={18}/> Código</a></div></div><TournamentDiagram/><ProjectWork id="padelbracket"/></article>
      <MaxiJuegosProject/>
    </section>
    <section className="tagline" aria-label="Lo que me mueve"><div className="tagline-sticky"><p>{tagline.split(' ').map((w,i)=><span className="word" key={i}>{w} </span>)}</p></div></section>
    <section className="about" id="sobre-mi"><div className="about-head" data-reveal><span className="eyebrow">02 / UN POCO SOBRE MÍ</span><span className="asterisk" aria-hidden="true">✳</span></div><h2 data-reveal>Aprender haciendo.<br/><em>Crecer en equipo.</em></h2><div className="about-body" data-reveal><span className="about-label">MÁS ALLÁ DEL CÓDIGO</span><div><p>Soy Rafael, desarrollador junior de Jerez. Me gusta entender cómo funcionan las cosas y convertir ese aprendizaje en aplicaciones que se puedan usar.</p><p>He completado la formación académica de Desarrollo de Aplicaciones Web y estoy pendiente de las prácticas. Busco un equipo donde aportar, recibir feedback y seguir aprendiendo con proyectos reales.</p><p>Uso la IA como apoyo durante el desarrollo: para explorar soluciones, revisar ideas y aprender tecnologías. Me interesa comprender lo que construyo y comprobar que funciona.</p><a className="text-link" href={CV_URL} download>Descargar mi CV <Download size={18}/></a></div></div><div className="experience-note" data-reveal><span>EXPERIENCIA · DUBLÍN 2021</span><p>Ocho meses en Starbucks del aeropuerto de Dublín: cuatro como barista y cuatro como responsable de equipo. Una experiencia trabajando íntegramente en inglés que me enseñó a comunicarme, coordinarme y responder bajo presión.</p></div></section>
    <SkillsSection/>
    <section className="contact" id="contacto"><div className="contact-top" data-reveal><span className="eyebrow">04 / SIGUIENTE PASO</span><span>PRIMER EMPLEO · PRÁCTICAS</span></div><h2 data-reveal>¿Construimos<br/><em>algo juntos?</em></h2><div className="contact-bottom" data-reveal><p>Estoy buscando mi primera oportunidad<br/>en desarrollo de software.<br/><span>Me encantará conocer a tu equipo.</span></p><div className="contact-actions"><a className="pill contact-pill" href={`mailto:${EMAIL}`}><Mail size={21}/> Hablemos <ArrowUpRight size={22}/></a><CopyEmail/></div></div><div className="contact-links"><a href="mailto:radeusto@gmail.com">radeusto@gmail.com</a><a href="https://github.com/faliideusto" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a><a href="https://www.linkedin.com/in/rafael-deusto-966447296/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16}/></a><a href={CV_URL} download>Descargar CV <Download size={16}/></a></div></section>
    <footer><a className="brand" href="#inicio" aria-label="Volver al inicio">rd<span>.</span></a><span>© 2026 Rafael Deusto Espinosa</span><a href="#inicio">Volver arriba ↑</a></footer>
  </main>
}

