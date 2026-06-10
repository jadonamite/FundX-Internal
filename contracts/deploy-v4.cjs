const { makeContractDeploy, AnchorMode, PostConditionMode, ClarityVersion, getAddressFromPrivateKey } = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const { readFileSync } = require('fs'); const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '.env') });
const API='https://api.hiro.so';
(async () => {
  // --- token identity (read-only) ---
  const meta = await (await fetch(`${API}/metadata/v1/ft/SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx`)).json().catch(()=>({}));
  const uri = await (await fetch(`${API}/v2/contracts/call-read/SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE/usdcx/get-token-uri`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender:'SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE',arguments:[]})})).text().catch(()=>'?');
  console.log('TOKEN name:', meta.name, '| symbol:', meta.symbol, '| decimals:', meta.decimals, '| supply:', meta.total_supply);
  console.log('TOKEN uri raw:', uri.slice(0,160));

  // --- deploy v4 contract (asset-agnostic) ---
  const pk = process.env.STACKS_MASTER_2_PRIVATE_KEY;
  const sender = getAddressFromPrivateKey(pk, STACKS_MAINNET.version);
  const nonce = BigInt((await (await fetch(`${API}/v2/accounts/${sender}?proof=0`)).json()).nonce);
  const code = readFileSync(resolve(__dirname,'contracts/fundx-escrow-v4.clar'),'utf8');
  console.log('deploying fundx-escrow-v4 nonce', nonce.toString());
  const tx = await makeContractDeploy({ contractName:'fundx-escrow-v4', codeBody:code, senderKey:pk, network:STACKS_MAINNET, nonce, fee:400000n, anchorMode:AnchorMode.Any, postConditionMode:PostConditionMode.Allow, clarityVersion:ClarityVersion.Clarity2 });
  let ser=tx.serialize(); const bytes=typeof ser==='string'?Buffer.from(ser,'hex'):Buffer.from(ser);
  for(let i=0;i<6;i++){ try{ const r=await fetch(`${API}/v2/transactions`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:bytes}); console.log('DEPLOY HTTP', r.status, await r.text()); return; }catch(e){ console.log('retry',e.message); await new Promise(r=>setTimeout(r,3000)); } }
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
