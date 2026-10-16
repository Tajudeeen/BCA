// One-time media ingestion is complete. Reopening imports requires a reviewed source change.
// Deliberately independent of runtime secrets, including stale bindings retained by a host.
export async function PUT(){
 return new Response('Media import is closed',{status:403,headers:{'Cache-Control':'no-store'}});
}
