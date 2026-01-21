;; ============================================
;; FundX - Crowdfunding Platform on Stacks
;; ============================================
;; This contract allows users to create crowdfunding campaigns,
;; donate in USDCx stablecoin, and withdraw funds when goals are met.
;; Platform charges a 2% fee on successful campaigns.

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

;; USDCx token contract address on Stacks
;; NOTE: Replace this with the actual USDCx SIP-010 token contract principal
;; This is the stablecoin used for all donations
(define-constant usdcx-token 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-USD)

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
        deadline: uint,          ;; Block height when campaign ends
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
        campaign (>= block-height (get deadline campaign))
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

