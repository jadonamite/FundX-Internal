;; ===========================================================
;; FUNDX ESCROW v4  -  STX or USDCx (fundraiser's choice)
;; ===========================================================
;; Each campaign settles in EXACTLY ONE asset, chosen at creation:
;;   * native STX            -> *-stx functions  (stx-transfer?)
;;   * an allow-listed SIP-010 token (e.g. USDCx) -> *-ft functions
;;
;; "Accept both in one campaign" is intentionally OUT OF SCOPE here
;; (it needs per-asset accounting / a price model) - planned for a
;; later version. This contract keeps the proven v3 model (single
;; goal, single total-raised, flexible / all-or-nothing, 2% fee,
;; working enumeration, map-delete refund, reentrancy-safe ordering)
;; and adds a parallel native-STX rail.
;;
;; Clarity : 2  |  Network : Stacks mainnet
;; USDCx   : SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx
;; ===========================================================

(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; -----------------------------------------------------------
;; CONSTANTS
;; -----------------------------------------------------------

(define-constant CONTRACT-OWNER       tx-sender)

(define-constant FLEXIBLE             u0)
(define-constant ALL-OR-NOTHING       u1)

(define-constant PLATFORM-FEE-BPS     u200)   ;; 2%
(define-constant BPS-DENOMINATOR      u10000)

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
(define-constant ERR-WRONG-ASSET        (err u114))  ;; stx fn on ft campaign or vice versa

;; -----------------------------------------------------------
;; STATE
;; -----------------------------------------------------------

(define-data-var campaign-count uint u0)

;; asset-stx = true  -> campaign settles in native STX (token is none)
;; asset-stx = false -> campaign settles in (unwrap token) SIP-010
(define-map campaigns
  uint
  {
    creator:       principal,
    asset-stx:     bool,
    token:         (optional principal),
    goal:          uint,
    deadline:      uint,
    total-raised:  uint,
    withdrawn:     bool,
    active:        bool,
    funding-model: uint
  }
)

(define-map donations { campaign-id: uint, donor: principal } uint)

(define-map allowed-tokens principal bool)

;; -----------------------------------------------------------
;; READ-ONLY
;; -----------------------------------------------------------

(define-read-only (get-campaign-count) (var-get campaign-count))
(define-read-only (get-nonce)          (var-get campaign-count))
(define-read-only (get-campaign (id uint)) (map-get? campaigns id))
(define-read-only (get-donation (campaign-id uint) (who principal))
  (default-to u0 (map-get? donations { campaign-id: campaign-id, donor: who })))
(define-read-only (is-token-allowed (token principal))
  (default-to false (map-get? allowed-tokens token)))
(define-read-only (calculate-fee (amount uint)) (/ (* amount PLATFORM-FEE-BPS) BPS-DENOMINATOR))
(define-read-only (calculate-net (amount uint)) (- amount (calculate-fee amount)))
(define-read-only (is-past-deadline (id uint))
  (match (map-get? campaigns id) c (>= block-height (get deadline c)) false))
(define-read-only (is-goal-reached (id uint))
  (match (map-get? campaigns id) c (>= (get total-raised c) (get goal c)) false))

;; -----------------------------------------------------------
;; PRIVATE - shared validation / accounting (no transfers)
;; -----------------------------------------------------------

(define-private (validate-new (goal uint) (duration uint) (funding-model uint))
  (begin
    (asserts! (> goal u0)     ERR-INVALID-AMOUNT)
    (asserts! (> duration u0) ERR-INVALID-AMOUNT)
    (asserts! (or (is-eq funding-model FLEXIBLE) (is-eq funding-model ALL-OR-NOTHING)) ERR-INVALID-MODEL)
    (ok true)
  )
)

(define-private (store-campaign (asset-stx bool) (token (optional principal)) (goal uint) (duration uint) (funding-model uint))
  (let ((new-id (+ (var-get campaign-count) u1)))
    (map-set campaigns new-id
      {
        creator: tx-sender, asset-stx: asset-stx, token: token, goal: goal,
        deadline: (+ block-height duration), total-raised: u0,
        withdrawn: false, active: true, funding-model: funding-model
      })
    (var-set campaign-count new-id)
    new-id
  )
)

(define-private (record-donation (id uint) (amount uint))
  (begin
    (map-set donations { campaign-id: id, donor: tx-sender }
      (+ (get-donation id tx-sender) amount))
    (map-set campaigns id
      (merge (unwrap-panic (map-get? campaigns id))
        { total-raised: (+ (get total-raised (unwrap-panic (map-get? campaigns id))) amount) }))
    true
  )
)

;; Common donate pre-checks (active, before deadline, amount > 0)
(define-private (assert-open (campaign { creator: principal, asset-stx: bool, token: (optional principal), goal: uint, deadline: uint, total-raised: uint, withdrawn: bool, active: bool, funding-model: uint }) (amount uint))
  (begin
    (asserts! (get active campaign)                    ERR-INACTIVE)
    (asserts! (< block-height (get deadline campaign)) ERR-EXPIRED)
    (asserts! (> amount u0)                            ERR-INVALID-AMOUNT)
    (ok true)
  )
)

;; Common withdraw pre-checks; returns net amount on success
(define-private (assert-withdrawable (campaign { creator: principal, asset-stx: bool, token: (optional principal), goal: uint, deadline: uint, total-raised: uint, withdrawn: bool, active: bool, funding-model: uint }))
  (begin
    (asserts! (is-eq tx-sender (get creator campaign))         ERR-NOT-CREATOR)
    (asserts! (not (get withdrawn campaign))                   ERR-ALREADY-WITHDRAWN)
    (asserts! (>= block-height (get deadline campaign))        ERR-STILL-ACTIVE)
    (asserts! (or (is-eq (get funding-model campaign) FLEXIBLE)
                  (>= (get total-raised campaign) (get goal campaign))) ERR-GOAL-NOT-REACHED)
    (ok true)
  )
)

;; Common refund pre-checks
(define-private (assert-refundable (campaign { creator: principal, asset-stx: bool, token: (optional principal), goal: uint, deadline: uint, total-raised: uint, withdrawn: bool, active: bool, funding-model: uint }) (amount uint))
  (begin
    (asserts! (is-eq (get funding-model campaign) ALL-OR-NOTHING)   ERR-REFUND-NOT-ALLOWED)
    (asserts! (>= block-height (get deadline campaign))            ERR-STILL-ACTIVE)
    (asserts! (< (get total-raised campaign) (get goal campaign))  ERR-REFUND-NOT-ALLOWED)
    (asserts! (> amount u0)                                        ERR-NOT-DONOR)
    (ok true)
  )
)

(define-private (mark-withdrawn (id uint) (campaign { creator: principal, asset-stx: bool, token: (optional principal), goal: uint, deadline: uint, total-raised: uint, withdrawn: bool, active: bool, funding-model: uint }))
  (map-set campaigns id (merge campaign { withdrawn: true, active: false })))

;; -----------------------------------------------------------
;; CREATE
;; -----------------------------------------------------------

(define-public (create-campaign-stx (goal uint) (duration uint) (funding-model uint))
  (begin
    (try! (validate-new goal duration funding-model))
    (ok (store-campaign true none goal duration funding-model))
  )
)

(define-public (create-campaign-ft (token-trait <sip-010-trait>) (goal uint) (duration uint) (funding-model uint))
  (let ((token (contract-of token-trait)))
    (asserts! (is-token-allowed token) ERR-TOKEN-NOT-ALLOWED)
    (try! (validate-new goal duration funding-model))
    (ok (store-campaign false (some token) goal duration funding-model))
  )
)

;; -----------------------------------------------------------
;; DONATE
;; -----------------------------------------------------------

(define-public (donate-stx (id uint) (amount uint))
  (let ((campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND)))
    (asserts! (get asset-stx campaign) ERR-WRONG-ASSET)
    (try! (assert-open campaign amount))
    (unwrap! (stx-transfer? amount tx-sender (as-contract tx-sender)) ERR-TRANSFER-FAILED)
    (ok (record-donation id amount))
  )
)

(define-public (donate-ft (token-trait <sip-010-trait>) (id uint) (amount uint))
  (let ((campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND)))
    (asserts! (not (get asset-stx campaign)) ERR-WRONG-ASSET)
    (asserts! (is-eq (some (contract-of token-trait)) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (try! (assert-open campaign amount))
    (unwrap! (contract-call? token-trait transfer amount tx-sender (as-contract tx-sender) none) ERR-TRANSFER-FAILED)
    (ok (record-donation id amount))
  )
)

;; -----------------------------------------------------------
;; WITHDRAW  (fee 2% -> owner, net -> creator)
;; -----------------------------------------------------------

(define-public (withdraw-stx (id uint))
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (raised   (get total-raised campaign))
      (fee      (calculate-fee raised))
      (net      (- raised fee))
      (creator  (get creator campaign))
    )
    (asserts! (get asset-stx campaign) ERR-WRONG-ASSET)
    (try! (assert-withdrawable campaign))
    (mark-withdrawn id campaign)
    (unwrap! (as-contract (stx-transfer? fee tx-sender CONTRACT-OWNER)) ERR-TRANSFER-FAILED)
    (unwrap! (as-contract (stx-transfer? net tx-sender creator))       ERR-TRANSFER-FAILED)
    (ok true)
  )
)

(define-public (withdraw-ft (token-trait <sip-010-trait>) (id uint))
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (raised   (get total-raised campaign))
      (fee      (calculate-fee raised))
      (net      (- raised fee))
      (creator  (get creator campaign))
    )
    (asserts! (not (get asset-stx campaign)) ERR-WRONG-ASSET)
    (asserts! (is-eq (some (contract-of token-trait)) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (try! (assert-withdrawable campaign))
    (mark-withdrawn id campaign)
    (unwrap! (as-contract (contract-call? token-trait transfer fee tx-sender CONTRACT-OWNER none)) ERR-TRANSFER-FAILED)
    (unwrap! (as-contract (contract-call? token-trait transfer net tx-sender creator none))       ERR-TRANSFER-FAILED)
    (ok true)
  )
)

;; -----------------------------------------------------------
;; CLAIM REFUND  (all-or-nothing, goal missed; full amount, no fee)
;; -----------------------------------------------------------

(define-public (claim-refund-stx (id uint))
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (donor    tx-sender)
      (amount   (get-donation id tx-sender))
    )
    (asserts! (get asset-stx campaign) ERR-WRONG-ASSET)
    (try! (assert-refundable campaign amount))
    (map-delete donations { campaign-id: id, donor: donor })
    (unwrap! (as-contract (stx-transfer? amount tx-sender donor)) ERR-TRANSFER-FAILED)
    (ok amount)
  )
)

(define-public (claim-refund-ft (token-trait <sip-010-trait>) (id uint))
  (let (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (donor    tx-sender)
      (amount   (get-donation id tx-sender))
    )
    (asserts! (not (get asset-stx campaign)) ERR-WRONG-ASSET)
    (asserts! (is-eq (some (contract-of token-trait)) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (try! (assert-refundable campaign amount))
    (map-delete donations { campaign-id: id, donor: donor })
    (unwrap! (as-contract (contract-call? token-trait transfer amount tx-sender donor none)) ERR-TRANSFER-FAILED)
    (ok amount)
  )
)

;; -----------------------------------------------------------
;; ADMIN
;; -----------------------------------------------------------

(define-public (deactivate-campaign (id uint))
  (let ((campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (map-set campaigns id (merge campaign { active: false }))
    (ok true)
  )
)

(define-public (set-allowed-token (token principal) (allowed bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (ok (map-set allowed-tokens token allowed))
  )
)
