'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowsOut, ArrowUpRight, Check, Code as CodeXml, Copy, DownloadSimple as Download, EnvelopeSimple as Mail, Play, X } from '@phosphor-icons/react';

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

function SplitName({text}:{text:string}){return <>{[...text].map((ch,i)=><span className="char" style={{'--i':i} as React.CSSProperties} key={i}>{ch}</span>)}</>}

const technologies = ['Python', 'Django', 'Java', 'JavaScript', 'HTML & CSS', 'SQL', 'Git'];
const skillGroups = [
  {number:'01',title:'Backend',detail:'Lógica, datos y aplicaciones web.',tools:['Python','Django','Java']},
  {number:'02',title:'Frontend',detail:'Interfaces claras que se adaptan a cada pantalla.',tools:['JavaScript','HTML','CSS']},
  {number:'03',title:'Bases de datos',detail:'Modelado y consultas para organizar la información.',tools:['SQL','MySQL']},
  {number:'04',title:'Flujo de trabajo',detail:'Control de versiones y desarrollo asistido por IA.',tools:['Git','GitHub','Codex']},
];

function TournamentDiagram(){return <div className="tournament" aria-label="Esquema del flujo de un torneo en PadelBracket"><div className="tournament-top"><span>PADEL<span>BRACKET</span></span><span className="diagram-label">FLUJO DEL TORNEO</span></div><div className="tournament-title">Del primer partido<br/>a la gran final<span>.</span></div><div className="bracket"><div className="round"><span>SEMIFINALES</span><div className="match"><p>Pareja A <b>↗</b></p><p>Pareja B</p></div><div className="match"><p>Pareja C <b>↗</b></p><p>Pareja D</p></div></div><div className="connector" aria-hidden="true"/><div className="round final"><span>FINAL</span><div className="match"><p>Pareja A</p><p>Pareja C</p></div></div></div><div className="diagram-footer"><span>Inscripciones</span><span>Eliminatorias</span><span>Resultados</span></div></div>}

const GAME_URL = `${import.meta.env.BASE_URL}maxijuegos/`;
const gameShots = [
  {file:'maxijuegos-palabras.jpg',name:'Pelea de Palabras',alt:'Arena 3D con casillas de letras donde los personajes deletrean una palabra'},
  {file:'maxijuegos-foco.jpg',name:'Caza del Foco',alt:'Tablero oscuro con focos de colores que los jugadores intentan ocupar'},
  {file:'maxijuegos-dagas.jpg',name:'Tronco de Dagas',alt:'Tronco giratorio con dagas de colores clavadas alrededor'},
];

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
  return <article className="project game-project" data-reveal>
    <div className="project-info"><div className="project-index">04 <span>PARTY GAME MULTIJUGADOR</span></div><h3>MaxiJuegos</h3><p>Un party game de minijuegos para 2–8 jugadores hecho en Godot: partidas online con un jugador por PC, bots que completan la sala y pruebas en 2D y 3D, de carreras de parkour a duelos de palabras.</p><div className="contribution"><span>MI TRABAJO</span><p>Desarrollo del juego en GDScript: una arquitectura en la que cada minijuego es una carpeta independiente, red con host autoritativo, IA de los bots y música y efectos generados por código. La versión de esta página corre en tu navegador con WebAssembly.</p></div><div className="tags">{['Godot 4','GDScript','Multijugador','WebAssembly'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><button className="btn btn-primary" type="button" onClick={play} aria-label="Jugar a MaxiJuegos contra bots en esta página"><Play size={18} weight="fill"/> Jugar ahora</button><a className="btn btn-secondary" href={GAME_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir MaxiJuegos en una pestaña nueva">Pantalla completa <ArrowUpRight size={18}/></a></div></div>
    <figure className="game-visual">
      <div className="game-bar"><span className={`game-status${playing?' is-live':''}`}><i aria-hidden="true"/>{playing?'EN JUEGO':'DEMO JUGABLE'}</span><span className="game-bar-title">Tú contra 3 bots</span>{playing&&<div className="game-tools"><button type="button" onClick={fullscreen} aria-label="Pantalla completa"><ArrowsOut size={18}/></button><button type="button" onClick={stop} aria-label="Cerrar el juego"><X size={18}/></button></div>}</div>
      <div className="game-stage" ref={stage}>{playing
        ? <iframe ref={frame} src={GAME_URL} title="MaxiJuegos: partida contra bots" allow="fullscreen; gamepad" onLoad={()=>frame.current?.focus()}/>
        : <button className="game-poster" type="button" onClick={play} aria-label="Jugar a MaxiJuegos contra bots"><img src={`${import.meta.env.BASE_URL}assets/maxijuegos-carrera.jpg`} alt="Carrera de Ruinas: cinco personajes corren por unas ruinas flotantes en 3D" width="1280" height="720" loading="lazy"/><span className="game-play" aria-hidden="true"><Play size={32} weight="fill"/></span><span className="game-cta">Jugar en el navegador<small>Sin instalar nada · descarga de unos 10 MB · sin sonido · también en móvil</small></span></button>}</div>
      <ul className="game-strip" aria-label="Algunos de los minijuegos">{gameShots.map(shot=><li key={shot.file}><img src={`${import.meta.env.BASE_URL}assets/${shot.file}`} alt={shot.alt} width="640" height="360" loading="lazy"/><span>{shot.name}</span></li>)}</ul>
      <figcaption><span className="game-keys"><kbd>WASD</kbd> moverte <kbd>Espacio</kbd> o clic, acción</span><span className="game-touch">Se abre a pantalla completa, con joystick y botones táctiles</span><span>24 MINIJUEGOS</span></figcaption>
    </figure>
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
    update();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
    return ()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(frame)};
  },[]);

  const closeMenu = ()=>setMenuOpen(false);
  return <main>
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
    <section className="hero" id="inicio">
      <div className="hero-top"><span className="availability"><i aria-hidden="true"/>Disponible para prácticas y primer empleo</span><span>JEREZ, ESPAÑA</span></div>
      <h1 className="hero-name" aria-label="Rafael Deusto"><span className="name-line" aria-hidden="true"><SplitName text="RAFAEL"/></span> <span className="name-line" aria-hidden="true"><SplitName text="DEUSTO"/></span></h1>
      <p className="hero-role">Desarrollador web junior <span>Python · Django · Java · JavaScript</span></p>
      <div className="hero-bottom">
        <div className="intro"><span className="eyebrow">CURIOSIDAD. CÓDIGO. CONSTANCIA.</span><p>De una idea<br/>a algo que funciona.</p><div className="intro-copy">Desarrollo aplicaciones web con Python, Java y JavaScript. Aprendo construyendo y busco mi primera oportunidad en un equipo de desarrollo.</div><div className="hero-actions"><a className="pill light" href={CV_URL} download>Descargar CV <Download size={18}/></a><a className="pill ghost" href="#proyectos">Ver proyectos <ArrowDown size={18}/></a></div></div>
        <div className="portrait"><img src={`${import.meta.env.BASE_URL}img/fotoperfil.jpg`} alt="Rafael Deusto Espinosa" width="1080" height="1346" fetchPriority="high"/><span className="portrait-caption">RAFAEL DEUSTO ESPINOSA</span></div>
        <div className="hero-note"><span className="asterisk" aria-hidden="true">✳</span><p>Un perfil junior.<br/>Muchas ganas<br/>de aportar.</p><a href="https://github.com/faliideusto" target="_blank" rel="noreferrer"><CodeXml size={18}/> GitHub <ArrowUpRight size={16}/></a><a href="https://www.linkedin.com/in/rafael-deusto-966447296/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16}/></a></div>
      </div>
    </section>
    <div className="tech-ribbon" aria-label="Python, Django, Java, JavaScript, HTML y CSS, SQL, Git"><div className="tech-track" aria-hidden="true">{[0,1].map(copy=><div className="tech-set" key={copy}>{technologies.map(tech=><span key={tech}>{tech}<i>✳</i></span>)}</div>)}</div></div>
    <section className="projects" id="proyectos">
      <div className="section-head" data-reveal><div><span className="eyebrow">01 / PROYECTOS SELECCIONADOS</span><p className="section-aside">Cuatro proyectos reales.<br/>La misma forma de aprender: hacer.</p></div><h2>Código que<br/><em>toma forma.</em></h2></div>
      <article className="project" data-reveal><div className="project-info"><div className="project-index">01 <span>WEB PARA MI EQUIPO DE PÁDEL</span></div><h3>Escuela Fito Raya</h3><p>Una web de pádel para seguir a los equipos A y B de Escuela Fito Raya: clasificación, plantillas, jornadas, resultados y patrocinadores en un mismo lugar.</p><div className="contribution"><span>MI TRABAJO</span><p>Desarrollo de la aplicación con Next.js y TypeScript, integración con la API interna de las Series Nacionales de Pádel y un laboratorio de parejas con ordenación por puntos y edición de alineaciones. Con tests automáticos e integración continua en GitHub Actions: lint, tipos, tests y build en cada cambio.</p></div><div className="tags">{['TypeScript','Next.js','React','API SNP','Tests + CI'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><a className="btn btn-primary" href="https://fito-snp.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Ver la demo de Escuela Fito Raya">Ver demo <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="https://github.com/faliideusto/Equipo-P-del-Fito-Raya" target="_blank" rel="noreferrer" aria-label="Ver el código de Escuela Fito Raya en GitHub"><CodeXml size={18}/> Código</a></div></div><div className="project-gallery"><figure className="tesis-visual"><a className="project-preview" href="https://fito-snp.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Abrir la web de Escuela Fito Raya"><img src={`${import.meta.env.BASE_URL}assets/fito-inicio.jpg`} alt="Web de Escuela Fito Raya: inicio con equipos A y B y próximas jornadas" width="1265" height="1466" loading="lazy"/></a><figcaption><span>El equipo, en un mismo lugar</span><span>TEMPORADA 2026 / 27</span></figcaption></figure></div></article>
      <article className="project tesis-project" data-reveal><div className="project-info"><div className="project-index">02 <span>COLABORACIÓN UNIVERSITARIA</span></div><h3>Tesis</h3><p>Juego de cartas sobre investigación académica para 3–5 personas, con salas privadas y una interfaz web para jugar desde cada dispositivo. Desarrollado en colaboración con un profesor universitario.</p><div className="contribution"><span>MI CONTRIBUCIÓN</span><p>A partir de una estructura inicial compartida, desarrollo del motor Java, acciones y habilidades, interfaz web, salas multijugador y validación de partidas completas. También he creado un sistema de cuentas de jugador con niveles y pases de temporada, conectado a una base de datos.</p></div><div className="tags">{['Java','JavaScript','HTML','CSS'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><a className="btn btn-primary" href="https://tesis-dm5l.onrender.com/" target="_blank" rel="noopener noreferrer" aria-label="Ver la demo de Tesis">Ver demo <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="https://github.com/faliideusto/Ciudadela-Academica" target="_blank" rel="noreferrer" aria-label="Ver el código de Tesis en GitHub"><CodeXml size={18}/> Código</a></div>{demoNote}</div><figure className="tesis-visual"><a className="project-preview" href="https://tesis-dm5l.onrender.com/" target="_blank" rel="noopener noreferrer" aria-label="Abrir el juego Tesis"><img src={`${import.meta.env.BASE_URL}assets/tesis-actual.jpg`} alt="Captura de una partida de Tesis: mesa de juego, personajes y cartas de investigación" width="1280" height="720" loading="lazy"/></a><figcaption><span>Una partida de Tesis</span><span>EN DESARROLLO</span></figcaption></figure></article>
      <article className="project" data-reveal><div className="project-info"><div className="project-index">03 <span>PROYECTO FINAL DE DAW</span></div><h3>PadelBracket</h3><p>Una aplicación para organizar torneos de pádel de principio a fin: parejas, inscripciones, cruces y resultados en un mismo lugar.</p><div className="contribution"><span>MI TRABAJO</span><p>Desarrollo del proyecto: usuarios y roles de jugador y organizador, gestión de inscripciones y generación de eliminatorias con avance de ganadores.</p></div><div className="tags">{['Python','Django','MySQL','JavaScript'].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><a className="btn btn-secondary" href="https://github.com/faliideusto/PadelBracket" target="_blank" rel="noreferrer" aria-label="Ver el código de PadelBracket en GitHub"><CodeXml size={18}/> Código</a></div></div><TournamentDiagram/></article>
      <MaxiJuegosProject/>
    </section>
    <section className="tagline" aria-label="Lo que me mueve"><div className="tagline-sticky"><p>{tagline.split(' ').map((w,i)=><span className="word" key={i}>{w} </span>)}</p></div></section>
    <section className="about" id="sobre-mi"><div className="about-head" data-reveal><span className="eyebrow">02 / UN POCO SOBRE MÍ</span><span className="asterisk" aria-hidden="true">✳</span></div><h2 data-reveal>Aprender haciendo.<br/><em>Crecer en equipo.</em></h2><div className="about-body" data-reveal><span className="about-label">MÁS ALLÁ DEL CÓDIGO</span><div><p>Soy Rafael, desarrollador junior de Jerez. Me gusta entender cómo funcionan las cosas y convertir ese aprendizaje en aplicaciones que se puedan usar.</p><p>He completado la formación académica de Desarrollo de Aplicaciones Web y estoy pendiente de las prácticas. Busco un equipo donde aportar, recibir feedback y seguir aprendiendo con proyectos reales.</p><p>Uso la IA como apoyo durante el desarrollo: para explorar soluciones, revisar ideas y aprender tecnologías. Me interesa comprender lo que construyo y comprobar que funciona.</p><a className="text-link" href={CV_URL} download>Descargar mi CV <Download size={18}/></a></div></div><div className="experience-note" data-reveal><span>EXPERIENCIA · DUBLÍN 2021</span><p>Ocho meses en Starbucks del aeropuerto de Dublín: cuatro como barista y cuatro como responsable de equipo. Una experiencia trabajando íntegramente en inglés que me enseñó a comunicarme, coordinarme y responder bajo presión.</p></div></section>
    <section className="skills" id="tecnologias"><div className="section-head" data-reveal><span className="eyebrow">03 / HERRAMIENTAS Y APRENDIZAJE</span><h2>Mi caja<br/>de herramientas.</h2></div><div className="skill-list">{skillGroups.map(group=><div className="skill-row" key={group.number} data-reveal><span className="skill-number">{group.number}</span><div><h3>{group.title}</h3><p>{group.detail}</p></div><div className="tags">{group.tools.map(tool=><span key={tool}>{tool}</span>)}</div></div>)}</div><div className="learning-grid"><div data-reveal><span className="eyebrow">FORMACIÓN</span><h3>Desarrollo de<br/>Aplicaciones Web</h3><p className="learning-date">2024–2026</p><p>IES Romero Vargas · 2024–2025<br/>ILERNA · 2025–2026</p><p className="status">Formación académica completada · prácticas pendientes</p></div><div data-reveal><span className="eyebrow">APRENDIZAJE CONTINUO</span><h3>La curiosidad<br/>sigue abierta.</h3><p>Cursos de Java y Python · 2022–2024</p><a className="course-link" href="https://www.youtube.com/watch?v=XcUOWCXP5u8" target="_blank" rel="noreferrer">Curso de Codex y agentes de IA <ArrowUpRight size={16}/></a><p className="course-meta">Formación online · Benjamín Cordero</p><div className="languages"><span>IDIOMAS</span><p>Español: nativo · Inglés: B1 certificado</p><p>Experiencia profesional trabajando íntegramente en inglés en Dublín.</p></div></div></div></section>
    <section className="contact" id="contacto"><div className="contact-top" data-reveal><span className="eyebrow">04 / SIGUIENTE PASO</span><span>PRIMER EMPLEO · PRÁCTICAS</span></div><h2 data-reveal>¿Construimos<br/><em>algo juntos?</em></h2><div className="contact-bottom" data-reveal><p>Estoy buscando mi primera oportunidad<br/>en desarrollo de software.<br/><span>Me encantará conocer a tu equipo.</span></p><div className="contact-actions"><a className="pill contact-pill" href={`mailto:${EMAIL}`}><Mail size={21}/> Hablemos <ArrowUpRight size={22}/></a><CopyEmail/></div></div><div className="contact-links"><a href="mailto:radeusto@gmail.com">radeusto@gmail.com</a><a href="https://github.com/faliideusto" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a><a href="https://www.linkedin.com/in/rafael-deusto-966447296/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16}/></a><a href={CV_URL} download>Descargar CV <Download size={16}/></a></div></section>
    <footer><a className="brand" href="#inicio" aria-label="Volver al inicio">rd<span>.</span></a><span>© 2026 Rafael Deusto Espinosa</span><a href="#inicio">Volver arriba ↑</a></footer>
  </main>
}

