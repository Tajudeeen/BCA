import type {NextConfig} from 'next';
const backend='https://bonire-concepts-art.deeen-code.chatgpt.site';
const config:NextConfig={async redirects(){return [{source:'/admin/:path*',destination:backend+'/admin/:path*',permanent:false},{source:'/private/:path*',destination:backend+'/private/:path*',permanent:false}];},poweredByHeader:false};
export default config;
