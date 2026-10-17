'use client';
import {useRef,useState} from 'react';
import type {ProjectFilm as Film} from '@/lib/projects';
export function ProjectFilm({film,name}:{film:Film;name:string}){
 const player=useRef<HTMLVideoElement>(null);
 const [started,setStarted]=useState(false);
 const [failed,setFailed]=useState(false);
 async function play(){setFailed(false);setStarted(true);const video=player.current;if(!video)return;if(video.error)video.load();try{await video.play();}catch{setFailed(true);}}
 return <section className="project-film" id="film" aria-labelledby="film-heading"><div className="film-heading"><div><p className="eyebrow">The concept in motion</p><h2 id="film-heading">{name}. In motion.</h2></div><span className="label">{film.label} · {Math.floor(film.durationSeconds/60)}:{String(Math.round(film.durationSeconds%60)).padStart(2,'0')}</span></div><div className="film-player"><video ref={player} controls={started&&!failed} playsInline preload="none" poster={film.poster} aria-label={`${name} ${film.label}`} aria-describedby="film-description" onPlay={()=>{setStarted(true);setFailed(false)}} onError={()=>setFailed(true)}><source src={film.src} type="video/mp4"/>Your browser doesn't support video playback. <a href={film.src}>Open the concept film</a>.</video>{(!started||failed)&&<button className="film-play" onClick={play}><span aria-hidden="true">▷</span>{failed?'Retry playback':'Play concept film'}</button>}</div><p id="film-description" className="film-caption">{failed?'The film couldn’t load. Try again, or open the video directly.':film.description} <a href={film.src} target="_blank" rel="noreferrer">Open video ↗</a></p></section>;
}
