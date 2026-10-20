import {env} from 'cloudflare:workers';
export async function getDeskServices(){return {database:!!env.DB,files:!!env.BUCKET};}
