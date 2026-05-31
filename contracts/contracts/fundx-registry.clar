;; ===========================================================
;; FUNDX REGISTRY
;; On-chain campaign metadata store - linked to fundx-escrow-v2
;; Clarity Version : 2
;; Network         : Stacks Mainnet
;; ===========================================================

(define-constant CONTRACT-OWNER tx-sender)

(define-constant ERR-NOT-FOUND     (err u100))
(define-constant ERR-NOT-OWNER     (err u101))
(define-constant ERR-ALREADY-SET   (err u102))
(define-constant ERR-INVALID-INPUT (err u103))
(define-constant ERR-UNAUTHORIZED  (err u104))


;; -----------------------------------------------------------
;; STATE
;; -----------------------------------------------------------

;; Metadata for each campaign ID (matches IDs in fundx-escrow-v2)
(define-map campaign-meta
  { id: uint }
  {
    title:       (string-utf8 128),
    tagline:     (string-utf8 256),
    description: (string-utf8 512),
    image-uri:   (string-utf8 256),
    category:    (string-utf8 64),
    location:    (string-utf8 64),
    social:      (string-utf8 128),
    owner:       principal
  }
)


;; -----------------------------------------------------------
;; READ-ONLY
;; -----------------------------------------------------------

(define-read-only (get-meta (id uint))
  (map-get? campaign-meta { id: id })
)

(define-read-only (has-meta (id uint))
  (is-some (map-get? campaign-meta { id: id }))
)

(define-read-only (get-owner (id uint))
  (match (map-get? campaign-meta { id: id })
    meta (some (get owner meta))
    none
  )
)


;; -----------------------------------------------------------
;; REGISTER
;; -----------------------------------------------------------
;; First call for a given ID claims ownership.
;; Subsequent calls require tx-sender to match the stored owner.
;; Campaign creators call this after creating a campaign in
;; fundx-escrow-v2 to attach human-readable metadata.

(define-public (register
    (id          uint)
    (title       (string-utf8 128))
    (tagline     (string-utf8 256))
    (description (string-utf8 512))
    (image-uri   (string-utf8 256))
    (category    (string-utf8 64))
    (location    (string-utf8 64))
    (social      (string-utf8 128))
  )
  (let (
    (existing (map-get? campaign-meta { id: id }))
  )
    (asserts! (> id u0)          ERR-INVALID-INPUT)
    (asserts! (> (len title) u0) ERR-INVALID-INPUT)

    ;; If already registered, only the owner can overwrite
    (match existing
      meta (asserts! (is-eq tx-sender (get owner meta)) ERR-UNAUTHORIZED)
      true ;; Not yet registered - anyone can claim
    )

    (map-set campaign-meta
      { id: id }
      {
        title:       title,
        tagline:     tagline,
        description: description,
        image-uri:   image-uri,
        category:    category,
        location:    location,
        social:      social,
        owner:       tx-sender
      }
    )
    (ok true)
  )
)


;; -----------------------------------------------------------
;; DELETE
;; -----------------------------------------------------------
;; Owner or CONTRACT-OWNER can remove metadata (e.g. spam).

(define-public (delete-meta (id uint))
  (let (
    (meta (unwrap! (map-get? campaign-meta { id: id }) ERR-NOT-FOUND))
  )
    (asserts!
      (or (is-eq tx-sender (get owner meta))
          (is-eq tx-sender CONTRACT-OWNER))
      ERR-UNAUTHORIZED
    )
    (ok (map-delete campaign-meta { id: id }))
  )
)


;; -----------------------------------------------------------
;; ADMIN - EMERGENCY TRANSFER OWNERSHIP
;; -----------------------------------------------------------
;; CONTRACT-OWNER can transfer metadata ownership (e.g. lost key).

(define-public (transfer-ownership (id uint) (new-owner principal))
  (let (
    (meta (unwrap! (map-get? campaign-meta { id: id }) ERR-NOT-FOUND))
  )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (ok (map-set campaign-meta { id: id } (merge meta { owner: new-owner })))
  )
)
