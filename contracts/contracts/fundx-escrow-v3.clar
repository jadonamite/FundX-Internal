;; ===========================================================
;; FUNDX ESCROW v3  -  "best of both worlds"
;; ===========================================================
;; Merges:
;;   * indiegogo-v2  -> multi-token allowlist + per-campaign token
;;   * fundx-escrow  -> working enumeration, map-delete refund cleanup,
;;                      documented invariants, reentrancy-safe ordering
;;
;; Clarity   : 2
;; Network   : Stacks mainnet
;; Settles in: any owner-allow-listed SIP-010 token (USDCx by default)
;;             USDCx = SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx
;; Fee       : 2% (200 bps) of total raised, on successful withdrawal only
;;
;; External API is byte-for-byte compatible with indiegogo-v2:
;;   read : get-campaign-count, get-nonce, get-campaign, get-donation,
;;          calculate-fee, calculate-net, is-past-deadline, is-goal-reached,
;;          is-token-allowed
;;   write: create-campaign, donate, withdraw, claim-refund,
;;          deactivate-campaign, set-allowed-token
;; ===========================================================

(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; -----------------------------------------------------------
;; CONSTANTS
;; -----------------------------------------------------------

(define-constant CONTRACT-OWNER       tx-sender)

(define-constant FLEXIBLE             u0)
(define-constant ALL-OR-NOTHING       u1)

(define-constant PLATFORM-FEE-BPS     u200)    ;; 2%
(define-constant BPS-DENOMINATOR      u10000)

;; Error codes - identical numbering to indiegogo-v2 for tooling parity
(define-constant ERR-NOT-FOUND          (err u100))
(define-constant ERR-NOT-CREATOR        (err u101))
(define-constant ERR-INACTIVE           (err u102))
(define-constant ERR-EXPIRED            (err u103))
(define-constant ERR-STILL-ACTIVE       (err u104))
(define-constant ERR-GOAL-NOT-REACHED   (err u105))
(define-constant ERR-ALREADY-WITHDRAWN  (err u106))
(define-constant ERR-INVALID-AMOUNT     (err u107))
(define-constant ERR-REFUND-NOT-ALLOWED (err u108))
(define-constant ERR-NOT-DONOR          (err u109))
(define-constant ERR-TRANSFER-FAILED    (err u110))
(define-constant ERR-NOT-OWNER          (err u111))
(define-constant ERR-TOKEN-NOT-ALLOWED  (err u112))
(define-constant ERR-INVALID-MODEL      (err u113))

;; -----------------------------------------------------------
;; STATE
;; -----------------------------------------------------------

;; 1-indexed campaign counter
(define-data-var campaign-count uint u0)

;; goal / total-raised are in the token's atomic units (USDCx = 6 decimals)
(define-map campaigns
  uint
  {
    creator:       principal,
    token:         principal,   ;; SIP-010 contract this campaign settles in
    goal:          uint,
    deadline:      uint,        ;; block height
    total-raised:  uint,
    withdrawn:     bool,
    active:        bool,
    funding-model: uint         ;; u0 FLEXIBLE | u1 ALL-OR-NOTHING
  }
)

;; Accumulated per-donor contribution. Deleted on refund (true cleanup).
(define-map donations
  { campaign-id: uint, donor: principal }
  uint
)

;; Owner-curated set of settlement tokens
(define-map allowed-tokens principal bool)

;; -----------------------------------------------------------
;; READ-ONLY
;; -----------------------------------------------------------

;; Primary enumeration accessor (the one the frontend calls)
(define-read-only (get-campaign-count)
  (var-get campaign-count)
)

;; Alias kept for fundx-escrow API parity
(define-read-only (get-nonce)
  (var-get campaign-count)
)

(define-read-only (get-campaign (id uint))
  (map-get? campaigns id)
)

;; Returns u0 when the donor has nothing on record (or was refunded)
(define-read-only (get-donation (campaign-id uint) (who principal))
  (default-to u0 (map-get? donations { campaign-id: campaign-id, donor: who }))
)

(define-read-only (is-token-allowed (token principal))
  (default-to false (map-get? allowed-tokens token))
)

(define-read-only (calculate-fee (amount uint))
  (/ (* amount PLATFORM-FEE-BPS) BPS-DENOMINATOR)
)

(define-read-only (calculate-net (amount uint))
  (- amount (calculate-fee amount))
)

(define-read-only (is-past-deadline (id uint))
  (match (map-get? campaigns id)
    campaign (>= block-height (get deadline campaign))
    false
  )
)

(define-read-only (is-goal-reached (id uint))
  (match (map-get? campaigns id)
    campaign (>= (get total-raised campaign) (get goal campaign))
    false
  )
)

;; -----------------------------------------------------------
;; CREATE CAMPAIGN
;; -----------------------------------------------------------
;; token-trait   : a SIP-010 token that the owner has allow-listed
;; goal          : atomic units of that token
;; duration      : number of blocks the campaign stays open
;; funding-model : u0 FLEXIBLE | u1 ALL-OR-NOTHING

(define-public (create-campaign
    (token-trait   <sip-010-trait>)
    (goal          uint)
    (duration      uint)
    (funding-model uint)
  )
  (let (
      (token    (contract-of token-trait))
      (new-id   (+ (var-get campaign-count) u1))
      (deadline (+ block-height duration))
    )
    (asserts! (is-token-allowed token) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (> goal u0)              ERR-INVALID-AMOUNT)
    (asserts! (> duration u0)          ERR-INVALID-AMOUNT)
    (asserts!
      (or (is-eq funding-model FLEXIBLE) (is-eq funding-model ALL-OR-NOTHING))
      ERR-INVALID-MODEL
    )

    (map-set campaigns new-id
      {
        creator:       tx-sender,
        token:         token,
        goal:          goal,
        deadline:      deadline,
        total-raised:  u0,
        withdrawn:     false,
        active:        true,
        funding-model: funding-model
      }
    )
    (var-set campaign-count new-id)
    (ok new-id)
  )
)

;; -----------------------------------------------------------
;; DONATE
;; -----------------------------------------------------------
;; Escrows the token into this contract. Repeat donations accumulate.
;; The passed token must match the campaign's settlement token.

(define-public (donate
    (token-trait <sip-010-trait>)
    (id          uint)
    (amount      uint)
  )
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
    )
    (asserts! (is-eq (contract-of token-trait) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (get active campaign)                                   ERR-INACTIVE)
    (asserts! (< block-height (get deadline campaign))               ERR-EXPIRED)
    (asserts! (> amount u0)                                          ERR-INVALID-AMOUNT)

    ;; Pull funds into escrow
    (unwrap!
      (contract-call? token-trait transfer amount tx-sender (as-contract tx-sender) none)
      ERR-TRANSFER-FAILED
    )

    (map-set donations { campaign-id: id, donor: tx-sender }
      (+ (get-donation id tx-sender) amount)
    )
    (map-set campaigns id
      (merge campaign { total-raised: (+ (get total-raised campaign) amount) })
    )
    (ok true)
  )
)

;; -----------------------------------------------------------
;; WITHDRAW
;; -----------------------------------------------------------
;; FLEXIBLE       : creator withdraws after deadline regardless of goal
;; ALL-OR-NOTHING : creator withdraws after deadline only if goal reached
;; Fee split: 2% -> CONTRACT-OWNER, 98% -> creator.
;; Reentrancy guard: state flipped before any transfer.

(define-public (withdraw
    (token-trait <sip-010-trait>)
    (id          uint)
  )
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (raised   (get total-raised campaign))
      (fee      (calculate-fee raised))
      (net      (- raised fee))
    )
    (asserts! (is-eq (contract-of token-trait) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (is-eq tx-sender (get creator campaign))               ERR-NOT-CREATOR)
    (asserts! (not (get withdrawn campaign))                         ERR-ALREADY-WITHDRAWN)
    (asserts! (>= block-height (get deadline campaign))              ERR-STILL-ACTIVE)
    (asserts!
      (or (is-eq (get funding-model campaign) FLEXIBLE)
          (>= raised (get goal campaign)))
      ERR-GOAL-NOT-REACHED
    )

    ;; Mark settled BEFORE transfers (reentrancy + blocks future donations)
    (map-set campaigns id
      (merge campaign { withdrawn: true, active: false })
    )

    (unwrap! (as-contract (contract-call? token-trait transfer fee tx-sender CONTRACT-OWNER none)) ERR-TRANSFER-FAILED)
    (unwrap! (as-contract (contract-call? token-trait transfer net tx-sender (get creator campaign) none)) ERR-TRANSFER-FAILED)
    (ok true)
  )
)

;; -----------------------------------------------------------
;; CLAIM REFUND
;; -----------------------------------------------------------
;; Eligible only when ALL hold:
;;   1. campaign is ALL-OR-NOTHING
;;   2. deadline has passed
;;   3. goal was NOT reached
;; Full donation returned, no fee. Record DELETED before transfer
;; (true cleanup + double-claim guard).

(define-public (claim-refund
    (token-trait <sip-010-trait>)
    (id          uint)
  )
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (donor    tx-sender)
      (amount   (get-donation id tx-sender))
    )
    (asserts! (is-eq (contract-of token-trait) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (is-eq (get funding-model campaign) ALL-OR-NOTHING)     ERR-REFUND-NOT-ALLOWED)
    (asserts! (>= block-height (get deadline campaign))             ERR-STILL-ACTIVE)
    (asserts! (< (get total-raised campaign) (get goal campaign))    ERR-REFUND-NOT-ALLOWED)
    (asserts! (> amount u0)                                          ERR-NOT-DONOR)

    ;; Delete record BEFORE transfer (double-claim guard + cleanup)
    (map-delete donations { campaign-id: id, donor: donor })

    (unwrap! (as-contract (contract-call? token-trait transfer amount tx-sender donor none)) ERR-TRANSFER-FAILED)
    (ok amount)
  )
)

;; -----------------------------------------------------------
;; ADMIN
;; -----------------------------------------------------------

;; Emergency: block new donations. Does not move escrowed funds.
;; Existing withdraw / refund rights are preserved.
(define-public (deactivate-campaign (id uint))
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (map-set campaigns id (merge campaign { active: false }))
    (ok true)
  )
)

;; Curate the settlement-token allowlist.
(define-public (set-allowed-token (token principal) (allowed bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (ok (map-set allowed-tokens token allowed))
  )
)
