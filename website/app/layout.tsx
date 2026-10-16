import type { Metadata } from 'next';
import {Header,Footer} from '@/components/shell';
import './globals.css';
export const metadata:Metadata={title:{default:'Bonire Concepts Art | Original Automotive Design',template:'%s | Bonire Concepts Art'},description:'Independent automotive design and mobility concepts from Nigeria. Explore original vehicle concepts and opportunities for design, engineering and manufacturing collaboration.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><main id="main">{children}</main><Footer/></body></html>;}
