import {requireOwner} from '@/lib/owner-auth';
import {deskQuery} from '@/lib/admin-model';
import {getDeskData} from '@/lib/admin-data';
import {getDeskServices} from '@/lib/admin-services';
import {AdminDesk} from '@/components/admin-desk';
export const dynamic='force-dynamic';
export const metadata={title:'Studio Dashboard',robots:{index:false,follow:false}};
export default async function Admin({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const user=await requireOwner();const query=deskQuery(await searchParams);const [data,services]=await Promise.all([getDeskData(query),getDeskServices()]);return <AdminDesk key={JSON.stringify(query)} query={query} data={data} account={user.email} services={services}/>;}
