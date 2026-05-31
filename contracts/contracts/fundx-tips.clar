;; ===========================================================
;; FUNDX TIPS
;; Direct creator tipping - no campaigns, no deadlines
;; 2% platform fee on each tip. Fully permissionless.
;; Clarity Version : 2
;; Token           : USDCx (SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39.usdcx-v2)
;; Network         : Stacks Mainnet
;; ===========================================================

(use-trait sip-010-trait .sip-010-trait-v2.sip-010-trait)

(define-constant CONTRACT-OWNER       tx-sender)
(define-constant USDCX-CONTRACT       .usdcx-v2)

(define-constant PLATFORM-FEE-PERCENT u2)
(define-constant FEE-DENOMINATOR      u100)

(define-constant ERR-INVALID-AMOUNT  (err u100))
(define-constant ERR-SELF-TIP        (err u101))
(define-constant ERR-TRANSFER-FAILED (err u102))
(define-constant ERR-NOT-OWNER       (err u103))


;; -----------------------------------------------------------
;; STATE
;; -----------------------------------------------------------

;; Running totals received per creator
(define-map creator-totals
  principal
  { received: uint, tip-count: uint }
)

;; Running totals sent per tipper
(define-map tipper-totals
  principal
  { sent: uint, tip-count: uint }
)

;; Global stats
(define-data-var total-tips-sent  uint u0)
(define-data-var total-tip-volume uint u0)


;; -----------------------------------------------------------
;; READ-ONLY
;; -----------------------------------------------------------

(define-read-only (get-creator-stats (creator principal))
  (map-get? creator-totals creator)
)

(define-read-only (get-tipper-stats (tipper principal))
  (map-get? tipper-totals tipper)
)

(define-read-only (get-global-stats)
  {
    total-tips:   (var-get total-tips-sent),
    total-volume: (var-get total-tip-volume)
  }
)

(define-read-only (calculate-fee (amount uint))
  (/ (* amount PLATFORM-FEE-PERCENT) FEE-DENOMINATOR)
)

(define-read-only (calculate-net (amount uint))
  (- amount (calculate-fee amount))
)


;; -----------------------------------------------------------
;; TIP
;; -----------------------------------------------------------
;; Send USDCx directly to a creator.
;; 2% goes to the platform, 98% to the creator.
;; Records accumulate so on-chain reputation builds over time.

(define-public (tip
    (token   <sip-010-trait>)
    (creator principal)
    (amount  uint)
    (memo    (optional (buff 34)))
  )
  (begin
    (asserts! (is-eq (contract-of token) USDCX-CONTRACT) ERR-TRANSFER-FAILED)
    (asserts! (> amount u0)                               ERR-INVALID-AMOUNT)
    (asserts! (not (is-eq tx-sender creator))             ERR-SELF-TIP)

    (let (
      (fee (calculate-fee amount))
      (net (calculate-net amount))
    )
      ;; Pull full tip from tipper
      (unwrap!
        (contract-call? token transfer amount tx-sender (as-contract tx-sender) none)
        ERR-TRANSFER-FAILED
      )

      ;; Send fee to platform
      (unwrap!
        (as-contract (contract-call? token transfer fee tx-sender CONTRACT-OWNER none))
        ERR-TRANSFER-FAILED
      )

      ;; Send net to creator
      (unwrap!
        (as-contract (contract-call? token transfer net tx-sender creator none))
        ERR-TRANSFER-FAILED
      )

      ;; Update creator stats
      (let (
        (c-stats (default-to { received: u0, tip-count: u0 } (map-get? creator-totals creator)))
      )
        (map-set creator-totals creator
          {
            received:  (+ (get received c-stats) net),
            tip-count: (+ (get tip-count c-stats) u1)
          }
        )
      )

      ;; Update tipper stats
      (let (
        (t-stats (default-to { sent: u0, tip-count: u0 } (map-get? tipper-totals tx-sender)))
      )
        (map-set tipper-totals tx-sender
          {
            sent:      (+ (get sent t-stats) amount),
            tip-count: (+ (get tip-count t-stats) u1)
          }
        )
      )

      ;; Update global counters
      (var-set total-tips-sent  (+ (var-get total-tips-sent) u1))
      (var-set total-tip-volume (+ (var-get total-tip-volume) amount))

      (ok { net: net, fee: fee })
    )
  )
)
