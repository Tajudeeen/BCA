export function SocialIcon({name}:{name:string}){
 const shared={width:20,height:20,viewBox:'0 0 24 24','aria-hidden':true as const,focusable:false as const};
 if(name==='Instagram')return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
 if(name==='Facebook')return <svg {...shared} fill="currentColor"><path d="M14.1 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H8v3.2h2.7V21z"/></svg>;
 if(name==='X')return <svg {...shared} fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.5L1 2h6.5l4.4 6.8L18.9 2zm-1.1 18h1.7L6.6 3.9H4.8z"/></svg>;
 if(name==='TikTok')return <svg {...shared} fill="currentColor"><path d="M16.6 2c.3 2.6 1.8 4.2 4.4 4.4v3.2c-1.6.1-3.1-.5-4.4-1.4v6.6c0 8.4-12.2 8.3-12.2.1 0-3.7 3.3-6.6 7-6v3.3c-4.2-1.3-5.5 5-1.3 5.6 1.6.2 3.1-1 3.1-2.8V2z"/></svg>;
 if(name==='WhatsApp')return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.4 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.4 11.5z"/><path d="m8.1 7.6 1.5 2-1 1c.8 1.8 2 3 3.8 3.8l1-1 2 1.5c-.3 1.1-1.2 1.7-2.3 1.4-3.4-.9-6-3.5-6.9-6.7-.3-1 .3-1.7 1.9-2z"/></svg>;
 return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>;
}
