import type { Metadata } from 'next';
import {Header,Footer} from '@/components/shell';
import './globals.css';
export const metadata:Metadata={title:{default:'Bonire Concepts Art | Automotive Design & IP Development',template:'%s | Bonire Concepts Art'},description:'Independent automotive design and intellectual property development studio with African roots and global ambition. Original concepts, research and strategic collaboration.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><main id="main">{children}</main><Footer/></body></html>;}
