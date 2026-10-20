import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/access';
import {AdminShell} from '@/components/admin-shell';
export const dynamic='force-dynamic';
export const metadata={title:'Studio Dashboard',robots:{index:false,follow:false}};
export default async function ProtectedLayout({children}:{children:React.ReactNode}){const user=await requireChatGPTUser('/admin');if(!await isAdmin())return <section className="desk-restricted"><a href="/"><img src="/brand/bonire-mark-192.png" alt="Bonire Concepts Art" width={64} height={64}/></a><p className="eyebrow">Private studio workspace</p><h1>Your dashboard<br/>needs admin access.</h1><p>You’re signed in as {user.email}. This account hasn’t been added as a studio administrator.</p><p>The site owner must configure the approved administrator sign-in emails before dashboard records or publishing tools can be opened.</p><a className="button" href="/">Return to the website ↗</a></section>;return <AdminShell name={user.displayName} email={user.email}>{children}</AdminShell>;}
