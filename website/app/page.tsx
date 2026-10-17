import {getProjects} from '@/lib/content';
import {studio} from '@/lib/studio';
export const dynamic='force-dynamic';
export default async function Home(){
 const projects=await getProjects();
 const lead=projects[0];
 return <div className="studio-home">
  <section className="studio-cover" aria-labelledby="studio-title">
   <div className="cover-heading"><h1 id="studio-title">BONIRE<br/><span>CONCEPTS ART</span></h1><div className="cover-intro"><p>Independent automotive design<br/>& intellectual property development.</p><span>Nigeria / A global perspective</span></div></div>
   <a className="cover-image" href={'/projects/'+lead.slug}><img src={lead.images[0]} alt={`${lead.name}, front three-quarter design study`} fetchPriority="high" width={1376} height={768}/><span className="cover-caption"><span>Featured study</span><strong>{lead.name}</strong><span>View project ↗</span></span></a>
   <div className="cover-register"><span>Original automotive concepts</span><a href="#selected-work">Discover the collection ↓</a><span>{String(projects.length).padStart(2,'0')} projects / BCA</span></div>
  </section>
  <section className="work-index" id="selected-work" aria-labelledby="work-title"><div className="index-heading"><h2 id="work-title">Selected work</h2><p>Form, proportion and new approaches to mobility.<br/>Explore the studies behind our design practice.</p><span>01—{String(projects.length).padStart(2,'0')}</span></div>
   <div className="work-layout">{projects.map((project,index)=><article className={'work-entry work-entry-'+index} key={project.slug}><a className="work-image" href={'/projects/'+project.slug}><img src={project.images[index===0?1:0]} alt={`${project.name} vehicle concept`} loading="lazy"/><span className="work-view">Explore study ↗</span></a><div className="work-caption"><span className="work-number">{String(index+1).padStart(2,'0')}</span><div><h3><a href={'/projects/'+project.slug}>{project.name}</a></h3><p>{project.category}</p></div>{project.film?<a className="work-film" href={'/projects/'+project.slug+'#film'}>▶ Film</a>:<span className="work-stage">Design study</span>}</div></article>)}</div>
  </section>
  <section className="studio-notes" aria-labelledby="notes-title"><div className="notes-label"><span>THE STUDIO</span><img src="/brand/bonire-mark-512.png" alt="" width={512} height={512} loading="lazy"/></div><div className="notes-content"><h2 id="notes-title">African roots.<br/>Global ambition.</h2><p className="notes-positioning">{studio.positioning}</p><div className="notes-purpose"><article><h3>Vision</h3><p>{studio.shortVision}</p></article><article><h3>Mission</h3><p>{studio.shortMission}</p></article></div><a className="underlined-link" href="/about">Inside Bonire Concepts Art ↗</a></div></section>
  <section className="studio-invitation"><p>Engineering. Prototyping. Strategic collaboration.</p><h2>Develop the<br/>next idea with us.</h2><div><a href="/partnerships">Explore partnerships ↗</a><a href="/contact">Contact the studio ↗</a><a href="/support">Support our work ↗</a></div></section>
 </div>;
}
