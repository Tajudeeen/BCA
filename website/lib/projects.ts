export type Project = {slug:string;name:string;category:string;summary:string;status:string;images:string[];note?:string};
export const projects:Project[] = [
{slug:'orange-cruise',name:'Orange Cruise',category:'Electric crossover concept',summary:'A sculptural crossover study exploring a confident silhouette, distinctive lighting and a bold orange identity. A vision of everyday mobility with a stronger sense of character.',status:'Concept Design',images:[0,1,2,3].map(i=>`/vehicles/orange-${i}.webp`)},
{slug:'ami',name:'AMI',category:'Utility vehicle concept',summary:'An exploration of utility-led vehicle design, with an upright stance and a practical, purposeful visual language. The final vehicle classification and programme scope are under review.',status:'Concept Design',images:[0,1,2,3].map(i=>`/vehicles/ami-${i}.webp`),note:'Working category, pending studio confirmation.'},
{slug:'mace-freedomm',name:'Mace Freedomm',category:'SUV design study',summary:'A design study in presence, proportion and an assertive SUV silhouette. Selected exterior views introduce the concept without exposing the underlying development material.',status:'Concept Design',images:[0,1,2,3].map(i=>`/vehicles/mace-${i}.webp`)},
{slug:'ara-1',name:'Ara 1',category:'Passenger vehicle concept',summary:'A passenger mobility design study with exterior and cabin explorations. The repository includes EV and CNG-labelled studies; these are design directions rather than validated powertrain specifications.',status:'Concept Design',images:[0,1,2,3].map(i=>`/vehicles/ara-${i}.webp`)}
];
export const statuses=['Concept Design','Advanced Design','Engineering Development','Prototype Development'];
export function validProject(v:string){return v==='studio'||projects.some(p=>p.slug===v);}
