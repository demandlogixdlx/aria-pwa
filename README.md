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
└── icons/
    ├── dlx-logo.png    # DemandLogix logo (header)
    ├── icon-192.png    # App icon 192x192
    └── icon-512.png    # App icon 512x512
```

## Deploying Updates

1. Go to your GitHub repository
2. Delete existing files or upload to overwrite
3. Select all files (index.html, manifest.json, sw.js, css/, js/, icons/)
4. Drag them into GitHub upload
5. Commit changes
6. Vercel auto-deploys

## After Updating

You may need to clear your browser cache or remove and re-add the app to your home screen to see the new icon.
