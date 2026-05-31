/**
 * FundX — Deploy New Contracts to Mainnet
 * Deploys: indiegogo-v2, fundx-registry, fundx-milestone
 * Sender : SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39
 */

const {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  ClarityVersion,
  getAddressFromPrivateKey,
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const { readFileSync } = require('fs');
const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '.env') });

const network  = STACKS_MAINNET;
const DELAY_MS = 20000;

const CONTRACTS = [
  {
    name:    'fundx-tips',
    file:    resolve(__dirname, 'contracts/fundx-tips.clar'),
  },
  {
    name:    'fundx-milestone',
    file:    resolve(__dirname, 'contracts/fundx-milestone.clar'),
  },
];

const delay = ms => new Promise(r => setTimeout(r, ms));

const HIRO_V1 = 'https://api.hiro.so';

async function apiFetch(url, retries = 5) {
  for (let i = 1; i <= retries; i++) {
    const res = await fetch(url);
    if (res.status === 429) { await delay(3000 * i); continue; }
    if (!res.ok) throw new Error(`API ${res.status} on ${url}`);
    return res.json();
  }
  throw new Error(`Exhausted retries for ${url}`);
}

async function fetchAccountInfo(address) {
  return apiFetch(`${HIRO_V1}/v2/accounts/${address}?proof=0`);
}

async function fetchNonce(address) {
  const data = await fetchAccountInfo(address);
  return data.nonce;
}

async function fetchBalance(address) {
  const data = await fetchAccountInfo(address);
  return BigInt(parseInt(data.balance, 16));
}

async function main() {
  const IS_DRY = process.argv.includes('--dry-run');

  const privateKey = process.env.STACKS_MASTER_2_PRIVATE_KEY;
  if (!privateKey) throw new Error('STACKS_MASTER_2_PRIVATE_KEY missing from .env');

  const sender = getAddressFromPrivateKey(privateKey, network.version);
  console.log(`\n${'='.repeat(58)}`);
  console.log(`  FundX Contract Deployer`);
  console.log(`  Network : MAINNET`);
  console.log(`  Sender  : ${sender}`);
  console.log(`  Mode    : ${IS_DRY ? 'DRY RUN' : 'LIVE -- BROADCASTING'}`);
  console.log(`${'='.repeat(58)}\n`);

  const balance = await fetchBalance(sender);
  console.log(`  Balance : ${(Number(balance) / 1e6).toFixed(6)} STX\n`);

  if (!IS_DRY && balance < 300_000n) {
    throw new Error(`Insufficient balance (${Number(balance) / 1e6} STX). Need at least 0.3 STX. Run sweep first.`);
  }

  let nonce = await fetchNonce(sender);
  console.log(`  Nonce   : ${nonce}\n`);
  console.log(`${'='.repeat(58)}`);

  for (let i = 0; i < CONTRACTS.length; i++) {
    const c = CONTRACTS[i];
    const code = readFileSync(c.file, 'utf8');

    console.log(`\n[${i + 1}/${CONTRACTS.length}] Deploying: ${c.name}`);
    console.log(`   Source : ${c.file.split('/').pop()}`);
    console.log(`   Nonce  : ${nonce}`);

    if (IS_DRY) {
      console.log(`   [DRY RUN] Skipping broadcast.`);
      nonce++;
      continue;
    }

    try {
      const tx = await makeContractDeploy({
        contractName:    c.name,
        codeBody:        code,
        senderKey:       privateKey,
        network,
        nonce,
        fee:             300_000n,
        anchorMode:      AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        clarityVersion:  ClarityVersion.Clarity2,
      });

      const resp = await broadcastTransaction({ transaction: tx, network });

      if (resp.error) {
        console.error(`   ERROR : ${resp.error} — ${resp.reason || ''}`);
      } else {
        const txid = resp.txid;
        console.log(`   OK    : https://explorer.hiro.so/txid/${txid}?chain=mainnet`);
      }

      nonce++;

      if (i < CONTRACTS.length - 1) {
        console.log(`   Waiting ${DELAY_MS / 1000}s before next deploy...`);
        await delay(DELAY_MS);
      }

    } catch (err) {
      console.error(`   FAILED: ${err.message}`);
      nonce++;
    }
  }

  console.log(`\n${'='.repeat(58)}`);
  console.log(`  Done. Verify on Hiro Explorer:`);
  console.log(`  https://explorer.hiro.so/address/${sender}?chain=mainnet`);
  console.log(`${'='.repeat(58)}\n`);
}

main().catch(err => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
