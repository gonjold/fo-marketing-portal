# WO: FO Marketing Portal — Layout Optimization for Meeting Presentation

## Context
The portal is live at fo-marketing-portal.netlify.app. The Journey tab has a major layout problem: vendor rows hug the left side with 60% of the horizontal space wasted. This tool needs to be presented in meetings on a big screen. Every pixel matters.

## Problem
- Vendor + channel rows are stacked vertically on the left, right side is empty
- Each stage card is too tall because vendors stack vertically
- Expanding a card pushes everything way down — hard to see the big picture
- Not scannable at a glance — you have to read each stage linearly
- The timeline dot/line on the left is nice but wastes 30px for no meeting value

## Goal
Make the Journey tab look like a professional marketing matrix that fills the screen width and is instantly scannable in a meeting. A director should glance at it and immediately see: what stage, who sends, what channels.

## Solution: Horizontal Vendor Matrix

Redesign the Journey tab collapsed view as a **table/matrix layout**:

### Header Row (sticky)
- First column: **Stage** (range + label + segment badge)
- One column per vendor (TVi, OneVoicePlus, AutoPoint, Reynolds, Innovative, CRM/BDC)
- Vendor name + color dot in column header

### Each Stage Row
- Stage column: range bold, label smaller, segment badge
- Each vendor cell: if active at this stage, show the channel pills (Email, Mail, SMS, etc). If inactive, show a dash or leave empty
- Rows should have subtle left border color matching the segment (green/amber/red/gray)
- Alternate row backgrounds for readability (white / very light gray)

### Click to Expand
- Clicking a row still expands to show: Strategy/Goal, Communication Details (vendor notes), and Offers/Financing
- Expanded content appears as a full-width panel below the row
- Keep the expand/collapse chevron on the right side of each row

### Creative Gallery Tab
- Keep as-is, no changes needed

### Vendors Tab
- Keep as-is, no changes needed

## Additional Layout Fixes

1. **Remove the timeline dots and vertical gradient line** on the left — replace with the table layout. The stage order already communicates the timeline.
2. **Make the legend row more compact** — it should be a thin strip, not a padded box
3. **Use the full viewport width** — reduce side padding from 24px to 16px on desktop
4. **The lock icon is good** — keep it exactly where it is
5. **Keep responsive** — on small screens the table can horizontally scroll

## Technical Notes
- This is a React component in src/App.jsx
- All data comes from state (vendors array, stages array)
- Vendor IDs in each stage's `vc` object map to the vendor array
- Do NOT change the data structure, only the rendering of the Journey tab
- Do NOT touch the Creative Gallery or Vendors tabs
- Do NOT touch the modal editors or persistence layer
- Keep the edit mode button visibility (edit buttons only show when unlocked)

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "feat: matrix layout for journey tab - meeting optimized" && git push
```

## What NOT To Do
- Do NOT rewrite the entire App.jsx — only modify the Journey tab rendering section
- Do NOT change the data model or Firestore persistence
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT remove expand/collapse functionality — just change the collapsed layout to a matrix
- Do NOT add any new dependencies
