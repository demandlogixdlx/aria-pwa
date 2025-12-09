# ARIA PWA

Personal AI assistant by DemandLogix.

## File Structure

```
aria-pwa/
├── index.html          # Main app shell
├── manifest.json       # PWA manifest (enables "Add to Home Screen")
├── sw.js               # Service worker (offline caching, push ready)
├── css/
│   └── styles.css      # All visual styling
├── js/
│   ├── app.js          # Main UI logic
│   ├── api.js          # n8n webhook calls (Phase 3)
│   └── push.js         # Push notifications (Phase 6)
├── icons/
│   ├── icon-192.svg    # App icon (SVG)
│   ├── icon-512.svg    # App icon large (SVG)
│   ├── icon-192.png    # Placeholder - replace with real icon
│   └── icon-512.png    # Placeholder - replace with real icon
└── README.md
```

## What Each File Does

### index.html
The app shell. Contains the HTML structure for the conversational interface, including:
- Header with logo and streak badge
- Conversation area with messages and embedded cards
- Reply bar with quick chips and text input

### manifest.json
Tells browsers this is an installable PWA. Defines app name, icons, and theme colors. This is what enables "Add to Home Screen" on mobile devices.

### sw.js
Service worker that:
- Caches the app shell for offline use
- Will handle push notifications in Phase 6

### css/styles.css
All visual styling including:
- Brand colors (swap these when finalizing branding)
- Message bubbles, cards, tasks
- Reply bar and input styling
- Animations and transitions

### js/api.js
Handles all communication with n8n webhooks:
- `API.sendMessage()` - Send user messages to ARIA
- `API.completeTask()` - Mark tasks done/undone
- `API.registerPushSubscription()` - Store push subscription

Currently uses simulation mode. Phase 3 will add real webhook URLs.

### js/app.js
Main UI logic:
- Message rendering
- Task checkbox toggling (optimistic UI)
- Toast notifications
- Typing indicator
- Input handling

### js/push.js
Push notification handling (ready for Phase 6):
- Permission requests
- Subscription management
- VAPID key handling

## Deploying to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to project: `cd aria-pwa`
3. Deploy: `vercel`
4. Follow prompts (select your account, no framework, default settings)
5. Get your URL (e.g., `aria-pwa.vercel.app`)

## Deploying to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag the `aria-pwa` folder onto the deploy zone
3. Get your URL (e.g., `aria-pwa.netlify.app`)

Or use Netlify CLI:
1. Install: `npm i -g netlify-cli`
2. Deploy: `netlify deploy --prod --dir=.`

## Testing "Add to Home Screen"

1. Open the deployed URL on your phone
2. **iOS Safari**: Tap Share → Add to Home Screen
3. **Android Chrome**: Tap menu → Add to Home Screen (or look for install prompt)

## Next Steps

### Phase 3: n8n Webhooks
1. Create webhooks in n8n
2. Add URLs to `js/api.js` endpoints object
3. Test message sending and task completion

### Phase 6: Push Notifications
1. Generate VAPID keys
2. Add public key to `js/push.js`
3. Create n8n workflow to send push
4. Store subscriptions in Airtable

## Replacing Icons

The PNG icons are placeholders. To replace:

1. Create 192x192 and 512x512 PNG icons with your branding
2. Replace files in `/icons/` folder
3. Redeploy

The SVG icons work for most browsers but PNGs are needed for full iOS support.

## Customizing Branding

Edit CSS variables in `css/styles.css`:

```css
:root {
  --bg-primary: #0a1628;        /* Main background */
  --coral: #ff6b6b;             /* Gradient color 1 */
  --cyan: #4ecdc4;              /* Gradient color 2 */
  --blue: #45b7d1;              /* Gradient color 3 */
  /* ... */
}
```
