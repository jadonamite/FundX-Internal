;; contracts/usdcx.clar
;; This is a "Header File" to satisfy the compiler
(define-fungible-token usdcx)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (ok true) ;; Dummy response
)