import type { Metadata } from 'next';
import {Header,Footer} from '@/components/shell';
import './globals.css';
export const metadata:Metadata={title:{default:'Bonire Concepts Art | Automotive Design & IP Development',template:'%s | Bonire Concepts Art'},description:'Independent automotive design and intellectual property development studio with African roots and global ambition. Original concepts, research and strategic collaboration.',applicationName:'Bonire Concepts Art',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'BCA',statusBarStyle:'default'},icons:{icon:[{url:'/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/favicon.ico',type:'image/x-icon'}],shortcut:'/favicon.ico',apple:[{url:'/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><main id="main">{children}</main><Footer/></body></html>;}
