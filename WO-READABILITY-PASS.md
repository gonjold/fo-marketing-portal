# WO: FO Marketing Portal — Readability Pass

## Context
The portal is live at fo-marketing-portal.netlify.app. The Journey tab matrix is too dense and small to read during a meeting on a projector or large screen. It looks like an eye chart. Text needs to be significantly larger and the layout needs more breathing room.

## Problems
1. Channel pills (Email, Mail, SMS, etc) are tiny — 10px font is unreadable from more than 3 feet away
2. Vendor column headers are small
3. Stage names in the left column are small
4. The dashes for inactive vendors create visual noise
5. Overall the matrix tries to cram too much into one view — it should be comfortable to read, not dense
6. Creative Gallery cards have huge empty image placeholder areas taking up too much vertical space when no image is uploaded

## Changes to Journey Tab

### Font Sizes — increase everything
- Stage range (e.g. "<30 Days RDR"): bump to 16px bold
- Stage label (e.g. "New Owner"): bump to 13px
- Segment badge text: bump to 11px
- Vendor column headers: bump to 13px bold
- Channel pills inside cells: bump to 12px with more padding (6px 12px instead of 2px 7px)
- Inactive vendor cells: use a light gray dot or blank instead of a dash — cleaner

### Spacing
- Row height: increase padding to 20px vertical per row
- Column gap: add more horizontal padding in each cell (12px minimum)
- Header row: add 14px vertical padding
- Legend strip at top: bump vendor name text to 13px, channel pill text to 11px

### Expanded Row
- Strategy text: 14px
- Communication detail cards: vendor name 14px, note text 13px
- Offer/financing pills: 12px with more padding

## Changes to Creative Gallery Tab
- When no image is uploaded, reduce the placeholder height from 160px to 80px — just enough to show the "+" and "No creative uploaded" text without a giant empty box
- When an image IS uploaded, keep the full 160px height for the preview
- Creative title: bump to 15px
- Description text: bump to 13px
- Offer/financing pills: bump to 12px

## Changes to Vendors Tab
- Vendor name: bump to 18px
- Description text: bump to 14px

## Do NOT Change
- The matrix table structure (keep vendors as columns, stages as rows)
- The data model or persistence
- The lock/password system
- The expand/collapse behavior
- Any colors or brand elements

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "fix: readability pass - larger fonts, better spacing for meetings" && git push
```

## What NOT To Do
- Do NOT rewrite the component — only change font sizes, padding, and the empty creative placeholder height
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT add new features or change the layout structure
