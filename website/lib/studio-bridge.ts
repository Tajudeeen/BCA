import {env} from 'cloudflare:workers';
import {timingSafeEqual} from 'node:crypto';
export function isStudioBridge(req:Request){const expected=env.BCA_FRONTEND_KEY;if(!expected)return false;const a=Buffer.from(req.headers.get('authorization')||''),b=Buffer.from('Bearer '+expected);return a.length===b.length&&timingSafeEqual(a,b);}
