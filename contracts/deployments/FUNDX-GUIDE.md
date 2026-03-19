# FUNDX ESCROW — DEPLOYMENT GUIDE (USDCx)

---

## BEFORE ANYTHING ELSE

Open `fundx-escrow.clar` and update line 39:

```clojure
;; TESTNET
(define-constant USDCX-CONTRACT 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-token)

;; MAINNET
(define-constant USDCX-CONTRACT 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usdcx)
```

Confirm the exact USDCx principal on explorer.hiro.so before deploying.
A wrong address = all transfers fail.

---

## AMOUNT FORMAT

USDCx has 6 decimal places. All amounts in the contract are atomic units.

| Human amount | Atomic units |
|-------------|--------------|
| 1 USDC      | u1000000     |
| 100 USDC    | u100000000   |
| 5,000 USDC  | u5000000000  |

---

## PROJECT SETUP

```bash
clarinet new fundx
cd fundx
cp fundx-escrow.clar contracts/fundx-escrow.clar
```

Add to Clarinet.toml:
```toml
[contracts.fundx-escrow]
path = "contracts/fundx-escrow.clar"
clarity_version = 2
epoch = "2.5"
```

---

## CLARINET CHECK

```bash
clarinet check
```

Must return zero errors before proceeding.

---

## REPL TEST SEQUENCE

```bash
clarinet console
```

FLEXIBLE campaign:
```clojure
(contract-call? .fundx-escrow create-campaign u1000000000 u100 u0)
;; → (ok u1)

(contract-call? .fundx-escrow donate .usdcx u1 u200000000)
;; → (ok true)

::advance_chain_tip 101

(contract-call? .fundx-escrow withdraw .usdcx u1)
;; → (ok true)  creator gets 196 USDC, platform gets 4 USDC
```

ALL-OR-NOTHING refund path:
```clojure
(contract-call? .fundx-escrow create-campaign u9999000000 u100 u1)
;; → (ok u2)

(contract-call? .fundx-escrow donate .usdcx u2 u50000000)
;; → (ok true)

::advance_chain_tip 101

(contract-call? .fundx-escrow claim-refund .usdcx u2)
;; → (ok true)  50 USDC returned, no fee
```

---

## FUNCTION SIGNATURES

| Function              | Parameters |
|----------------------|------------|
| create-campaign      | (goal uint) (duration uint) (funding-model uint) |
| donate               | (token sip-010-trait) (id uint) (amount uint) |
| withdraw             | (token sip-010-trait) (id uint) |
| claim-refund         | (token sip-010-trait) (id uint) |
| deactivate-campaign  | (id uint) — owner only |

---

## ERROR CODES

| Code | Constant               | Cause |
|------|------------------------|-------|
| u100 | ERR-NOT-FOUND          | Campaign or donation does not exist |
| u101 | ERR-NOT-CREATOR        | Withdraw caller is not the creator |
| u102 | ERR-INACTIVE           | Campaign is deactivated |
| u103 | ERR-EXPIRED            | Donate called after deadline |
| u104 | ERR-GOAL-NOT-REACHED   | All-or-nothing, goal not met |
| u105 | ERR-ALREADY-WITHDRAWN  | Withdraw called twice |
| u106 | ERR-INVALID-AMOUNT     | Zero amount or zero duration |
| u107 | ERR-REFUND-NOT-ALLOWED | Wrong model, too early, or goal was met |
| u108 | ERR-NOT-DONOR          | Refund caller has no donation on record |
| u109 | ERR-STILL-ACTIVE       | Withdraw called before deadline |
| u110 | ERR-INVALID-MODEL      | funding-model is not u0 or u1 |
| u111 | ERR-TRANSFER-FAILED    | USDCx transfer rejected or wrong token passed |
| u112 | ERR-NOT-OWNER          | Deactivate caller is not CONTRACT-OWNER |

---

## DEPLOYMENT

```bash
# Testnet first
clarinet deployments generate --testnet
clarinet deployments apply --testnet

# After full verification:
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```
