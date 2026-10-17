import {getProjects} from '@/lib/content';
import {ConceptPreview} from '@/components/concept-preview';
export const dynamic='force-dynamic';
export const metadata={title:'Vehicle Concepts'};
export default async function Projects(){
 const projects=await getProjects();
 return <div className="concept-collection">
  <section className="collection-intro"><div><p className="eyebrow">Bonire Concepts Art / Portfolio</p><h1>Designs for<br/>a world in motion<span>.</span></h1></div><div className="collection-intro-copy"><p>Original automotive studies, from shared mobility to expressive everyday vehicles.</p><a href="#concepts">Explore {String(projects.length).padStart(2,'0')} concepts ↓</a></div></section>
  <section id="concepts" className="concept-list" aria-label="Automotive concepts">{projects.map((project,index)=><article className="concept-panel" key={project.slug} aria-labelledby={'concept-'+project.slug}>
   <ConceptPreview film={project.film} name={project.name} image={project.images[0]}/>
   <div className="concept-panel-copy"><div className="concept-meta"><span>{String(index+1).padStart(2,'0')} / BCA</span><span>{project.status}</span></div><div><p className="concept-category">{project.category}</p><h2 id={'concept-'+project.slug}>{project.name}</h2><p className="concept-summary">{project.summary}</p></div><div className="concept-links"><a className="concept-open" href={'/projects/'+project.slug}>Explore design <span>↗</span></a>{project.film?<a className="concept-full-film" href={'/projects/'+project.slug+'#film'}>Watch full film with sound ↗</a>:<span className="concept-stills">Exterior & interior gallery</span>}</div></div>
  </article>)}</section>
  <div className="collection-note"><span>Design archive</span><p>These are concept visualizations. Detailed research, drawings and development documents are reserved for individually approved project rooms.</p></div>
 </div>;
}
