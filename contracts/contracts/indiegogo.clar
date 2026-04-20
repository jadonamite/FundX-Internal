;; ==========================================================
;; FUNDX ESCROW CONTRACT
;; ==========================================================
;; Network  : Stacks
;; Version  : 1.0.0
;; -----------------------------------------------------------
(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
;; -----------------------------------------------------------
;; -----------------------------------------------------------

(define-constant CONTRACT-OWNER        tx-sender)

(define-constant FLEXIBLE              u0)
(define-constant ALL-OR-NOTHING        u1)

(define-constant PLATFORM-FEE-BPS      u200)
(define-constant BPS-DENOMINATOR       u10000)

;; Error Codes
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
;; DATA VARIABLES
;; -----------------------------------------------------------

(define-data-var campaign-count uint u0)

;; -----------------------------------------------------------
;; DATA MAPS
;; -----------------------------------------------------------

(define-map campaigns
  uint
  {
    creator:       principal,
    token:         principal,
    goal:          uint,
    deadline:      uint,
    total-raised:  uint,
    withdrawn:     bool,
    active:        bool,
    funding-model: uint
  }
)

(define-map donations
  { campaign-id: uint, donor: principal }
  uint
)

(define-map allowed-tokens
  principal
  bool
)

;; -----------------------------------------------------------
;; READ-ONLY FUNCTIONS
;; -----------------------------------------------------------

(define-read-only (get-campaign (id uint))
  (map-get? campaigns id)
)

(define-read-only (get-donation (campaign-id uint) (who principal))
  (default-to u0 (map-get? donations { campaign-id: campaign-id, donor: who }))
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
;; PUBLIC FUNCTIONS
;; -----------------------------------------------------------

;; CREATE CAMPAIGN
(define-public (create-campaign
    (token-trait   <sip-010-trait>)
    (goal          uint)
    (duration      uint)
    (funding-model uint)
  )
  (let
    (
      (token (contract-of token-trait))
      (new-id (+ (var-get campaign-count) u1))
      (deadline (+ block-height duration))
    )
    (asserts! (default-to false (map-get? allowed-tokens token)) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (> goal u0) ERR-INVALID-AMOUNT)
    (asserts! (> duration u0) ERR-INVALID-AMOUNT)
    (asserts!
      (or (is-eq funding-model FLEXIBLE)
          (is-eq funding-model ALL-OR-NOTHING))
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

;; DONATE
(define-public (donate
    (token-trait <sip-010-trait>)
    (id          uint)
    (amount      uint)
  )
  (let
    (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
    )
    (asserts! (is-eq (contract-of token-trait) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (get active campaign) ERR-INACTIVE)
    (asserts! (< block-height (get deadline campaign)) ERR-EXPIRED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)

    ;; Transfer tokens from donor to contract
    (unwrap! (contract-call? token-trait transfer amount tx-sender (as-contract tx-sender) none) ERR-TRANSFER-FAILED)

    (map-set donations { campaign-id: id, donor: tx-sender }
      (+ (get-donation id tx-sender) amount)
    )

    (map-set campaigns id
      (merge campaign { total-raised: (+ (get total-raised campaign) amount) })
    )

    (ok true)
  )
)

;; WITHDRAW
(define-public (withdraw
    (token-trait <sip-010-trait>)
    (id          uint)
  )
  (let
    (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (raised   (get total-raised campaign))
      (fee      (calculate-fee raised))
      (net      (- raised fee))
    )
    (asserts! (is-eq (contract-of token-trait) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (is-eq tx-sender (get creator campaign)) ERR-NOT-CREATOR)
    (asserts! (not (get withdrawn campaign)) ERR-ALREADY-WITHDRAWN)
    (asserts! (>= block-height (get deadline campaign)) ERR-STILL-ACTIVE)
    (asserts!
      (or 
        (is-eq (get funding-model campaign) FLEXIBLE)
        (>= raised (get goal campaign))
      )
      ERR-GOAL-NOT-REACHED
    )

    ;; Reentrancy guard and prevent future donations
    (map-set campaigns id
      (merge campaign { withdrawn: true, active: false })
    )

    ;; Transfer fee to contract owner, net to creator
    (unwrap! (as-contract (contract-call? token-trait transfer fee tx-sender CONTRACT-OWNER none)) ERR-TRANSFER-FAILED)
    (unwrap! (as-contract (contract-call? token-trait transfer net tx-sender (get creator campaign) none)) ERR-TRANSFER-FAILED)

    (ok true)
  )
)

;; CLAIM REFUND
(define-public (claim-refund
    (token-trait <sip-010-trait>)
    (id          uint)
  )
  (let
    (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
      (donor    tx-sender)
      (amount   (get-donation id tx-sender))
    )
    (asserts! (is-eq (contract-of token-trait) (get token campaign)) ERR-TOKEN-NOT-ALLOWED)
    (asserts! (is-eq (get funding-model campaign) ALL-OR-NOTHING) ERR-REFUND-NOT-ALLOWED)
    (asserts! (>= block-height (get deadline campaign)) ERR-STILL-ACTIVE)
    (asserts! (< (get total-raised campaign) (get goal campaign)) ERR-REFUND-NOT-ALLOWED)
    (asserts! (> amount u0) ERR-NOT-DONOR)

    ;; Zero out donation before transfer (reentrancy and double-claim guard)
    (map-set donations { campaign-id: id, donor: donor } u0)

    (unwrap! (as-contract (contract-call? token-trait transfer amount tx-sender donor none)) ERR-TRANSFER-FAILED)

    (ok amount)
  )
)

;; -----------------------------------------------------------
;; ADMIN FUNCTIONS
;; -----------------------------------------------------------

(define-public (deactivate-campaign (id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns id) ERR-NOT-FOUND))
    )
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
