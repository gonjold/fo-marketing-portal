# WO: FO Marketing Portal — Layout Redesign + Vendor Overlap Intelligence

## Context
The portal is live at fo-marketing-portal.netlify.app. Two problems to solve:
1. The Journey tab matrix layout reads like a spreadsheet — needs to feel like a presentation
2. There's no intelligence about vendor overlap — we need to surface when customers are getting bombarded by multiple vendors through the same channels at the same stage

## Part 1: Journey Tab Layout Redesign

### Remove the matrix table entirely.

### Replace with: Full-Width Stage Sections

Each lifecycle stage gets a full-width horizontal section. Stages stack vertically. The page scrolls through the customer lifecycle like chapters in a story.

#### Each Stage Section:

**Top Bar (always visible):**
- Left: Stage range in large bold text (18px+), label (15px), segment badge
- Right: Small overlap indicator (see Part 2 below)
- Background: very subtle segment color tint (green for Active, amber for At Risk, red for Lost, etc)
- 4px left border in segment color

**Vendor Cards Row (always visible — NOT collapsed):**
- Horizontal flex row of compact vendor cards across the full width
- ONLY show vendors that are ACTIVE at this stage — do not show inactive vendors at all
- Each vendor card:
  - Vendor name (14px bold, vendor color)
  - Channel pills below (12px, padding 5px 12px)
  - One-line note of what they send (12px, gray)
- Cards are compact (150-200px), left-aligned, wrap if needed
- If only 2 vendors active, cards stay compact — don't stretch

**Expandable Detail (click to expand):**
- Strategy/Goal text (14px)
- Offers and Financing pills (12px, padding 5px 14px)
- Overlap warnings if any (see Part 2)

#### Visual Separation:
- 16px gap between sections
- Alternating very subtle background (white / #FAFAFA)

#### Font Sizes:
- Stage range: 18px bold
- Stage label: 14px
- Vendor name in cards: 14px bold
- Channel pills: 12px, padding 5px 12px
- Vendor note: 12px
- Strategy text: 14px
- Offer/financing pills: 12px, padding 5px 14px
- Page side padding: 24px

---

## Part 2: Vendor Overlap Intelligence

### What It Does
Automatically analyzes every stage and detects when multiple vendors are sending through the same channel. Surfaces warnings about customer experience issues.

### Overlap Detection Logic

For each stage, group all active vendors by channel. Flag issues when:

**Channel Saturation (Warning):**
- 3+ vendors sending via the same channel at the same stage
- Example: TVi, AutoPoint, and Reynolds all sending Email at the 6-8 Month stage
- Label: "3 vendors sending Email" — shown as an amber warning

**Heavy Overlap (Alert):**
- 4+ vendors sending via the same channel
- Example: At the 8-12 Month stage, TVi, OV+, AutoPoint, AND Reynolds are all sending Email
- Label: "4 vendors sending Email — customer may feel bombarded"
- Shown as a red alert

**Total Touch Count:**
- Count total number of vendor-channel combinations at each stage
- Example: If 6 vendors are active with 3 channels each = 18 potential touches
- Show this as a simple count: "12 touch points at this stage"

### How to Display Overlaps

**On the Stage Top Bar (always visible):**
- Small indicator on the right side of each stage header
- Green checkmark: No overlap issues (3 or fewer total touches, no channel has 3+ vendors)
- Amber dot: Warning level (a channel has 3 vendors, or 10-15 total touches)
- Red dot: Alert level (a channel has 4+ vendors, or 15+ total touches)
- Next to the dot: brief text like "4 overlaps" or "Clean"

**In the Expanded Detail:**
- Below the strategy section and above offers, show an "Overlap Analysis" box if there are any warnings
- List each flagged channel with the vendors that overlap
- Example:
  ```
  ⚠ Email: TVi, OneVoicePlus, AutoPoint, Reynolds (4 vendors)
  ⚠ Mail: TVi, OneVoicePlus, AutoPoint, Innovative Direct (4 vendors)
  ℹ SMS: TVi, OneVoicePlus, AutoPoint (3 vendors)
  ```
- Use amber background for warnings (3 vendors), red background for alerts (4+)
- Include a one-line recommendation for each:
  - 3 vendors: "Consider coordinating send schedules to avoid same-week delivery"
  - 4+ vendors: "High saturation — customer likely receiving duplicate messaging. Review vendor roles for this channel."

### Implementation Notes
- The overlap calculation is derived entirely from the existing stage data (stage.vc object)
- No new data structures needed — compute overlaps at render time
- Create a small utility function: `getOverlaps(stage, vendors)` that returns the analysis
- This function loops through the stage's vendorComms, groups active vendors by channel, and flags any channel with 3+ vendors

---

## Part 3: Creative Gallery Cleanup

- Empty image placeholder: reduce height from 160px to 60px (thin dashed border, small "No image" text)
- With image: keep 160px height
- Creative title: 15px bold
- Channel pills: 12px
- Description: 13px
- Cards: 3-4 across on desktop using full width

## Part 4: Vendors Tab

- Vendor name: 18px bold
- Description: 14px
- Keep Key Terms collapsible at bottom

---

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "redesign: story layout + vendor overlap intelligence" && git push
```

## What NOT To Do
- Do NOT keep the matrix table — remove it entirely
- Do NOT use tiny fonts — minimum 12px for any text
- Do NOT show inactive vendors in any form (no dashes, no empty states)
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT rewrite the entire file from scratch — modify the existing code
- Do NOT change the data model, Firestore persistence, modals, or lock system
- Do NOT add new dependencies
