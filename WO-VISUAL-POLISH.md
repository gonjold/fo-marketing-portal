# WO: FO Marketing Portal — Visual Polish Pass

## Context
The portal is live at fo-marketing-portal.netlify.app. It's being presented in a meeting TOMORROW to lock content with vendor reps. The layout structure is correct but the visual execution looks amateur — too many colored borders, cards look like a school project, channel pills create visual noise. Needs to look like a clean, professional internal tool. Think Notion or Linear, not Trello.

## Journey Tab — Visual Cleanup

### Vendor Cards
Current problem: Each vendor card has a colored left border + colored vendor name + multiple colored channel pills = overwhelming color noise. Six of these in a row looks like a rainbow.

Fix:
- Remove the colored left border from vendor cards entirely
- Keep vendor name in its color (this is the only color on the card)
- Channel pills should be MONOCHROME — light gray background (#F3F4F6), dark gray text (#374151), thin border (#E5E7EB). No more color-coded channels. The vendor name color is enough to distinguish who is who
- Cards should have a very subtle border (#E5E7EB) with no rounded corners beyond 6px
- Reduce card internal padding slightly — they feel bloated
- Vendor note text should be slightly lighter (#9CA3AF) to create hierarchy

### Stage Sections
- Keep the 4px left border in segment color — this is the only segment color needed
- Remove the segment-tinted background from stage sections — just use white and #FAFAFA alternating
- The overlap indicator on the right is good — keep it

### Channel Legend Strip
- Since channel pills are now monochrome in the cards, the colored channel legend at top-right is misleading. Remove the channel legend entirely — it's not needed when channels are just text labels in the cards
- Keep the vendor legend (vendor names with color dots) — this is useful

### Expanded Detail Panel
- Overlap analysis box: keep the amber/red backgrounds — these should stand out since they're alerts
- Strategy box: simpler — no border, no uppercase "STRATEGY" label. Just show the text in a slightly indented paragraph
- Offers/financing pills: make these monochrome too — light gray background, dark text. Red/blue coloring is unnecessary noise

## Creative Gallery Tab — Cleanup

### Problem
The creative cards only have 2 cards per stage but waste tons of horizontal space. The "No image" placeholders are still awkward. The whole page feels sparse and repetitive.

### Fix
- Cards should be 3-4 per row on desktop (grid: repeat(auto-fill, minmax(220px, 1fr)))
- "No image" placeholder: just show a thin 1px dashed border, 40px height, very subtle. No "+" icon, no colored text. Just a tiny gray "No image" in 10px
- When image IS uploaded: show at 120px height
- Move offers and financing pills INSIDE a collapsible section per stage, not always visible — they repeat a lot and create clutter
- Stage headers: keep the colored left bar, make them more compact — less vertical spacing between stages

## Vendors Tab
- Cards look fine, just make them cleaner:
  - Remove the colored top border — put a small colored dot next to the vendor name instead
  - Same subtle card styling as journey vendor cards

## General
- All borders should be #E5E7EB (the standard Tailwind gray-200)
- All card border-radius: 6px (not 8px, not 10px — 6px is cleaner)
- Background should be pure white, alternating sections #FAFAFA
- Remove any remaining bold colors except: vendor name colors and segment badge colors
- Everything else (pills, borders, backgrounds) should be grayscale

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "polish: clean professional design pass" && git push
```

## What NOT To Do
- Do NOT change the data model, persistence, modals, or lock system
- Do NOT change the layout structure — keep stage sections with vendor cards
- Do NOT change the overlap detection logic — only its presentation if needed
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT add dependencies
