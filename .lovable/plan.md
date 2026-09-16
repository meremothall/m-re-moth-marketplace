# Meremoth Mall master fix

## Build
- Remove all WhatsApp links, labels, phone actions, and public founder/admin identity from shopper-facing pages and metadata.
- Rename Wanted to Find For Me everywhere, move the main page to `/find-for-me`, and preserve `/wanted` as a redirect.
- Rework product cards with Escrow Protected, seller tier and area, Chat Seller, and Buy Now actions.
- Add a checkout drawer with delivery, escrow messaging, payment choices, and the Phase 1 payment notice.
- Replace the floating request button with a smaller draggable Sell control that remembers its position and stays above navigation.
- Add a Jobs page with Job Offers and Find Talent tabs, talent cards, in-app chat, and a Post Your Skill form.
- Keep the existing area and condition filters unchanged.

## Technical details
- Keep all new commerce and talent data browser-local for this phase; no real payment or identity verification is implied.
- Add route-specific metadata for `/find-for-me` and `/jobs`; update existing public metadata to remove WhatsApp references.
- Verify desktop and mobile layouts, route redirects, checkout drawer, draggable control, and zero WhatsApp URLs/text in public source.
