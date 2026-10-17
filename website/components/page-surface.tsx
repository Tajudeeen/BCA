'use client';
import {useState} from 'react';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
const backgrounds:Record<string,string>={about:'overhead',projects:'profile',partnerships:'rear',support:'overhead',contact:'rear'};
export function PageSurface({children}:{children:ReactNode}){
 const pathname=usePathname();
 const [motion,setMotion]=useState(true);
 const section=pathname.split('/')[1]||'home';
 const image=section==='home'?'home':backgrounds[section];
 return <main id="main" className="page-surface" data-page={section} data-underlay-motion={motion?'on':'off'}>
  {image&&<div className="page-underlay" aria-hidden="true"><img src={'/backgrounds/'+image+'.webp'} alt="" width={1536} height={748} fetchPriority={section==='home'?'high':'auto'}/></div>}
  {image&&<button type="button" className="underlay-motion-toggle" onClick={()=>setMotion(value=>!value)} aria-pressed={!motion} aria-label={motion?'Pause background animation':'Resume background animation'}><span aria-hidden="true">{motion?'Ⅱ':'▷'}</span>{motion?'Pause background':'Resume background'}</button>}
  <div className="page-content">{children}</div>
 </main>;
}
