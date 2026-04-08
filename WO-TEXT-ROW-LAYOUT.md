# WO: FO Marketing Portal — Clean Text-Row Journey Layout

## Context
The portal is live at fo-marketing-portal.netlify.app. We've been iterating on the Journey tab layout and landed on a clean, document-style approach. No more cards, no more pills, no more colored boxes. Just clean text rows.

## Journey Tab — Replace Current Layout

Remove ALL vendor cards, channel pills, and card containers from the Journey tab. Replace with simple text rows.

### Each Stage Section:

**Header row:**
- 3px left border in segment color (green/amber/red/gray)
- 12px padding-left
- Stage range: 18px, font-weight 500
- Stage label: 13px, secondary text color, same line
- Segment badge: small pill (10px text, segment color background at 12% opacity, segment color text)
- Overlap indicator: pushed to right side with margin-left:auto
  - Green checkmark + "Clean · X touches" in green for no issues
  - Red dot + "X overlaps · Y touches" in red for issues
- The whole header row uses display:flex, align-items:baseline, gap:10px

**Vendor rows (below header, always visible):**
- padding-left: 15px (aligns under the header text)
- Each vendor is a single line using display:flex
- Three columns in each row:
  1. Vendor name: 110px wide, flex-shrink:0, font-weight 500, colored in the vendor's color
  2. Channels: 180px wide, flex-shrink:0, secondary text color, plain text separated by " · " (e.g. "Email · Mail · SMS · Digital") — NO pills, NO badges, NO colored backgrounds. Just plain text.
  3. Note: tertiary text color, takes remaining space (what they send at this stage)
- Font size: 13px for all three columns
- line-height: 1.6
- Gap between vendor rows: 6px
- Only show active vendors — do not show inactive vendors at all

**Expandable detail (click header to expand):**
- Appears below the vendor rows
- Indented to match (padding-left: 15px)
- Strategy text: 14px, normal color, no box, no label, just the text as a paragraph with 8px top margin
- Overlap analysis: keep the amber/red background alert boxes as they are now — these should pop visually since they're warnings
- Offers and financing: show as plain text list or very subtle gray pills (monochrome only)
- Add a subtle top border (1px, light gray) to separate from vendor rows

**Between stages:**
- 28px margin-bottom per stage section
- No borders between stages — the left-border color change and whitespace provide separation

### Vendor Legend (top of page):
- Keep it — simple flex row with colored dots and vendor names
- Font size: 12px
- Remove the channel legend entirely — channels are now plain text in each row

### General:
- Background: pure white
- No alternating backgrounds needed — the whitespace handles separation
- All text uses CSS variables for color (--color-text-primary, --color-text-secondary, --color-text-tertiary or equivalent from the app's color constants)
- The vendor name colors are the ONLY non-gray colors in the rows

## Do NOT Change
- Creative Gallery tab
- Vendors tab  
- Data model, Firestore persistence, modals, or lock system
- The overlap detection logic (getOverlaps function)
- The expand/collapse state management

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "redesign: clean text-row journey layout" && git push
```

## What NOT To Do
- Do NOT use cards, pills, badges, or colored backgrounds for channel labels
- Do NOT use boxes or containers around vendor rows
- Do NOT add any colored backgrounds except the segment badge and overlap alert boxes
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT rewrite the entire file — only modify the Journey tab render section
- Do NOT add dependencies
