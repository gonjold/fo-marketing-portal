# WO: FO Marketing Portal — Update OV+ Data with Confirmed Details

## Context
Portal is live at fo-marketing-portal.netlify.app. We extracted confirmed data about OneVoicePlus (OV+) from an Oct 2025 meeting deck. Need to update the portal so OV+ reflects reality. Important: the "Free, Free, Free" offer program has been discontinued. OV+ currently runs with NO specific offers on their campaigns.

## Important
This WO only changes the INITIAL DATA in `initS` (the stages array) at the top of src/App.jsx. Do NOT change any rendering, styling, or functionality. Only update the `v2` (OneVoicePlus) entries within each stage's `vc` object.

## Confirmed OV+ Coverage

OV+ channels are Email and Smart Mail (direct mail) ONLY. They do NOT do SMS, Digital, Call, or Text. No specific offers are currently attached to any OV+ campaigns.

### Stage: New Owner (<30 Days RDR)
- v2: `on: false` — No confirmed new owner campaign from OV+.

### Stage: After Service (<30 Days RO)  
- v2: `on: false` — No confirmed post-service campaign from OV+.

### Stage: Scheduled Service Due (5-6 Months RO)
- v2: `on: false` — OV+ lifecycle campaigns start at 7 months. Not active here.

### Stage: Service Follow-Up (6-8 Months RO)
- v2: `on: true, ch: ["Email", "Mail"], note: "TLE 7-9 mo. Email + Smart Mail. No specific offer attached."`

### Stage: At Risk (8-12 Months RO)
- v2: `on: true, ch: ["Email", "Mail"], note: "TLE 10-12 mo. Email + Smart Mail. No specific offer attached."`

### Stage: Inactive (12-24 Months)
- v2: `on: true, ch: ["Email", "Mail"], note: "TLE 13-23 mo. Email + Smart Mail. No specific offer attached."`

### Stage: Lost / Recovery (25-60 Months)
- v2: `on: true, ch: ["Email", "Mail"], note: "TLE 24+ mo. Email + Smart Mail. No specific offer attached."`

### Stage: Conquest / Not Engaged (Never Serviced)
- v2: `on: false` — OV+ TLE campaigns target existing customers, not conquest.

## Also Update Stage Goals
- Service Follow-Up (6-8 Months RO): append to goal: "OV+ ToyotaCare campaigns may also touch this window — confirm with Blake Hallonquist."
- Scheduled Service Due (5-6 Months RO): append to goal: "OV+ ToyotaCare campaigns may overlap here — confirm timing with SET rep."

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "data: update OV+ confirmed coverage, no offers attached" && git push
```

## What NOT To Do
- Do NOT change any rendering, styling, or component logic
- Do NOT change any vendor other than v2 (OneVoicePlus)
- Do NOT add "Free, Free, Free" or any offers — that program is discontinued
- Do NOT use `sed` — use `perl -i -pe` on macOS
