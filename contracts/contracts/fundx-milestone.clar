;; ===========================================================
;; FUNDX MILESTONE ESCROW
;; Multi-tranche release - up to 3 milestone deadlines
;; Clarity Version : 2
;; Token           : USDCx (SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39.usdcx-v2)
;; Network         : Stacks Mainnet
;; ===========================================================
;; Funds are released in up to 3 tranches tied to block heights.
;; Each tranche is 1/3 of total-raised (last tranche gets remainder).
;; FLEXIBLE: creator can claim each tranche after its deadline.
;; ALL-OR-NOTHING: backers can refund if goal not met by deadline 1.
;; ===========================================================

(use-trait sip-010-trait .sip-010-trait-v2.sip-010-trait)

(define-constant CONTRACT-OWNER       tx-sender)
(define-constant USDCX-CONTRACT       .usdcx-v2)

(define-constant FLEXIBLE             u0)
(define-constant ALL-OR-NOTHING       u1)

(define-constant TRANCHE-DENOMINATOR  u3)
(define-constant PLATFORM-FEE-PERCENT u2)
(define-constant FEE-DENOMINATOR      u100)

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
(define-constant ERR-INVALID-MODEL      (err u112))
(define-constant ERR-INVALID-MILESTONES (err u113))
(define-constant ERR-MILESTONE-NOT-DUE  (err u114))
(define-constant ERR-TRANCHE-CLAIMED    (err u115))
(define-constant ERR-NO-MILESTONE       (err u116))


;; -----------------------------------------------------------
;; STATE
;; -----------------------------------------------------------

(define-data-var campaign-nonce uint u0)

;; deadline  : primary campaign deadline (milestone 1 block height)
;; m2-block  : milestone 2 block height (0 = only 1 milestone)
;; m3-block  : milestone 3 block height (0 = only 2 milestones)
;; claimed   : bitmask - bit 0 = tranche 1, bit 1 = tranche 2, bit 2 = tranche 3

(define-map campaigns
  { id: uint }
  {
    creator:       principal,
    goal:          uint,
    deadline:      uint,
    m2-block:      uint,
    m3-block:      uint,
    total-raised:  uint,
    claimed:       uint,
    active:        bool,
    funding-model: uint
  }
)

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

(define-read-only (is-tranche-claimed (id uint) (tranche uint))
  (match (map-get? campaigns { id: id })
    campaign
      (let (
        (bit (if (is-eq tranche u1) u1 (if (is-eq tranche u2) u2 u4)))
      )
        (> (bit-and (get claimed campaign) bit) u0)
      )
    false
  )
)


;; -----------------------------------------------------------
;; CREATE CAMPAIGN
;; -----------------------------------------------------------
;; m1-duration : blocks from now for tranche 1 deadline (required)
;; m2-duration : additional blocks after m1 for tranche 2 (0 = skip)
;; m3-duration : additional blocks after m2 for tranche 3 (0 = skip)
;; Must have at least 1 milestone. m3 requires m2.
;; funding-model : u0 = FLEXIBLE | u1 = ALL-OR-NOTHING

(define-public (create-campaign
    (goal          uint)
    (m1-duration   uint)
    (m2-duration   uint)
    (m3-duration   uint)
    (funding-model uint)
  )
  (begin
    (asserts! (> goal u0)        ERR-INVALID-AMOUNT)
    (asserts! (> m1-duration u0) ERR-INVALID-MILESTONES)
    (asserts!
      (or (is-eq funding-model FLEXIBLE)
          (is-eq funding-model ALL-OR-NOTHING))
      ERR-INVALID-MODEL
    )
    ;; m3 requires m2
    (asserts!
      (or (is-eq m3-duration u0) (> m2-duration u0))
      ERR-INVALID-MILESTONES
    )

    (let (
      (new-id   (+ (var-get campaign-nonce) u1))
      (m1-block (+ block-height m1-duration))
      (m2-block (if (> m2-duration u0) (+ m1-block m2-duration) u0))
      (m3-block (if (> m3-duration u0) (+ m2-block m3-duration) u0))
    )
      (map-set campaigns
        { id: new-id }
        {
          creator:       tx-sender,
          goal:          goal,
          deadline:      m1-block,
          m2-block:      m2-block,
          m3-block:      m3-block,
          total-raised:  u0,
          claimed:       u0,
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
;; Escrows USDCx until milestones are reached.
;; Repeat donations from same donor accumulate.

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

      (unwrap!
        (contract-call? token transfer amount tx-sender (as-contract tx-sender) none)
        ERR-TRANSFER-FAILED
      )

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

      (map-set campaigns
        { id: id }
        (merge campaign { total-raised: (+ (get total-raised campaign) amount) })
      )
      (ok true)
    )
  )
)


;; -----------------------------------------------------------
;; WITHDRAW TRANCHE
;; -----------------------------------------------------------
;; tranche : u1, u2, or u3
;; Each tranche releases 1/3 of total-raised (tranche 3 gets remainder).
;; FLEXIBLE: callable after respective milestone block.
;; ALL-OR-NOTHING: goal must be reached.
;; Fee: 2% of each tranche gross.
;; Reentrancy guard: claimed bitmask updated before transfers.

(define-public (withdraw-tranche
    (token   <sip-010-trait>)
    (id      uint)
    (tranche uint)
  )
  (begin
    (asserts! (and (> id u0) (<= id (var-get campaign-nonce))) ERR-NOT-FOUND)
    (asserts! (and (>= tranche u1) (<= tranche u3))            ERR-NOT-FOUND)
    (let (
      (campaign (unwrap! (map-get? campaigns { id: id }) ERR-NOT-FOUND))
      (raised   (get total-raised campaign))
      (claimed  (get claimed campaign))
      (bit      (if (is-eq tranche u1) u1 (if (is-eq tranche u2) u2 u4)))
    )
      (asserts! (is-eq (contract-of token) USDCX-CONTRACT)     ERR-TRANSFER-FAILED)
      (asserts! (is-eq tx-sender (get creator campaign))        ERR-NOT-CREATOR)
      (asserts! (is-eq (bit-and claimed bit) u0)                ERR-TRANCHE-CLAIMED)
      (asserts!
        (or (is-eq (get funding-model campaign) FLEXIBLE)
            (>= raised (get goal campaign)))
        ERR-GOAL-NOT-REACHED
      )

      ;; Validate milestone exists and deadline passed
      (asserts!
        (if (is-eq tranche u1)
          (>= block-height (get deadline campaign))
          (if (is-eq tranche u2)
            (and
              (> (get m2-block campaign) u0)
              (>= block-height (get m2-block campaign))
            )
            (and
              (> (get m3-block campaign) u0)
              (>= block-height (get m3-block campaign))
            )
          )
        )
        (if (is-eq tranche u1)
          ERR-STILL-ACTIVE
          (if (and (is-eq tranche u2) (is-eq (get m2-block campaign) u0))
            ERR-NO-MILESTONE
            (if (and (is-eq tranche u3) (is-eq (get m3-block campaign) u0))
              ERR-NO-MILESTONE
              ERR-MILESTONE-NOT-DUE
            )
          )
        )
      )

      ;; Compute tranche amount
      ;; Tranche 1 and 2 each get 1/3 of raised.
      ;; Tranche 3 gets the remainder (raised - t1_gross - t2_gross).
      (let (
        (t1-gross (/ raised u3))
        (t2-gross (/ raised u3))
        (t3-gross (- raised (+ t1-gross t2-gross)))
        (gross    (if (is-eq tranche u1) t1-gross (if (is-eq tranche u2) t2-gross t3-gross)))
        (fee      (calculate-fee gross))
        (net      (- gross fee))
      )
        (asserts! (> gross u0) ERR-INVALID-AMOUNT)

        ;; Reentrancy guard - mark claimed before transfers
        (map-set campaigns
          { id: id }
          (merge campaign { claimed: (bit-or claimed bit) })
        )

        (unwrap!
          (as-contract (contract-call? token transfer fee tx-sender CONTRACT-OWNER none))
          ERR-TRANSFER-FAILED
        )

        (unwrap!
          (as-contract (contract-call? token transfer net tx-sender (get creator campaign) none))
          ERR-TRANSFER-FAILED
        )

        (ok { tranche: tranche, gross: gross, fee: fee, net: net })
      )
    )
  )
)


;; -----------------------------------------------------------
;; CLAIM REFUND
;; -----------------------------------------------------------
;; Eligible when ALL THREE hold:
;;   1. Campaign is ALL-OR-NOTHING
;;   2. Deadline (milestone 1) has passed
;;   3. Goal was NOT reached
;; Full donation returned, no fee.
;; Donation record deleted before transfer (double-claim guard).

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

      (map-delete donations { campaign-id: id, donor: tx-sender })

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
