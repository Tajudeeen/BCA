import {studio} from '@/lib/studio';
export default function Home(){
 return <div className="studio-home">
  <section className="studio-cover" aria-labelledby="studio-title">
   <div className="cover-heading"><h1 id="studio-title">BONIRE<br/><span>CONCEPTS ART</span></h1><div className="cover-intro"><p>Independent automotive design<br/>& intellectual property development.</p><span>Nigeria / A global perspective</span></div></div>
   <div className="home-introduction"><p>{studio.tagline}</p><a className="underlined-link" href="/projects">Explore our projects ↗</a></div>
   <div className="cover-register"><span>Research / Design / Development</span><a href="#studio">Discover the studio ↓</a><span>Independent by design</span></div>
  </section>
  <section id="studio" className="studio-notes" aria-labelledby="notes-title"><div className="notes-label"><span>THE STUDIO</span><img src="/brand/bonire-mark-512.png" alt="" width={512} height={512} loading="lazy"/></div><div className="notes-content"><h2 id="notes-title">African roots.<br/>Global ambition.</h2><p className="notes-positioning">{studio.positioning}</p><div className="notes-purpose"><article><h3>Vision</h3><p>{studio.shortVision}</p></article><article><h3>Mission</h3><p>{studio.shortMission}</p></article></div><nav className="studio-explore-actions" aria-label="Explore and contact the studio"><a className="underlined-link" href="/about">Inside Bonire Concepts Art ↗</a><a className="studio-contact-link" href="/contact">Contact us <span aria-hidden="true">↗</span></a></nav></div></section>
  <section className="studio-invitation"><p>Engineering. Prototyping. Strategic collaboration.</p><h2>Develop the<br/>next idea with us.</h2><div><a href="/partnerships">Explore partnerships ↗</a><a href="/contact">Contact the studio ↗</a><a href="/support">Support our work ↗</a></div></section>
 </div>;
}
