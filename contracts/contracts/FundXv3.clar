;; ============================================
;; FundX - Crowdfunding Platform on Stacks
;; ============================================
;; Built with Clarity 3
;; Network: Stacks Testnet

;; ============================================
;; CONSTANTS
;; ============================================

(define-constant contract-owner tx-sender)

(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-campaign-ended (err u104))
(define-constant err-campaign-active (err u105))
(define-constant err-goal-not-reached (err u106))
(define-constant err-unauthorized (err u107))
(define-constant err-invalid-duration (err u108))
(define-constant err-goal-reached (err u109))
(define-constant err-already-withdrawn (err u110))
(define-constant err-refund-not-available (err u111))
(define-constant err-no-donations (err u112))

(define-constant platform-fee-percent u2)
(define-constant fee-denominator u100)

;; ============================================
;; DATA STORAGE
;; ============================================

(define-data-var campaign-nonce uint u0)

;; We use the full address here for reference, matching the live token
(define-constant usdcx-token 'ST3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9V1H9ZX.usdcx)

;; ============================================
;; DATA MAPS
;; ============================================

(define-map campaigns
    uint
    {
        creator: principal,
        goal: uint,
        deadline: uint,
        total-raised: uint,
        withdrawn: bool,
        active: bool,
        refunded: bool
    }
)

(define-map donations
    { campaign-id: uint, donor: principal }
    uint
)

(define-map campaign-donors
    { campaign-id: uint, donor: principal }
    bool
)

(define-map refunds
    { campaign-id: uint, donor: principal }
    bool
)

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================

(define-read-only (get-campaign (campaign-id uint))
    (map-get? campaigns campaign-id)
)

(define-read-only (get-donation (campaign-id uint) (donor principal))
    (default-to u0 (map-get? donations { campaign-id: campaign-id, donor: donor }))
)

(define-read-only (get-total-campaigns)
    (var-get campaign-nonce)
)

(define-read-only (is-campaign-ended (campaign-id uint))
    (match (map-get? campaigns campaign-id)
        campaign (>= stacks-block-height (get deadline campaign))
        false
    )
)

(define-read-only (is-goal-reached (campaign-id uint))
    (match (map-get? campaigns campaign-id)
        campaign (>= (get total-raised campaign) (get goal campaign))
        false
    )
)

(define-read-only (calculate-platform-fee (amount uint))
    (/ (* amount platform-fee-percent) fee-denominator)
)

(define-read-only (can-refund (campaign-id uint) (donor principal))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) false))
            (donation (get-donation campaign-id donor))
        )
        (and
            (>= stacks-block-height (get deadline campaign))
            (not (get withdrawn campaign))
            (not (get refunded campaign))
            (< (get total-raised campaign) (get goal campaign))
            (> donation u0)
            (is-none (map-get? refunds { campaign-id: campaign-id, donor: donor }))
        )
    )
)

;; ============================================
;; PUBLIC FUNCTIONS
;; ============================================

(define-public (create-campaign (goal uint) (duration uint))
    (let
        (
            (campaign-id (+ (var-get campaign-nonce) u1))
            (deadline (+ stacks-block-height duration))
        )
        (asserts! (> goal u0) err-invalid-amount)
        (asserts! (> duration u0) err-invalid-duration)
        
        (map-set campaigns campaign-id
            {
                creator: tx-sender,
                goal: goal,
                deadline: deadline,
                total-raised: u0,
                withdrawn: false,
                active: true,
                refunded: false
            }
        )
        
        (var-set campaign-nonce campaign-id)
        (ok campaign-id)
    )
)

(define-public (donate (campaign-id uint) (amount uint))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            (current-raised (get total-raised campaign))
            (goal (get goal campaign))
            (remaining (- goal current-raised))
            (actual-donation (if (<= amount remaining) amount remaining))
            (refund (- amount actual-donation))
        )
        (asserts! (get active campaign) err-campaign-ended)
        (asserts! (< stacks-block-height (get deadline campaign)) err-campaign-ended)
        (asserts! (< current-raised goal) err-goal-reached)
        (asserts! (> amount u0) err-invalid-amount)
        (asserts! (not (get refunded campaign)) err-refund-not-available)
        
        ;; TRANSFER
        (if (> actual-donation u0)
            ;; LINKED TO LIVE TOKEN: Uses full address
            (try! (contract-call? 'ST3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9V1H9ZX.usdcx transfer 
                actual-donation
                tx-sender
                (as-contract tx-sender)
                none))
            true
        )
        
        (map-set donations 
            { campaign-id: campaign-id, donor: tx-sender }
            (+ (get-donation campaign-id tx-sender) actual-donation)
        )
        
        (map-set campaign-donors
            { campaign-id: campaign-id, donor: tx-sender }
            true
        )
        
        (map-set campaigns campaign-id
            (merge campaign { total-raised: (+ current-raised actual-donation) })
        )
        
        (ok { donated: actual-donation, refunded: refund })
    )
)

;; NEW: Refund function for donors when campaign fails
(define-public (request-refund (campaign-id uint))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            (donation-amount (get-donation campaign-id tx-sender))
        )
        ;; Validation
        (asserts! (>= stacks-block-height (get deadline campaign)) err-campaign-active)
        (asserts! (not (get withdrawn campaign)) err-already-withdrawn)
        (asserts! (not (get refunded campaign)) err-refund-not-available)
        (asserts! (< (get total-raised campaign) (get goal campaign)) err-goal-reached)
        (asserts! (> donation-amount u0) err-no-donations)
        (asserts! (is-none (map-get? refunds { campaign-id: campaign-id, donor: tx-sender })) 
            err-refund-not-available)
        
        ;; Process refund
        (try! (as-contract (contract-call? 'ST3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9V1H9ZX.usdcx transfer 
            donation-amount
            tx-sender
            tx-sender
            none)))
        
        ;; Mark as refunded
        (map-set refunds
            { campaign-id: campaign-id, donor: tx-sender }
            true
        )
        
        ;; Clear donation
        (map-set donations
            { campaign-id: campaign-id, donor: tx-sender }
            u0
        )
        
        ;; Update campaign total
        (map-set campaigns campaign-id
            (merge campaign { 
                total-raised: (- (get total-raised campaign) donation-amount)
            })
        )
        
        (ok true)
    )
)

(define-public (withdraw (campaign-id uint))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            (total-raised (get total-raised campaign))
            (platform-fee (calculate-platform-fee total-raised))
            (creator-amount (- total-raised platform-fee))
        )
        (asserts! (is-eq tx-sender (get creator campaign)) err-unauthorized)
        (asserts! (not (get withdrawn campaign)) err-already-withdrawn)
        (asserts! (not (get refunded campaign)) err-refund-not-available)
        (asserts! (or 
            (>= total-raised (get goal campaign))
            (>= stacks-block-height (get deadline campaign))
        ) err-campaign-active)
        (asserts! (> total-raised u0) err-invalid-amount)
        
        (map-set campaigns campaign-id
            (merge campaign { withdrawn: true, active: false })
        )
        
        ;; FEE TRANSFER
        (if (> platform-fee u0)
            ;; LINKED TO LIVE TOKEN: Uses full address
            (try! (as-contract (contract-call? 'ST3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9V1H9ZX.usdcx transfer 
                platform-fee
                tx-sender
                contract-owner
                none)))
            true
        )
        
        ;; CREATOR TRANSFER
        ;; LINKED TO LIVE TOKEN: Uses full address
        (try! (as-contract (contract-call? 'ST3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9V1H9ZX.usdcx transfer 
            creator-amount
            tx-sender
            (get creator campaign)
            none)))
        
        (ok { 
            total: total-raised,
            fee: platform-fee,
            transferred: creator-amount
        })
    )
)

(define-public (deactivate-campaign (campaign-id uint))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (map-set campaigns campaign-id
            (merge campaign { active: false })
        )
        (ok true)
    )
)
