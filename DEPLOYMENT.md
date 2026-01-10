# Deployment Documentation

## Build & Preview

**Build**:
```bash
npm run build
```
This generates the static assets and worker functions in `.svelte-kit/cloudflare`.

**Preview**:
```bash
npm run preview
```
This runs the local wrangler simulation of the build.

## Cloudflare Pages Deployment

**Automatic Git Integration**:
Pushing to the `main` branch will automatically trigger a build and deployment on Cloudflare Pages if connected.

**Manual Deployment via CLI**:
```bash
npx wrangler pages deploy .svelte-kit/cloudflare --project-name ai-agents-multi-tenant-gem
```

## SEO Configuration

- **Meta Tags**: Handled in `src/routes/(landing)/+page.svelte` (Title, Description).
- **Favicon**: Located at `static/favicon.png`.
- **Sitemap**: Should be generated post-build (requires sitemap plugin or manual script).
- **Robots.txt**: Create in `static/robots.txt`.

## Performance Targets

- **LCP**: < 1.5s
- **CLS**: 0
- **Accessibility**: 100% (WCAG AA)

## Environment Variables

Ensure these are set in Cloudflare Pages settings:
- `DEEPGRAM_API_KEY`
- `INWORLD_API_KEY`
- `INWORLD_SCENE`
- `ELEVENLABS_API_KEY`
- `PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
