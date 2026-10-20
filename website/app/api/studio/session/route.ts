import {getOwnerUser} from '@/lib/owner-auth';
import {isStudioBridge} from '@/lib/studio-bridge';
export async function GET(req:Request){if(!isStudioBridge(req))return new Response('Forbidden',{status:403});return Response.json({user:await getOwnerUser()},{headers:{'Cache-Control':'private, no-store'}});}
