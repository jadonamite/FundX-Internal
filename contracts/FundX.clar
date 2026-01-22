;; ============================================
;; FundX - Crowdfunding Platform on Stacks
;; ============================================
;; This contract allows users to create crowdfunding campaigns,
;; donate in USDCx stablecoin, and withdraw funds when goals are met.
;; Platform charges a 2% fee on successful campaigns.
;; 
;; Built with Clarity 3

;; ============================================
;; CONSTANTS - Fixed values that never change
;; ============================================

;; The address that deployed this contract (receives platform fees)
(define-constant contract-owner tx-sender)

;; Error codes - these help identify what went wrong
(define-constant err-owner-only (err u100))          ;; Only contract owner can do this
(define-constant err-not-found (err u101))           ;; Campaign doesn't exist
(define-constant err-already-exists (err u102))      ;; Campaign already exists
(define-constant err-invalid-amount (err u103))      ;; Amount must be greater than 0
(define-constant err-campaign-ended (err u104))      ;; Campaign deadline has passed
(define-constant err-campaign-active (err u105))     ;; Campaign is still running
(define-constant err-goal-not-reached (err u106))    ;; Goal hasn't been met yet
(define-constant err-unauthorized (err u107))        ;; You're not allowed to do this
(define-constant err-invalid-duration (err u108))    ;; Duration must be greater than 0
(define-constant err-goal-reached (err u109))        ;; Goal already reached, can't donate more
(define-constant err-already-withdrawn (err u110))   ;; Funds already withdrawn

;; Platform fee settings
(define-constant platform-fee-percent u2)   ;; 2% fee
(define-constant fee-denominator u100)      ;; Used to calculate percentage (2/100 = 2%)

;; ============================================
;; DATA STORAGE
;; ============================================

;; Counter that tracks how many campaigns have been created
;; Starts at 0, increments by 1 for each new campaign
(define-data-var campaign-nonce uint u0)

;; USDCx token contract address on Stacks testnet
(define-constant usdcx-token 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx)

;; ============================================
;; DATA MAPS - Like database tables
;; ============================================

;; Stores all campaign information
;; Key: campaign ID (a number)
;; Value: all the campaign details
(define-map campaigns
    uint  ;; Campaign ID
    {
        creator: principal,      ;; Wallet address of who created the campaign
        goal: uint,              ;; Target amount to raise (in USDCx)
        deadline: uint,          ;; Stacks block height when campaign ends
        total-raised: uint,      ;; How much has been donated so far
        withdrawn: bool,         ;; Has the creator withdrawn the funds?
        active: bool            ;; Is the campaign still accepting donations?
    }
)

;; Tracks how much each person donated to each campaign
;; Key: combination of campaign ID and donor address
;; Value: total amount donated by that person
(define-map donations
    { campaign-id: uint, donor: principal }
    uint  ;; Amount donated
)

;; Tracks which people have donated to which campaigns
;; Key: combination of campaign ID and donor address
;; Value: true if they've donated, otherwise entry doesn't exist
(define-map campaign-donors
    { campaign-id: uint, donor: principal }
    bool
)

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================
;; These functions let anyone view data without changing anything
;; They don't cost any gas/fees to call

;; Get all details about a specific campaign
;; Returns: campaign data if it exists, or nothing if not found
(define-read-only (get-campaign (campaign-id uint))
    (map-get? campaigns campaign-id)
)

;; Get how much a specific person donated to a specific campaign
;; Returns: donation amount (or 0 if they haven't donated)
(define-read-only (get-donation (campaign-id uint) (donor principal))
    (default-to u0 (map-get? donations { campaign-id: campaign-id, donor: donor }))
)

;; Get the total number of campaigns created on the platform
;; Returns: total campaign count
(define-read-only (get-total-campaigns)
    (var-get campaign-nonce)
)

;; Check if a campaign's deadline has passed
;; Returns: true if ended, false if still running
(define-read-only (is-campaign-ended (campaign-id uint))
    (match (map-get? campaigns campaign-id)
        campaign (>= stacks-block-height (get deadline campaign))
        false
    )
)

;; Check if a campaign has reached its funding goal
;; Returns: true if goal reached, false otherwise
(define-read-only (is-goal-reached (campaign-id uint))
    (match (map-get? campaigns campaign-id)
        campaign (>= (get total-raised campaign) (get goal campaign))
        false
    )
)

;; Calculate the 2% platform fee for a given amount
;; Returns: fee amount
(define-read-only (calculate-platform-fee (amount uint))
    (/ (* amount platform-fee-percent) fee-denominator)
)

;; ============================================
;; PUBLIC FUNCTIONS
;; ============================================
;; These functions can be called by users and modify the blockchain state

;; CREATE A NEW CROWDFUNDING CAMPAIGN
;; Parameters:
;;   - goal: target amount to raise (in USDCx)
;;   - duration: how long campaign runs (in blocks, ~10 min per block)
;; Returns: new campaign ID
(define-public (create-campaign (goal uint) (duration uint))
    (let
        (
            ;; Generate new unique campaign ID
            (campaign-id (+ (var-get campaign-nonce) u1))
            ;; Calculate when campaign ends (current block + duration)
            (deadline (+ stacks-block-height duration))
        )
        ;; Make sure goal is greater than 0
        (asserts! (> goal u0) err-invalid-amount)
        ;; Make sure duration is greater than 0
        (asserts! (> duration u0) err-invalid-duration)
        
        ;; Save the new campaign to the blockchain
        (map-set campaigns campaign-id
            {
                creator: tx-sender,        ;; Who created this campaign
                goal: goal,                ;; Fundraising goal
                deadline: deadline,        ;; When it ends
                total-raised: u0,          ;; Starts at 0
                withdrawn: false,          ;; Funds not withdrawn yet
                active: true              ;; Campaign is active
            }
        )
        
        ;; Update the campaign counter
        (var-set campaign-nonce campaign-id)
        
        ;; Return the new campaign ID
        (ok campaign-id)
    )
)

;; DONATE TO A CAMPAIGN
;; Parameters:
;;   - campaign-id: which campaign to donate to
;;   - amount: how much USDCx to donate
;; Returns: how much was actually donated and how much was refunded
;; 
;; Smart donation logic:
;; If campaign needs $10 more and you donate $20, only $10 is taken
;; and $10 is automatically "refunded" (never transferred in the first place)
(define-public (donate (campaign-id uint) (amount uint))
    (let
        (
            ;; Get the campaign details (or fail if it doesn't exist)
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            ;; How much has been raised so far
            (current-raised (get total-raised campaign))
            ;; The fundraising goal
            (goal (get goal campaign))
            ;; How much more is needed to reach the goal
            (remaining (- goal current-raised))
            ;; How much we'll actually accept (either full amount or just what's needed)
            (actual-donation (if (<= amount remaining) amount remaining))
            ;; How much to "refund" (by not taking it in the first place)
            (refund (- amount actual-donation))
        )
        ;; VALIDATION CHECKS - make sure donation is valid
        
        ;; Campaign must still be active
        (asserts! (get active campaign) err-campaign-ended)
        ;; Campaign deadline must not have passed
        (asserts! (< stacks-block-height (get deadline campaign)) err-campaign-ended)
        ;; Goal must not already be reached
        (asserts! (< current-raised goal) err-goal-reached)
        ;; Donation amount must be greater than 0
        (asserts! (> amount u0) err-invalid-amount)
        
        ;; TRANSFER THE DONATION
        ;; Only transfer what's actually needed (not the full amount if overpaying)
        (if (> actual-donation u0)
            (try! (contract-call? usdcx-token transfer 
                actual-donation           ;; Amount to transfer
                tx-sender                 ;; From the donor
                (as-contract tx-sender)   ;; To this contract (Clarity 3 syntax)
                none))                    ;; No memo
            true  ;; If actual-donation is 0, just continue
        )
        
        ;; NOTE: Refund happens automatically - we simply don't transfer the excess
        
        ;; UPDATE RECORDS
        
        ;; Track this person's total donations to this campaign
        (map-set donations 
            { campaign-id: campaign-id, donor: tx-sender }
            (+ (get-donation campaign-id tx-sender) actual-donation)
        )
        
        ;; Mark this person as a donor for this campaign
        (map-set campaign-donors
            { campaign-id: campaign-id, donor: tx-sender }
            true
        )
        
        ;; Update the campaign's total raised amount
        (map-set campaigns campaign-id
            (merge campaign { total-raised: (+ current-raised actual-donation) })
        )
        
        ;; Return success with donation and refund amounts
        (ok { donated: actual-donation, refunded: refund })
    )
)

;; WITHDRAW FUNDS FROM YOUR CAMPAIGN
;; Can only be called by the campaign creator
;; Can only withdraw if goal is reached OR deadline has passed
;; Automatically deducts 2% platform fee
;; 
;; Parameters:
;;   - campaign-id: which campaign to withdraw from
;; Returns: total raised, platform fee, and amount transferred to creator
(define-public (withdraw (campaign-id uint))
    (let
        (
            ;; Get the campaign details
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            ;; Total amount raised
            (total-raised (get total-raised campaign))
            ;; Calculate 2% platform fee
            (platform-fee (calculate-platform-fee total-raised))
            ;; Amount that goes to campaign creator (total - fee)
            (creator-amount (- total-raised platform-fee))
        )
        ;; VALIDATION CHECKS
        
        ;; Only the campaign creator can withdraw
        (asserts! (is-eq tx-sender (get creator campaign)) err-unauthorized)
        
        ;; Make sure funds haven't already been withdrawn
        (asserts! (not (get withdrawn campaign)) err-already-withdrawn)
        
        ;; Can withdraw if EITHER:
        ;; 1. Goal has been reached, OR
        ;; 2. Deadline has passed (even if goal not reached) - Indiegogo style!
        (asserts! (or 
            (>= total-raised (get goal campaign))
            (>= stacks-block-height (get deadline campaign))
        ) err-campaign-active)
        
        ;; Must have funds to withdraw
        (asserts! (> total-raised u0) err-invalid-amount)
        
        ;; IMPORTANT: Mark as withdrawn FIRST to prevent re-entrancy attacks
        ;; (someone trying to withdraw multiple times before transaction completes)
        (map-set campaigns campaign-id
            (merge campaign { withdrawn: true, active: false })
        )
        
        ;; TRANSFER FUNDS using Clarity 3 as-contract syntax
        ;; This executes the transfers with the contract as the sender
        
        ;; Transfer platform fee (2%) to contract owner
        (if (> platform-fee u0)
            (try! (as-contract (contract-call? usdcx-token transfer 
                platform-fee              ;; 2% fee
                tx-sender                 ;; From contract (as-contract makes this the contract)
                contract-owner            ;; To platform owner
                none)))                   ;; No memo
            true  ;; If fee is 0, just continue
        )
        
        ;; Transfer remaining funds (98%) to campaign creator
        (try! (as-contract (contract-call? usdcx-token transfer 
            creator-amount            ;; Amount after fee
            tx-sender                 ;; From contract (as-contract makes this the contract)
            (get creator campaign)    ;; To campaign creator
            none)))                   ;; No memo
        
        ;; Return the amounts
        (ok { 
            total: total-raised,           ;; Total that was raised
            fee: platform-fee,             ;; 2% platform fee
            transferred: creator-amount    ;; Amount sent to creator
        })
    )
)

;; ============================================
;; ADMIN FUNCTIONS
;; ============================================

;; EMERGENCY: Deactivate a campaign
;; Only the contract owner can call this
;; Useful for stopping fraudulent campaigns
;; 
;; Parameters:
;;   - campaign-id: which campaign to deactivate
;; Returns: true if successful
(define-public (deactivate-campaign (campaign-id uint))
    (begin
        ;; Only contract owner can deactivate campaigns
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        
        ;; Verify campaign exists and get its data
        (let
            (
                (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            )
            ;; Set campaign to inactive (stops new donations)
            (map-set campaigns campaign-id
                (merge campaign { active: false })
            )
            
            (ok true)
        )
    )
)
