# FundX Web App Test Review

This document presents the verification and manual test review results for the FundX internal web application hosted at [https://fund-x-internal.vercel.app/](https://fund-x-internal.vercel.app/).

---

## 🚨 Critical Defect Highlights

> [!WARNING]
> **Wallet Connection Instantiation Failure (Blocker)**
> Every single button that triggers a wallet connection fails to load. This includes the "Connect Wallet" header button, the "Connect Wallet to Contribute" campaign button, and the final step of the campaign creation wizard.
> 
> **Error Message in Browser Console:**
> ```javascript
> Failed to connect wallet: Error: Module 35318 was instantiated because it was required from module 15758, but the module factory is not available.
> at q (turbopack-28f7d2b91184f36b.js)
> ```
> *Root Cause:* Next.js Turbopack build packaging/instantiation error for Stacks wallet connect modules.

> [!IMPORTANT]
> **Broken Campaign Images**
> All default campaign cards on the dashboard fail to load their cover images.
> 
> **Image Request URL:**
> `_next/image?url=%2Fcampaign-4.jpg&w=1080&q=75`
> *Response:* `400 Bad Request`

---

## 🖥️ Layout & Visual Review

### 1. Landing/Home Page
The landing page has a sleek, dark-themed hero section introducing the decentralized crowdfunding concept.
- **Header:** Contains the logo, navigation links (Explore, Create Campaign, My Campaigns), and a "Connect Wallet" CTA.
- **Hero Area:** Standard text layout with dual buttons: "Explore Campaigns" and "Create Campaign".

![FundX Landing Page](./landing_page.png)

---

### 2. Campaigns Dashboard
The explore/dashboard page displays active crowdfunding campaigns in grid cards.
- **Issues:** The main visual layout is clean, but image components are broken. Additionally, clicking card links works, but contributing is blocked due to the wallet error.

![FundX Campaigns Dashboard](./dashboard.png)

---

## 📋 Campaign Creation Wizard Flow Review

The multi-step wizard to launch a new campaign was fully tested step-by-step:

| Step | Page Name | Input Fields Tested | Status / Observations |
| :--- | :--- | :--- | :--- |
| **1** | **Identity** | Creator Name/Org, Private Email, Twitter/X link, GitHub link, Portfolio link | **PASS** — Inputs accept text & validate correctly. |
| **2** | **Bio** | Textarea for creator/project biography | **PASS** — Form holds data correctly. |
| **3** | **Basics** | Project Title, Short Tagline, Cover Image URL, Category selector, Current Stage selector | **PASS** — Dropdowns and image inputs respond normally. |
| **4** | **Story** | Pitch video link (YouTube/Vimeo), Problem & Solution description | **PASS** — Textareas functional. |
| **5** | **Execute** | Budget breakdown textarea, Product Roadmap textarea | **PASS** — Retains multiline text inputs. |
| **6** | **Fund** | Funding Asset (STX/USDA/etc.), Target Amount, Duration (days), Funding model (All-or-Nothing vs. Flexible) | **PASS** — Number inputs and stage calculations work. |
| **7** | **Deploy** | "Connect & Deploy" action button | **FAIL** — Blocks because of the global Stacks wallet connection error. |

---

## 🛠️ Recommendations for Developers

1. **Fix Turbopack Module Factory Error:**
   - Run a clean build or configure `next.config.js` to transpile or ignore the problematic Stacks wallet packages (e.g. `@micro-react` or similar Stacks packages) under Turbopack.
   - Alternatively, disable Turbopack during Vercel deployment if it struggles with specific WASM or CJS/ESM modules used by the Stacks Connect SDK.
2. **Resolve Image Optimization 400 Bad Request:**
   - Ensure image files (`campaign-4.jpg`, etc.) are placed in the `/public` folder of the Next.js repository.
   - If using external URLs, they must be whitelisted in the `images.remotePatterns` array inside `next.config.ts`.
