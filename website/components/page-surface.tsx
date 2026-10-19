'use client';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
const backgrounds:Record<string,string>={blog:'overhead',about:'overhead',projects:'profile',partnerships:'rear',support:'overhead',contact:'rear'};
export function PageSurface({children}:{children:ReactNode}){
 const pathname=usePathname();
 const section=pathname.split('/')[1]||'home';
 const image=section==='home'?'home':backgrounds[section];
 return <main id="main" className="page-surface" data-page={section}>
  {image&&<div className="page-underlay" aria-hidden="true"><img src={'/backgrounds/'+image+'.webp'} alt="" width={1536} height={748} fetchPriority={section==='home'?'high':'auto'}/></div>}
  <div className="page-content">{children}</div>
 </main>;
}
