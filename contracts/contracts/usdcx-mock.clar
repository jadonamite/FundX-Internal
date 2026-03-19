;; ===========================================================
;; USDCX MOCK TOKEN - LOCAL TESTING ONLY
;; Implements SIP-010. DO NOT DEPLOY TO MAINNET.
;; ===========================================================

(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token usdcx)

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-OWNER (err u200))
(define-constant ERR-NOT-ENOUGH (err u201))

;; -----------------------------------------------------------
;; SIP-010 REQUIRED FUNCTIONS
;; -----------------------------------------------------------

(define-public (transfer
    (amount uint)
    (from   principal)
    (to     principal)
    (memo   (optional (buff 34)))
  )
  (begin
    (asserts! (is-eq tx-sender from) (err u4))
    (ft-transfer? usdcx amount from to)
  )
)

(define-read-only (get-name)
  (ok "USD Coin Extended")
)

(define-read-only (get-symbol)
  (ok "USDCx")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance usdcx who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply usdcx))
)

(define-read-only (get-token-uri)
  (ok none)
)

;; -----------------------------------------------------------
;; MINT - TEST USE ONLY
;; -----------------------------------------------------------

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (ft-mint? usdcx amount recipient)
  )
)
