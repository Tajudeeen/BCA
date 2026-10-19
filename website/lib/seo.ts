import type {Metadata} from 'next';
import {studioContact} from './contact';
export const siteOrigin='https://bonire-concepts-art.deeen-code.chatgpt.site';
export const absoluteUrl=(path:string)=>new URL(path,siteOrigin).toString();
export function pageMetadata(title:string,description:string,path:string,image='/brand/bonire-mark-512.png'):Metadata{
 const url=absoluteUrl(path); const fullTitle=title+' | Bonire Concepts Art';
 return {title,description,alternates:{canonical:url},openGraph:{type:'website',locale:'en_NG',siteName:'Bonire Concepts Art',title:fullTitle,description,url,images:[{url:absoluteUrl(image),alt:title}]},twitter:{card:'summary_large_image',site:'@The_B_C_A',title:fullTitle,description,images:[absoluteUrl(image)]}};
}
export const organization={'@type':'Organization','@id':absoluteUrl('/#organization'),name:'Bonire Concepts Art',alternateName:'BCA',url:siteOrigin,logo:absoluteUrl('/brand/bonire-mark-512.png'),description:'Independent automotive design and intellectual property development studio with African roots and global ambition.',slogan:"Shaping Africa's Automotive Identity.",email:studioContact.email,telephone:'+2349039533343',sameAs:studioContact.social.map(s=>s.url)};
export function breadcrumbs(items:{name:string;path:string}[]){return {'@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:absoluteUrl(item.path)}))};}
export const publicSections={
 about:{title:'Automotive Design Studio in Nigeria',description:'Meet Bonire Concepts Art, an independent automotive design and IP development studio with African roots, global ambition and original mobility concepts.'},
 partnerships:{title:'Automotive Design Partnerships & IP Licensing',description:'Explore collaboration with BCA on vehicle concept design, engineering development, prototyping and automotive intellectual property licensing.'},
 support:{title:'Support Automotive Design & Mobility Research',description:'Support original automotive concepts and mobility research from Bonire Concepts Art through technical, strategic or financial collaboration.'},
 contact:{title:'Commission Automotive Design | Contact BCA',description:'Contact Bonire Concepts Art to commission automotive design work, discuss vehicle concepts or explore design IP and development partnerships.'},
 privacy:{title:'Privacy Notice',description:'How Bonire Concepts Art handles enquiries and approved project access.'},
 terms:{title:'Website Terms',description:'Terms for viewing Bonire Concepts Art vehicle concepts and requesting design access.'}
} as const;
