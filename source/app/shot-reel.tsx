import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react';

export type Shot = {file:string;title:string;alt:string;width:number;height:number};
const BASE = import.meta.env.BASE_URL;
const DURATION = 5200;

// Screenshot reel: a browser-style frame that plays a project's captures like stories.
// Tall captures scroll inside the frame as if someone were browsing the page; wide ones drift slowly.
export function ShotReel({shots,site,href,label}:{shots:Shot[];site:string;href:string;label:string}){
  const [index,setIndex] = useState(0);
  const [paused,setPaused] = useState(false);
  const [held,setHeld] = useState(false);
  const [visible,setVisible] = useState(false);
  const [still,setStill] = useState(false);
  const root = useRef<HTMLElement>(null);
  const touch = useRef<number|null>(null);
  const go = (i:number)=>setIndex((i+shots.length)%shots.length);

  useEffect(()=>{
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    setStill(reduce.matches);
    const observer = new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:0.35});
    if(root.current)observer.observe(root.current);
    return ()=>observer.disconnect();
  },[]);

  const running = visible && !paused && !held && !still;
  const onKey = (e:React.KeyboardEvent)=>{if(e.key==='ArrowRight'){e.preventDefault();go(index+1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(index-1)}};
  const onTouchStart = (e:React.TouchEvent)=>{touch.current = e.touches[0].clientX};
  const onTouchEnd = (e:React.TouchEvent)=>{
    if(touch.current===null)return;
    const dx = e.changedTouches[0].clientX - touch.current; touch.current = null;
    if(Math.abs(dx)>40)go(index+(dx<0?1:-1));
  };

  return <figure className={`reel${running?' is-running':''}`} ref={root} aria-roledescription="carrusel" aria-label={label}
    onMouseEnter={()=>setHeld(true)} onMouseLeave={()=>setHeld(false)} onFocus={()=>setHeld(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setHeld(false)}} onKeyDown={onKey}>
    <div className="reel-bar">
      <span className="reel-dots" aria-hidden="true"><i/><i/><i/></span>
      <a className="reel-url" href={href} target="_blank" rel="noopener noreferrer"><span>{site}</span><ArrowUpRight size={14}/></a>
      <span className="reel-count" aria-hidden="true">{String(index+1).padStart(2,'0')} / {String(shots.length).padStart(2,'0')}</span>
      <button type="button" className="reel-pause" onClick={()=>setPaused(p=>!p)} aria-label={paused?'Reanudar el pase de capturas':'Pausar el pase de capturas'} aria-pressed={paused}>{paused?<Play size={14} weight="fill"/>:<Pause size={14} weight="fill"/>}</button>
    </div>
    <div className="reel-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-live={running?'off':'polite'}>
      {shots.map((shot,i)=>{
        const tall = shot.height/shot.width > 0.75;
        return <img key={shot.file} className={`${tall?'is-tall':'is-wide'}${i===index?' is-active':''}`} src={`${BASE}assets/shots/${shot.file}`} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" aria-hidden={i!==index}/>
      })}
      <button type="button" className="reel-nav prev" onClick={()=>go(index-1)} aria-label="Captura anterior"><CaretLeft size={20}/></button>
      <button type="button" className="reel-nav next" onClick={()=>go(index+1)} aria-label="Captura siguiente"><CaretRight size={20}/></button>
    </div>
    <ol className="reel-tabs">{shots.map((shot,i)=><li key={shot.file}>
      <button type="button" className={i===index?'is-active':undefined} onClick={()=>go(i)} aria-current={i===index?'true':undefined}>
        <span className="reel-thumb"><img src={`${BASE}assets/shots/${shot.file}`} alt="" width={shot.width} height={shot.height} loading="lazy" decoding="async"/></span>
        <span className="reel-title">{shot.title}</span>
        <span className="reel-progress" aria-hidden="true"><i key={`${index}-${i}`} style={{animationDuration:`${DURATION}ms`}} onAnimationEnd={()=>{if(i===index)go(index+1)}}/></span>
      </button>
    </li>)}</ol>
  </figure>
}
