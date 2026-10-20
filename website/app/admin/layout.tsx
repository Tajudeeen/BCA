import {requireOwner} from '@/lib/owner-auth';
import {AdminShell} from '@/components/admin-shell';
export const dynamic='force-dynamic';
export const metadata={title:'Studio Dashboard',robots:{index:false,follow:false}};
export default async function ProtectedLayout({children}:{children:React.ReactNode}){const user=await requireOwner();return <AdminShell name={user.displayName} email={user.email}>{children}</AdminShell>;}
