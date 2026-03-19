;; ===========================================================
;; FUNDX ESCROW CONTRACT
;; Clarity Version : 2
;; Token           : USDCx
;; Contract        : ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx
;; ===========================================================


;; -----------------------------------------------------------
;; SIP-010 TRAIT
;; -----------------------------------------------------------

(use-trait sip-010-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard.sip-010-trait)


;; -----------------------------------------------------------
;; CONSTANTS
;; -----------------------------------------------------------

(define-constant CONTRACT-OWNER        tx-sender)
(define-constant USDCX-CONTRACT        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx)

(define-constant FLEXIBLE              u0)
(define-constant ALL-OR-NOTHING        u1)

(define-constant PLATFORM-FEE-PERCENT  u2)
(define-constant FEE-DENOMINATOR       u100)

(define-constant ERR-NOT-FOUND          (err u100))
(define-constant ERR-NOT-CREATOR        (err u101))
(define-constant ERR-INACTIVE           (err u102))
(define-constant ERR-EXPIRED            (err u103))
(define-constant ERR-GOAL-NOT-REACHED   (err u104))
(define-constant ERR-ALREADY-WITHDRAWN  (err u105))
(define-constant ERR-INVALID-AMOUNT     (err u106))
(define-constant ERR-REFUND-NOT-ALLOWED (err u107))
(define-constant ERR-NOT-DONOR          (err u108))
(define-constant ERR-STILL-ACTIVE       (err u109))
(define-constant ERR-INVALID-MODEL      (err u110))
(define-constant ERR-TRANSFER-FAILED    (err u111))
(define-constant ERR-NOT-OWNER          (err u112))


;; -----------------------------------------------------------
;; STATE
;; -----------------------------------------------------------

(define-data-var campaign-nonce uint u0)

;; goal and amounts are in USDCx atomic units (6 decimals)
;; 1 USDC = u1000000
(define-map campaigns
  { id: uint }
  {
    creator:       principal,
    goal:          uint,
    deadline:      uint,
    total-raised:  uint,
    withdrawn:     bool,
    active:        bool,
    funding-model: uint
  }
)

;; Accumulated per-donor per-campaign contribution
(define-map donations
  { campaign-id: uint, donor: principal }
  { amount: uint }
)


;; -----------------------------------------------------------
;; READ-ONLY
;; -----------------------------------------------------------

(define-read-only (get-campaign (id uint))
  (map-get? campaigns { id: id })
)

(define-read-only (get-donation (campaign-id uint) (who principal))
  (map-get? donations { campaign-id: campaign-id, donor: who })
)

(define-read-only (get-nonce)
  (var-get campaign-nonce)
)

(define-read-only (calculate-fee (amount uint))
  (/ (* amount PLATFORM-FEE-PERCENT) FEE-DENOMINATOR)
)

(define-read-only (calculate-net (amount uint))
  (- amount (calculate-fee amount))
)

(define-read-only (is-past-deadline (id uint))
  (match (map-get? campaigns { id: id })
    campaign (>= block-height (get deadline campaign))
    false
  )
)

(define-read-only (is-goal-reached (id uint))
  (match (map-get? campaigns { id: id })
    campaign (>= (get total-raised campaign) (get goal campaign))
    false
  )
)


;; -----------------------------------------------------------
;; CREATE CAMPAIGN
;; -----------------------------------------------------------
;; goal          : USDCx atomic units (e.g. u5000000000 = 5000 USDC)
;; duration      : number of blocks the campaign runs
;; funding-model : u0 = FLEXIBLE | u1 = ALL-OR-NOTHING

(define-public (create-campaign
    (goal          uint)
    (duration      uint)
    (funding-model uint)
  )
  (begin
    (asserts! (> goal u0)     ERR-INVALID-AMOUNT)
    (asserts! (> duration u0) ERR-INVALID-AMOUNT)
    (asserts!
      (or (is-eq funding-model FLEXIBLE)
          (is-eq funding-model ALL-OR-NOTHING))
      ERR-INVALID-MODEL
    )
    (let (
      (new-id   (+ (var-get campaign-nonce) u1))
      (deadline (+ block-height duration))
    )
      (map-set campaigns
        { id: new-id }
        {
          creator:       tx-sender,
          goal:          goal,
          deadline:      deadline,
          total-raised:  u0,
          withdrawn:     false,
          active:        true,
          funding-model: funding-model
        }
      )
      (var-set campaign-nonce new-id)
      (ok new-id)
    )
  )
)


;; -----------------------------------------------------------
;; DONATE
;; -----------------------------------------------------------
;; Moves USDCx from donor into contract escrow.
;; Repeat donations from the same donor accumulate.
;;
;; token  : must be USDCX-CONTRACT
;; id     : campaign ID
;; amount : USDCx atomic units

(define-public (donate
    (token  <sip-010-trait>)
    (id     uint)
    (amount uint)
  )
  (begin
    (asserts! (and (> id u0) (<= id (var-get campaign-nonce))) ERR-NOT-FOUND)
    (let (
      (campaign (unwrap! (map-get? campaigns { id: id }) ERR-NOT-FOUND))
    )
      (asserts! (is-eq (contract-of token) USDCX-CONTRACT) ERR-TRANSFER-FAILED)
      (asserts! (get active campaign)                       ERR-INACTIVE)
      (asserts! (< block-height (get deadline campaign))    ERR-EXPIRED)
      (asserts! (> amount u0)                               ERR-INVALID-AMOUNT)

      ;; Transfer USDCx from donor to contract (escrow)
      (unwrap!
        (contract-call? token transfer amount tx-sender (as-contract tx-sender) none)
        ERR-TRANSFER-FAILED
      )

      ;; Accumulate donor balance
      (let (
        (existing (default-to u0
          (get amount (map-get? donations { campaign-id: id, donor: tx-sender }))
        ))
      )
        (map-set donations
          { campaign-id: id, donor: tx-sender }
          { amount: (+ existing amount) }
        )
      )

      ;; Update campaign running total
      (map-set campaigns
        { id: id }
        (merge campaign { total-raised: (+ (get total-raised campaign) amount) })
      )

      (ok true)
    )
  )
)


;; -----------------------------------------------------------
;; WITHDRAW
;; -----------------------------------------------------------
;; FLEXIBLE      : callable after deadline regardless of goal
;; ALL-OR-NOTHING: callable after deadline only if goal reached
;;
;; Fee split:
;;   CONTRACT-OWNER receives 2% of total-raised
;;   creator        receives 98% of total-raised
;;
;; Reentrancy guard: withdrawn set true before any transfer.

(define-public (withdraw
    (token <sip-010-trait>)
    (id    uint)
  )
  (begin
    (asserts! (and (> id u0) (<= id (var-get campaign-nonce))) ERR-NOT-FOUND)
    (let (
      (campaign (unwrap! (map-get? campaigns { id: id }) ERR-NOT-FOUND))
      (raised   (get total-raised campaign))
      (fee      (calculate-fee raised))
      (net      (- raised fee))
    )
      (asserts! (is-eq (contract-of token) USDCX-CONTRACT)      ERR-TRANSFER-FAILED)
      (asserts! (is-eq tx-sender (get creator campaign))         ERR-NOT-CREATOR)
      (asserts! (not (get withdrawn campaign))                   ERR-ALREADY-WITHDRAWN)
      (asserts! (>= block-height (get deadline campaign))        ERR-STILL-ACTIVE)
      (asserts!
        (or
          (is-eq (get funding-model campaign) FLEXIBLE)
          (>= raised (get goal campaign))
        )
        ERR-GOAL-NOT-REACHED
      )

      ;; Reentrancy guard: mark withdrawn BEFORE transfers
      (map-set campaigns
        { id: id }
        (merge campaign { withdrawn: true, active: false })
      )

      ;; Transfer 2% fee to platform owner
      (unwrap!
        (as-contract (contract-call? token transfer fee tx-sender CONTRACT-OWNER none))
        ERR-TRANSFER-FAILED
      )

      ;; Transfer 98% net to creator
      (unwrap!
        (as-contract (contract-call? token transfer net tx-sender (get creator campaign) none))
        ERR-TRANSFER-FAILED
      )

      (ok true)
    )
  )
)


;; -----------------------------------------------------------
;; CLAIM REFUND
;; -----------------------------------------------------------
;; Eligible only when ALL THREE conditions are true:
;;   1. Campaign is ALL-OR-NOTHING (model = u1)
;;   2. Deadline has passed
;;   3. Goal was NOT reached
;;
;; Full donation returned with no fee.
;; Record deleted BEFORE transfer to prevent double-claim.

(define-public (claim-refund
    (token <sip-010-trait>)
    (id    uint)
  )
  (begin
    (asserts! (and (> id u0) (<= id (var-get campaign-nonce))) ERR-NOT-FOUND)
    (let (
      (campaign (unwrap! (map-get? campaigns { id: id })                            ERR-NOT-FOUND))
      (donation (unwrap! (map-get? donations { campaign-id: id, donor: tx-sender }) ERR-NOT-DONOR))
      (amount   (get amount donation))
    )
      (asserts! (is-eq (contract-of token) USDCX-CONTRACT)              ERR-TRANSFER-FAILED)
      (asserts! (is-eq (get funding-model campaign) ALL-OR-NOTHING)      ERR-REFUND-NOT-ALLOWED)
      (asserts! (>= block-height (get deadline campaign))                ERR-REFUND-NOT-ALLOWED)
      (asserts! (< (get total-raised campaign) (get goal campaign))      ERR-REFUND-NOT-ALLOWED)
      (asserts! (> amount u0)                                            ERR-INVALID-AMOUNT)

      ;; Delete record BEFORE transfer (double-claim guard)
      (map-delete donations { campaign-id: id, donor: tx-sender })

      ;; Return full donation to donor, no fee
      (unwrap!
        (as-contract (contract-call? token transfer amount tx-sender tx-sender none))
        ERR-TRANSFER-FAILED
      )

      (ok true)
    )
  )
)


;; -----------------------------------------------------------
;; ADMIN - EMERGENCY DEACTIVATE
;; -----------------------------------------------------------
;; CONTRACT-OWNER only.
;; Blocks new donations. Does not move or freeze escrowed funds.
;; Existing withdrawal and refund rights are preserved.

(define-public (deactivate-campaign (id uint))
  (begin
    (asserts! (and (> id u0) (<= id (var-get campaign-nonce))) ERR-NOT-FOUND)
    (let (
      (campaign (unwrap! (map-get? campaigns { id: id }) ERR-NOT-FOUND))
    )
      (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
      (map-set campaigns { id: id } (merge campaign { active: false }))
      (ok true)
    )
  )
)
