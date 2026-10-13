'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

// A soft circle that trails the pointer: it grows over links and buttons and turns into an "open" badge over project previews.
// Only for a real mouse; touch screens and reduced motion keep the plain cursor.
export function CursorCircle() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const el = ring.current;
    if(!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let x = -100, y = -100, cx = -100, cy = -100, frame = 0;
    const tick = ()=>{
      cx += (x - cx)*0.2; cy += (y - cy)*0.2;
      el.style.translate = `${cx}px ${cy}px`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e:PointerEvent)=>{
      if(e.pointerType !== 'mouse')return;
      x = e.clientX; y = e.clientY;
      if(!el.classList.contains('is-visible')){cx = x; cy = y; el.classList.add('is-visible')}
      const target = e.target as Element;
      el.classList.toggle('is-preview',!!target.closest('.project-preview'));
      el.classList.toggle('is-link',!target.closest('.project-preview') && !!target.closest('a,button,[role="button"]'));
      if(!frame)frame = requestAnimationFrame(tick);
    };
    const hide = ()=>el.classList.remove('is-visible');
    const onOut = (e:MouseEvent)=>{if(!e.relatedTarget)hide()};
    window.addEventListener('pointermove',onMove,{passive:true});
    document.addEventListener('mouseout',onOut);
    window.addEventListener('blur',hide);
    return ()=>{window.removeEventListener('pointermove',onMove);document.removeEventListener('mouseout',onOut);window.removeEventListener('blur',hide);cancelAnimationFrame(frame)};
  },[]);

  return <div className="cursor-circle" ref={ring} aria-hidden="true"><ArrowUpRight size={20}/></div>;
}
