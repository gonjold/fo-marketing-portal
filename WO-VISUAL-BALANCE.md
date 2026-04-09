# WO: FO Marketing Portal — Visual Balance Pass

## Context
Portal is live at fo-marketing-portal.netlify.app. The design is functionally correct but feels heavy-left and sections blend together. Needs better visual balance and subtle section separation.

## Changes

### 1. Center the stage headers
Currently the stage label, range, badge, and overlap indicator are all left-aligned in a single flex row. Change to:
- Center the stage label + range + badge horizontally within the card
- Move the overlap indicator (Clean/overlaps + touches) to a separate line below, also centered, slightly smaller (10px)
- This makes each stage header feel like a section title, not a data row

### 2. Center the vendor blocks row
The vendor blocks flex row is left-aligned. Change to `justifyContent: "center"` so they sit in the middle of the card. When there are only 2 vendors (like New Owner), they should be centered with space around them, not hugging the left edge.

### 3. Add subtle section separators
Between each stage card, add a thin connecting element to show progression:
- A small vertical line (2px wide, 20px tall, light gray) centered between cards
- This creates a subtle "timeline" feel without the full timeline treatment we had before
- Use a simple div: `width:2, height:20, background:#E5E7EB, margin:"0 auto"`

### 4. Center the expanded detail content
When a stage is expanded, the strategy text and offers are left-aligned at the edge. Instead:
- Center the strategy text with `textAlign: "center"` and a max-width of 600px with `margin: "0 auto"`
- Center the offers/financing pills row with `justifyContent: "center"`
- Center the overlap analysis boxes with max-width 600px and `margin: "0 auto"`

### 5. Vendor note text alignment
Inside each vendor block, the note text ("To be confirmed", "ASR, Service Recommendation" etc) is left-aligned. Change to `textAlign: "center"` within the vendor block so everything in the block is centered.

### 6. Channel indicators alignment  
The channel indicators (Email, Mail, SMS, etc) inside vendor blocks should be centered within the block: add `justifyContent: "center"` and `textAlign: "center"` to the channel row, and wrap them in a flex container with `justifyContent: "center"`.

### 7. Stage card spacing
Increase the gap between stage cards from 4px to 0px (the connecting line element handles the visual gap). The connecting line div sits between cards.

### 8. Vendor legend centering
The vendor legend strip at the top should be centered: `justifyContent: "center"`.

## Do NOT Change
- Colors, vendor block tints, overlap detection logic
- Dark mode, lock/password, edit functionality  
- Data model or persistence
- The overall card-based layout structure
- Font sizes (they're good now)

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "polish: centered layout + section separators" && git push
```

## What NOT To Do
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT change layout structure (keep vendor tint blocks in flex rows)
- Do NOT add dependencies
