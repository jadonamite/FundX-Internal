const { makeContractCall, contractPrincipalCV, uintCV, principalCV, boolCV,
        AnchorMode, PostConditionMode, getAddressFromPrivateKey, serializeCV } = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '.env') });

const API='https://api.hiro.so';
const A='SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39';   // escrow + token deployer/owner
const ESCROW='fundx-escrow-v3';
const TOKEN='usdcx-v2';                                // mock, owner-mintable
const TOKEN_FQN=`${A}.${TOKEN}`;
const U=1_000_000n;
const pk=process.env.STACKS_MASTER_2_PRIVATE_KEY;
const sender=getAddressFromPrivateKey(pk, STACKS_MAINNET.version);

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function gj(u){for(let i=0;i<8;i++){try{const r=await fetch(u);if(r.ok)return r.json();}catch(e){}await sleep(2000);}throw new Error('GET '+u);}
const getNonce=async()=>BigInt((await gj(`${API}/v2/accounts/${sender}?proof=0`)).nonce);
function argHex(cv){let s=serializeCV(cv);return '0x'+(typeof s==='string'?s:Buffer.from(s).toString('hex')).replace(/^0x/,'');}
async function read(addr,name,fn,args=[]){for(let i=0;i<10;i++){try{
  const r=await fetch(`${API}/v2/contracts/call-read/${addr}/${name}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,arguments:args})});
  const j=await r.json(); if(j.okay) return j.result; }catch(e){} await sleep(2000);} throw new Error('read '+fn);}
const asUint=h=>BigInt('0x'+h.slice(-32));   // last 16 bytes -> works for uint and (ok uint)
const asBool=h=>h.endsWith('03');
async function send(fqn,fn,args,nonce,fee=15000n){
  const [ca,cn]=[fqn.split('.')[0],fqn.split('.')[1]];
  const tx=await makeContractCall({contractAddress:ca,contractName:cn,functionName:fn,functionArgs:args,senderKey:pk,network:STACKS_MAINNET,nonce,fee,anchorMode:AnchorMode.Any,postConditionMode:PostConditionMode.Allow,validateWithAbi:false});
  let ser=tx.serialize();const bytes=typeof ser==='string'?Buffer.from(ser,'hex'):Buffer.from(ser);
  for(let i=0;i<6;i++){try{const r=await fetch(`${API}/v2/transactions`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:bytes});const t=await r.text();if(r.status===200){console.log(`  -> ${fn} ${t.replace(/"/g,'')}`);return;}console.log(`  !! ${fn} ${r.status} ${t}`);}catch(e){console.log('  retry',e.message);}await sleep(2500);}throw new Error('send '+fn);
}
async function waitNonce(t){process.stdout.write(`  confirm(nonce>=${t})`);for(let i=0;i<150;i++){const n=await getNonce();if(n>=t){console.log(' ok');return;}process.stdout.write('.');await sleep(8000);}throw new Error('confirm timeout');}
const balance=async who=>asUint(await read(A,TOKEN,'get-balance',[argHex(principalCV(who))]));
const count=async()=>asUint(await read(A,ESCROW,'get-campaign-count'));
async function waitDeadline(id){process.stdout.write('  wait deadline');for(let i=0;i<80;i++){if(asBool(await read(A,ESCROW,'is-past-deadline',[argHex(uintCV(id))]))){console.log(' past');return;}process.stdout.write('.');await sleep(8000);}throw new Error('deadline timeout');}

(async()=>{
  let n=await getNonce(); console.log('start nonce',n.toString());

  console.log('\n[1] allow-list mock usdcx-v2');
  await send(`${A}.${ESCROW}`,'set-allowed-token',[principalCV(TOKEN_FQN),boolCV(true)],n); await waitNonce(n+1n); n++;
  console.log('    is-token-allowed:', asBool(await read(A,ESCROW,'is-token-allowed',[argHex(principalCV(TOKEN_FQN))])));

  console.log('\n[2] mint 100 mock USDCx to deployer');
  await send(`${A}.${TOKEN}`,'mint',[uintCV(100n*U),principalCV(sender)],n); await waitNonce(n+1n); n++;
  console.log('    deployer mock balance:', (await balance(sender)).toString());

  console.log('\n[3] create FLEXIBLE (goal 10, dur 5)');
  const idF=(await count())+1n;
  await send(`${A}.${ESCROW}`,'create-campaign',[contractPrincipalCV(A,TOKEN),uintCV(10n*U),uintCV(5n),uintCV(0n)],n); await waitNonce(n+1n); n++;
  console.log('    id', idF.toString());
  console.log('[4] donate 5 ->', '#'+idF);
  await send(`${A}.${ESCROW}`,'donate',[contractPrincipalCV(A,TOKEN),uintCV(idF),uintCV(5n*U)],n); await waitNonce(n+1n); n++;
  console.log('    donation recorded:', asUint(await read(A,ESCROW,'get-donation',[argHex(uintCV(idF)),argHex(principalCV(sender))])).toString());
  console.log('    bal after donate:', (await balance(sender)).toString());
  await waitDeadline(idF);
  console.log('[5] withdraw #'+idF);
  const bW0=await balance(sender);
  await send(`${A}.${ESCROW}`,'withdraw',[contractPrincipalCV(A,TOKEN),uintCV(idF)],n); await waitNonce(n+1n); n++;
  console.log('    bal: before',bW0.toString(),'after',(await balance(sender)).toString(),'(expect +5e6 back)');

  console.log('\n[6] create ALL-OR-NOTHING (goal 1e6 unreachable, dur 5)');
  const idA=(await count())+1n;
  await send(`${A}.${ESCROW}`,'create-campaign',[contractPrincipalCV(A,TOKEN),uintCV(1000000n*U),uintCV(5n),uintCV(1n)],n); await waitNonce(n+1n); n++;
  console.log('    id', idA.toString());
  console.log('[7] donate 5 (below goal) ->', '#'+idA);
  await send(`${A}.${ESCROW}`,'donate',[contractPrincipalCV(A,TOKEN),uintCV(idA),uintCV(5n*U)],n); await waitNonce(n+1n); n++;
  console.log('    bal after donate:', (await balance(sender)).toString());
  await waitDeadline(idA);
  console.log('[8] claim-refund #'+idA);
  const bR0=await balance(sender);
  await send(`${A}.${ESCROW}`,'claim-refund',[contractPrincipalCV(A,TOKEN),uintCV(idA)],n); await waitNonce(n+1n); n++;
  console.log('    donation after refund (expect 0):', asUint(await read(A,ESCROW,'get-donation',[argHex(uintCV(idA)),argHex(principalCV(sender))])).toString());
  console.log('    bal: before',bR0.toString(),'after',(await balance(sender)).toString(),'(expect +5e6 back)');

  console.log('\nCYCLE COMPLETE. final nonce', (await getNonce()).toString());
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
