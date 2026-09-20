import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const url = 'http://localhost:5173/';
async function ready(){try{const response=await fetch(url,{signal:AbortSignal.timeout(2000)});return response.ok && (await response.text()).includes('Rafael Deusto');}catch{return false;}}
if(!await ready()){
  const server=spawn(process.execPath,[resolve(root,'node_modules/vite/bin/vite.js'),'--config','vite.pages.config.ts'],{cwd:root,detached:true,stdio:'ignore',windowsHide:true});
  server.unref();
  for(let attempt=0;attempt<45;attempt++){if(await ready())break;await new Promise(resolve=>setTimeout(resolve,1000));}
}
if(await ready()){
  const browser=spawn('cmd.exe',['/c','start','',url],{detached:true,stdio:'ignore',windowsHide:true});browser.unref();
}else{console.error('No se ha podido abrir el portfolio. Comprueba que sus dependencias estén instaladas con npm ci y prueba npm run dev.');process.exitCode=1;}

