import {betterAuth} from 'better-auth';
import {drizzleAdapter} from '@better-auth/drizzle-adapter';
import * as schema from '@/db/auth-schema';
import type {getDb} from '@/db';
export function createOwnerAuth(database:ReturnType<typeof getDb>,secret:string,origin:string){
 if(secret.length<32)throw new Error('Owner authentication is not configured.');
 return betterAuth({appName:'Bonire Concepts Art',baseURL:origin,basePath:'/api/auth',secret,
  database:drizzleAdapter(database,{provider:'sqlite',schema,transaction:false}),
  emailAndPassword:{enabled:true,disableSignUp:true,minPasswordLength:10,maxPasswordLength:128},
  user:{changeEmail:{enabled:false},deleteUser:{enabled:false}},
  session:{expiresIn:8*60*60,updateAge:60*60,cookieCache:{enabled:false}},
  advanced:{cookiePrefix:'bca-owner',useSecureCookies:true,defaultCookieAttributes:{httpOnly:true,secure:true,sameSite:'strict',path:'/'},ipAddress:{ipAddressHeaders:['x-bca-visitor']}},
  trustedOrigins:[origin],
  rateLimit:{enabled:true,storage:'database',window:60,max:40,customRules:{'/sign-in/email':{window:300,max:8},'/change-password':{window:300,max:5}}}
 });
}
