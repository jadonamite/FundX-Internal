/**
 * FundX — Live Mainnet Test for New Contracts
 * Targets: fundx-registry, fundx-milestone, fundx-tips
 * Sender : SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39
 *
 * What it does:
 *   1. Reads on-chain interface of all 3 new contracts (free) — proves they're live.
 *   2. Broadcasts ONE live contract-call: (register ...) on fundx-registry.
 *      Metadata-only, no token movement. Generates a real onchain tx + caller signal.
 *
 * Usage:
 *   node test-new-contracts.cjs --dry-run   # check + simulate, no broadcast
 *   node test-new-contracts.cjs             # LIVE broadcast
 */

const {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  getAddressFromPrivateKey,
  stringUtf8CV,
  uintCV,
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '.env') });

const network    = STACKS_MAINNET;
const HIRO_V1    = 'https://api.hiro.so';
const DEPLOYER   = 'SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39';
const FEE        = 10_000n; // 0.01 STX — ample for a simple contract call
const NEW_CONTRACTS = ['fundx-registry', 'fundx-milestone', 'fundx-tips'];
const TEST_ID    = 424242; // sentinel id for the registry smoke-test

const delay = ms => new Promise(r => setTimeout(r, ms));

async function apiFetch(url, retries = 5) {
  for (let i = 1; i <= retries; i++) {
    const res = await fetch(url);
    if (res.status === 429) { await delay(3000 * i); continue; }
    if (!res.ok) throw new Error(`API ${res.status} on ${url}`);
    return res.json();
  }
  throw new Error(`Exhausted retries for ${url}`);
}

async function accountInfo(address) {
  return apiFetch(`${HIRO_V1}/v2/accounts/${address}?proof=0`);
}

async function verifyInterface(name) {
  try {
    const data = await apiFetch(`${HIRO_V1}/v2/contracts/interface/${DEPLOYER}/${name}`);
    const pub = data.functions.filter(f => f.access === 'public').map(f => f.name);
    const ro  = data.functions.filter(f => f.access === 'read_only').map(f => f.name);
    console.log(`   ✅ ${name}`);
    console.log(`      public    : ${pub.join(', ')}`);
    console.log(`      read-only : ${ro.join(', ')}`);
    return true;
  } catch (e) {
    console.log(`   ❌ ${name} — ${e.message}`);
    return false;
  }
}

async function main() {
  const IS_DRY = process.argv.includes('--dry-run');

  const privateKey = process.env.STACKS_MASTER_2_PRIVATE_KEY;
  if (!privateKey) throw new Error('STACKS_MASTER_2_PRIVATE_KEY missing from .env');

  const sender = getAddressFromPrivateKey(privateKey, network.version);

  console.log(`\n${'='.repeat(58)}`);
  console.log(`  FundX New-Contract Live Tester`);
  console.log(`  Network : MAINNET`);
  console.log(`  Sender  : ${sender}`);
  console.log(`  Mode    : ${IS_DRY ? 'DRY RUN' : 'LIVE -- BROADCASTING'}`);
  console.log(`${'='.repeat(58)}\n`);

  // --- Step 1: prove all three contracts are live on mainnet ---
  console.log(`[1] Verifying on-chain interfaces:`);
  for (const c of NEW_CONTRACTS) await verifyInterface(c);

  const info    = await accountInfo(sender);
  const balance = BigInt(parseInt(info.balance, 16));
  const nonce   = info.nonce;
  console.log(`\n  Balance : ${(Number(balance) / 1e6).toFixed(6)} STX`);
  console.log(`  Nonce   : ${nonce}`);

  // --- Step 2: live write to fundx-registry ---
  console.log(`\n[2] Live call: fundx-registry.register (id u${TEST_ID})`);

  const functionArgs = [
    uintCV(TEST_ID),
    stringUtf8CV('FundX Live Test'),
    stringUtf8CV('On-chain smoke test of the new registry contract'),
    stringUtf8CV('Automated mainnet verification by Cipher — confirms register() works end-to-end.'),
    stringUtf8CV('https://fundx.app/test.png'),
    stringUtf8CV('test'),
    stringUtf8CV('Nigeria'),
    stringUtf8CV('https://t.me/jadonamite'),
  ];

  if (IS_DRY) {
    console.log(`   [DRY RUN] Would broadcast register() with fee ${Number(FEE) / 1e6} STX. Skipping.`);
    console.log(`\n${'='.repeat(58)}\n  Dry run complete.\n${'='.repeat(58)}\n`);
    return;
  }

  if (balance < FEE) throw new Error(`Insufficient balance for fee (${Number(balance) / 1e6} STX).`);

  const tx = await makeContractCall({
    contractAddress:   DEPLOYER,
    contractName:      'fundx-registry',
    functionName:      'register',
    functionArgs,
    senderKey:         privateKey,
    network,
    nonce,
    fee:               FEE,
    anchorMode:        AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  });

  const resp = await broadcastTransaction({ transaction: tx, network });

  if (resp.error) {
    console.error(`   ERROR : ${resp.error} — ${resp.reason || ''}`);
    console.error(`   ${JSON.stringify(resp.reason_data || {})}`);
  } else {
    console.log(`   ✅ Broadcast OK`);
    console.log(`   txid     : ${resp.txid}`);
    console.log(`   explorer : https://explorer.hiro.so/txid/${resp.txid}?chain=mainnet`);
  }

  console.log(`\n${'='.repeat(58)}`);
  console.log(`  Done. Address activity:`);
  console.log(`  https://explorer.hiro.so/address/${sender}?chain=mainnet`);
  console.log(`${'='.repeat(58)}\n`);
}

main().catch(err => { console.error('\nFATAL:', err.message); process.exit(1); });
