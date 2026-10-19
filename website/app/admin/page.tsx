import {env} from 'cloudflare:workers';
import {isAdmin} from '@/lib/access';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {deskQuery} from '@/lib/admin-model';
import {getDeskData} from '@/lib/admin-data';
import {AdminDesk} from '@/components/admin-desk';
export const dynamic='force-dynamic';
export const metadata={title:'Studio Dashboard',robots:{index:false,follow:false}};
export default async function Admin({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){if(!await isAdmin())return null;const query=deskQuery(await searchParams);const [data,user]=await Promise.all([getDeskData(query),getChatGPTUser()]);return <AdminDesk key={JSON.stringify(query)} query={query} data={data} account={user?.email||''} services={{database:!!env.DB,files:!!env.BUCKET}}/>;}
