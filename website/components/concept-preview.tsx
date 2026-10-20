'use client';
import {useEffect,useRef,useState} from 'react';
import type {ProjectFilm} from '@/lib/projects';
export function ConceptPreview({film,name,image}:{film?:ProjectFilm;name:string;image:string}){
 const root=useRef<HTMLDivElement>(null);
 const video=useRef<HTMLVideoElement>(null);
 const [visible,setVisible]=useState(false);
 const [loaded,setLoaded]=useState(false);
 const [playing,setPlaying]=useState(false);
 const [paused,setPaused]=useState(false);
 const [failed,setFailed]=useState(false);
 const [automatic,setAutomatic]=useState(false);
 const [manual,setManual]=useState(false);
 useEffect(()=>{
  if(!film)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
  const update=()=>setAutomatic(!motion.matches&&!connection?.saveData);
  update();motion.addEventListener('change',update);
  const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.25});
  if(root.current)observer.observe(root.current);
  return ()=>{observer.disconnect();motion.removeEventListener('change',update)};
 },[film]);
 useEffect(()=>{if(visible&&automatic)setLoaded(true)},[visible,automatic]);
 useEffect(()=>{
  const element=video.current;if(!element)return;
  if(visible&&(automatic||manual)&&loaded&&!paused){element.play().catch(()=>setPlaying(false))}else element.pause();
 },[visible,automatic,manual,loaded,paused]);
 async function toggle(){
  const element=video.current;if(!element)return;
  if(playing){setPaused(true);element.pause();return}
  setManual(true);setLoaded(true);setPaused(false);setFailed(false);
  if(!element.getAttribute('src'))element.src=film!.src;
  if(element.error)element.load();
  try{await element.play()}catch{setPlaying(false);setFailed(true)}
 }
 return <div className="concept-media" ref={root}>
  {film?<><video ref={video} src={loaded?film.src:undefined} poster={film.poster} muted loop playsInline preload="none" aria-label={`${name}, silent animated design preview`} onPlay={()=>{setPlaying(true);setFailed(false)}} onPause={()=>setPlaying(false)} onError={()=>{setFailed(true);setPlaying(false)}}/><div className="preview-top"><span className={playing?'motion-label is-playing':'motion-label'}><i aria-hidden="true"/>{playing?'In motion':'Concept film'}</span><span>Silent preview</span></div><button type="button" className="preview-control" onClick={toggle} aria-label={`${playing?'Pause':'Play'} ${name} preview`}><span aria-hidden="true">{playing?'Ⅱ':'▷'}</span>{failed?'Retry preview':playing?'Pause':'Play preview'}</button></>:<img src={image} alt={`${name} automotive design study`} loading="lazy"/>}
 </div>;
}
