'use client';
import {useState} from 'react';
export function OwnerSignIn(){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[show,setShow]=useState(false);
 return <form className="owner-auth-form" onSubmit={async event=>{event.preventDefault();const values=new FormData(event.currentTarget);setBusy(true);setError('');try{const response=await fetch('/api/auth/sign-in/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:String(values.get('email')).trim().toLowerCase(),password:values.get('password'),rememberMe:false})});if(!response.ok){setError(response.status===429?'Too many attempts. Wait five minutes and try again.':'We couldn’t sign you in. Check your email and password.');return;}window.location.assign('/admin');}catch{setError('We couldn’t reach the studio. Please try again.');}finally{setBusy(false);}}}>
  <label>Company email<input type="email" name="email" autoComplete="username" placeholder="you@company.com" maxLength={254} required disabled={busy}/></label>
  <label>Password<div className="owner-password"><input type={show?'text':'password'} name="password" autoComplete="current-password" maxLength={128} required disabled={busy}/><button type="button" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)}>{show?'Hide':'Show'}</button></div></label>
  {error&&<p className="owner-auth-error" role="alert">{error}</p>}
  <button className="owner-submit" type="submit" disabled={busy}>{busy?'Signing in…':'Open Studio Desk'}<span aria-hidden="true">↗</span></button>
  <p className="owner-auth-note">A private workspace for the company owner. Your session ends after eight hours.</p>
 </form>;
}
