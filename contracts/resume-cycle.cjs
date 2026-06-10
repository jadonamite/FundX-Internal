const { makeContractCall, contractPrincipalCV, uintCV, principalCV,
        AnchorMode, PostConditionMode, getAddressFromPrivateKey, serializeCV } = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '.env') });
const API='https://api.hiro.so', A='SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39', ESCROW='fundx-escrow-v3', TOKEN='usdcx-v2', U=1_000_000n;
const pk=process.env.STACKS_MASTER_2_PRIVATE_KEY, sender=getAddressFromPrivateKey(pk, STACKS_MAINNET.version);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function gj(u){for(let i=0;i<10;i++){try{const r=await fetch(u);if(r.ok)return r.json();}catch(e){}await sleep(4000);}throw new Error('GET');}
const getNonce=async()=>BigInt((await gj(`${API}/v2/accounts/${sender}?proof=0`)).nonce);
const argHex=cv=>{let s=serializeCV(cv);return '0x'+(typeof s==='string'?s:Buffer.from(s).toString('hex')).replace(/^0x/,'');};
async function read(name,fn,args=[]){for(let i=0;i<12;i++){try{const r=await fetch(`${API}/v2/contracts/call-read/${A}/${name}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,arguments:args})});const j=await r.json();if(j.okay)return j.result;}catch(e){}await sleep(5000);}throw new Error('read '+fn);}
const asUint=h=>BigInt('0x'+h.slice(-32)), asBool=h=>h.endsWith('03');
async function send(name,fn,args,nonce){const tx=await makeContractCall({contractAddress:A,contractName:name,functionName:fn,functionArgs:args,senderKey:pk,network:STACKS_MAINNET,nonce,fee:15000n,anchorMode:AnchorMode.Any,postConditionMode:PostConditionMode.Allow,validateWithAbi:false});let ser=tx.serialize();const b=typeof ser==='string'?Buffer.from(ser,'hex'):Buffer.from(ser);for(let i=0;i<8;i++){try{const r=await fetch(`${API}/v2/transactions`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:b});const t=await r.text();if(r.status===200){console.log(`  -> ${fn} ${t.replace(/"/g,'')}`);return;}console.log(`  !! ${fn} ${r.status} ${t}`);}catch(e){}await sleep(4000);}throw new Error('send '+fn);}
async function waitNonce(t){process.stdout.write(`  confirm>=${t}`);for(let i=0;i<200;i++){const n=await getNonce();if(n>=t){console.log(' ok');return;}process.stdout.write('.');await sleep(15000);}throw new Error('confirm timeout');}
const bal=async()=>asUint(await read(TOKEN,'get-balance',[argHex(principalCV(sender))]));
const count=async()=>asUint(await read(ESCROW,'get-campaign-count'));
async function waitDeadline(id){process.stdout.write(`  deadline#${id}`);for(let i=0;i<240;i++){let p=false;try{p=asBool(await read(ESCROW,'is-past-deadline',[argHex(uintCV(id))]));}catch(e){}if(p){console.log(' past');return;}process.stdout.write('.');await sleep(30000);}throw new Error('deadline timeout');}
const C=()=>contractPrincipalCV(A,TOKEN);

(async()=>{
  let n=await getNonce(); console.log('resume nonce',n.toString());

  console.log('\n[5] WITHDRAW flexible #2 (waiting its deadline)');
  await waitDeadline(2n);
  const b0=await bal(); 
  await send(ESCROW,'withdraw',[C(),uintCV(2n)],n); await waitNonce(n+1n); n++;
  console.log('   bal before',b0.toString(),'after',(await bal()).toString(),'(expect 100000000)');

  console.log('\n[6] create ALL-OR-NOTHING #('+( (await count())+1n )+') goal 1e6, dur 1');
  const idA=(await count())+1n;
  await send(ESCROW,'create-campaign',[C(),uintCV(1000000n*U),uintCV(1n),uintCV(1n)],n); await waitNonce(n+1n); n++;
  console.log('   id',idA.toString());
  console.log('[7] donate 5 (below goal)');
  await send(ESCROW,'donate',[C(),uintCV(idA),uintCV(5n*U)],n); await waitNonce(n+1n); n++;
  console.log('   bal after donate',(await bal()).toString(),'(expect 95000000)');

  console.log('[8] CLAIM-REFUND #'+idA+' (waiting deadline)');
  await waitDeadline(idA);
  const r0=await bal();
  await send(ESCROW,'claim-refund',[C(),uintCV(idA)],n); await waitNonce(n+1n); n++;
  console.log('   donation after refund',asUint(await read(ESCROW,'get-donation',[argHex(uintCV(idA)),argHex(principalCV(sender))])).toString(),'(expect 0)');
  console.log('   bal before',r0.toString(),'after',(await bal()).toString(),'(expect 100000000)');
  console.log('\nDONATE+WITHDRAW+REFUND CYCLE COMPLETE.');
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
