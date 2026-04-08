# WO: FO Marketing Portal — Full Width + Dark Mode Toggle

## Context
Portal is live at fo-marketing-portal.netlify.app. Design is approved. Two changes needed.

## Change 1: Full Width
The content is constrained by `maxWidth: 1100` on the main element. Remove this constraint so the content uses the full viewport width with just the 28px side padding. The vendor blocks should spread wider on large screens.

In src/App.jsx find `maxWidth:1100` and remove it entirely.

## Change 2: Dark Mode Toggle

### Add a toggle button
Next to the lock icon in the header, add a small sun/moon toggle button. Store the mode in localStorage key "ccj4-theme" so it persists.

### State
Add state: `const [dark, setDark] = useState(false)`
On mount, check localStorage and also check `window.matchMedia('(prefers-color-scheme: dark)').matches` as default.

### Implementation
When dark mode is active, apply these overrides by adding a class to the root div:

Add a `<style>` block with these CSS variables on `.dark-mode`:
```css
.dark-mode {
  background: #0F1117 !important;
  color: #E5E7EB !important;
}
.dark-mode header {
  background: #0F1117 !important;
}
.dark-mode nav {
  border-color: #2A2D3A !important;
}
.dark-mode nav button {
  color: #9CA3AF !important;
}
```

BUT — this CSS approach won't work well with all the inline styles. Instead, do this:

1. Create a theme object at the top of the component:
```js
const light = { bg: "#fff", card: "#fff", text: "#141414", textSec: "#6B7280", textTri: "#9CA3AF", border: "#E5E7EB", borderLight: "#F3F4F6", surface: "#F9FAFB", headerBg: "#fff" };
const darkT = { bg: "#0F1117", card: "#1A1D27", text: "#E5E7EB", textSec: "#9CA3AF", textTri: "#6B7280", border: "#2A2D3A", borderLight: "#1F2230", surface: "#151822", headerBg: "#0F1117" };
```

2. Use `const T = dark ? darkT : light;` and replace hardcoded color references throughout the render:
   - `"#fff"` background → `T.bg`
   - `DK` or `"#141414"` text → `T.text`
   - `G500` secondary text → `T.textSec`
   - `G400` tertiary text → `T.textTri`
   - `G200` borders → `T.border`
   - `G100` light borders → `T.borderLight`
   - `"#F9FAFB"` surfaces → `T.surface`
   - Card/stage backgrounds `"#fff"` → `T.card`

3. Vendor block backgrounds stay the same (they use vendor color at 8% opacity which works in both modes)
4. Overlap warning boxes (red/yellow) stay the same — they should pop in both modes
5. The RED accent color stays the same in both modes
6. Segment badge backgrounds work because they use the segment color at 15% opacity

### Toggle Button
Small button next to the lock icon:
```jsx
<button onClick={() => { const next = !dark; setDark(next); localStorage.setItem("ccj4-theme", next ? "dark" : "light"); }} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 8px", cursor: "pointer", color: T.textSec, fontSize: 14 }}>
  {dark ? "☀" : "☾"}
</button>
```

### Modals
Modal overlay background stays the same (rgba(0,0,0,.4)).
Modal content background: use `T.card`.
Modal input borders: use `T.border`.
Modal input backgrounds: use `T.bg`.

## Build + Deploy
```bash
npm run build
npx netlify-cli deploy --prod
git add -A && git commit -m "feat: full width + dark mode toggle" && git push
```

## What NOT To Do
- Do NOT change the layout structure, vendor blocks, or overlap logic
- Do NOT change any data or persistence logic
- Do NOT use CSS variables (we're using inline styles throughout, keep it consistent with a theme object)
- Do NOT use `sed` — use `perl -i -pe` on macOS
- Do NOT add dependencies
