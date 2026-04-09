# WO: FO Marketing Portal — Working Session Mode

## Context
Portal is live at fo-marketing-portal.netlify.app. This is being used TOMORROW in an all-hands meeting with all marketing vendors (TVi, AutoPoint, OneVoicePlus, Reynolds, Innovative, CRM/BDC). The goal is NOT to present a finished strategy — it's to collaboratively fill in what each vendor actually does at each lifecycle stage and then identify overlaps and opportunities together.

## Change 1: Stage Label Prominence

The stage label (e.g. "New Owner", "After Service", "At Risk") is currently 12px secondary text next to the range. It needs to be much more prominent — it's what people in the room will reference.

Change the stage header layout:
- Stage range (e.g. "<30 Days RDR"): keep at current size but make it secondary — 13px, gray text
- Stage label (e.g. "New Owner"): make this the primary text — 20px, bold, dark color
- So instead of: `<30 Days RDR  New Owner  [Active]`
- It becomes: `New Owner  <30 Days RDR  [Active]`
- Label first, range second, badge third

## Change 2: Channel Options Display

Currently each vendor block shows channels as plain text ("Email · Mail · SMS · Digital"). This gives no indication of what channels are AVAILABLE vs what's ACTIVE.

Change vendor blocks so they show ALL possible channels as small toggleable indicators:
- Show all 6 channels (Email, Mail, SMS, Digital, Call, Text) as small labels in each vendor block
- Active channels: show with the vendor's color text and a subtle background
- Inactive/available channels: show as very faint gray text (like a disabled state)
- This way during the meeting, people can see "oh, Reynolds COULD do SMS but they're only doing Email right now"

Implementation:
- In each VendorBlock, instead of `vc.ch.join(" · ")`, render ALL channels
- For each channel, check if it's in `vc.ch` array
- Active: `fontSize:11, fontWeight:600, color: vendor.color, background: vendor.color+"12", padding:"1px 6px", borderRadius:3`
- Inactive: `fontSize:11, color: "#D1D5DB", padding:"1px 6px"` (very light gray, almost invisible but readable)
- This makes it visually obvious which channels are lit up vs dormant

## Change 3: Clear Unknown Data

Right now the portal has placeholder data that looks authoritative but is actually guesswork. For the meeting, we need to be honest about what we KNOW vs what we're GUESSING.

Update the vendor notes for stages where we DON'T have confirmed data:
- Keep the vendor toggled ON if we know they're active at that stage (based on the MARCOM matrix Excel)
- But change the note text to "Confirm in meeting" for any vendor where we don't have specific campaign names
- The only confirmed data we have is:
  - TVi: active at all stages, 0-7 DOFU window (from MARCOM matrix)
  - AutoPoint: active at 6+ month stages, ASR integration confirmed, tire promo / oil change / alignment offers confirmed from the email creative
  - OneVoicePlus: OEM program, both DOFU windows (from MARCOM matrix)  
  - Reynolds: monthly email blasts to all (from MARCOM matrix)
  - Innovative Direct: DMS + Conquest VIN targeting (from MARCOM matrix)
  - CRM/BDC: internal team (known)
- Everything else (specific campaign names, specific channel usage per stage) should say "Confirm in meeting" instead of made-up campaign names

For the note field in each vendor's stage coverage:
- If we KNOW what they send: keep the note (e.g. "ASR, Service Recommendation" for TVi at <30 days RO)
- If we're GUESSING: change to "To be confirmed" in italic gray

## Change 4: Editable Without Password During Meeting

Add a URL parameter override: if the URL has `?edit=true`, skip the password and go straight to edit mode. This way the meeting facilitator can open the editable version and the audience sees changes live.

Implementation:
```js
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('edit') === 'true') setEdit(true);
}, []);
```

Keep the lock icon for the normal URL without the parameter.

## Do NOT Change
- The overall visual design (vendor tint blocks, escalation colors, overlap detection)
- Dark mode toggle
- Firestore/localStorage persistence  
- The modal editors
- Creative Gallery or Vendors tabs

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "feat: working session mode for vendor all-hands" && git push
```

## What NOT To Do
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT change the layout structure
- Do NOT add dependencies
