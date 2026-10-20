import type {Project} from './projects';
type Enquiry={id:string;kind:string;project:string;name:string;email:string;details:string;status:string;notes:string;updatedAt:number;createdAt:number};
export type DeskData={counts:{enquiries:number;new:number;reviewing:number;active:number;published:number;drafts:number;files:number;projects:number};content:Project[];recent:{id:string;actor:string;action:string;subject:string;createdAt:number}[];latestRequests:Enquiry[];revisions:Record<string,number>;rows:Record<string,unknown>[];total:number;page:number;now:number};
