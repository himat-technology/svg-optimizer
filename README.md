# SVG Optimizer & Vector Cleaner — HiMat Technology

A production-ready, **browser-local** SVG optimization tool built with Next.js, TypeScript, React, and Tailwind CSS.

> **Live demo:** [https://himat.tech/free-tools/svg-optimizer](https://himat.tech/free-tools/svg-optimizer)

SVGs are parsed, cleaned, compared, and exported **entirely in the browser** using `DOMParser` and `XMLSerializer`. No SVG content is uploaded to a server.

---

## HiMat Technology

| | |
| --- | --- |
| **Website / Demo** | [himat.tech/free-tools/svg-optimizer](https://himat.tech/free-tools/svg-optimizer) |
| **Phone** | [94452 34023](tel:+919445234023) |
| **Facebook** | [Himat Technology](https://www.facebook.com/people/Himat-technology/61593829197445/) |
| **LinkedIn** | [himat-technology](https://www.linkedin.com/company/himat-technology) |
| **Instagram** | [@himat_technology](https://www.instagram.com/himat_technology) |

---

## Features

- Paste raw SVG markup or upload `.svg` files
- Load a realistic sample SVG with intentional editor bloat
- Toggle cleaner rules: comments, metadata, empty groups, unused attributes, XML minification
- Coordinate precision rounding (1 / 2 / 3 decimal places)
- Side-by-side original vs optimized visual preview (sandboxed `<img>` data URIs)
- Live statistics: original/optimized byte size, bandwidth saved, nodes cleaned
- Copy optimized SVG code and Base64 Data URIs
- Download `*-optimized.svg` (or `optimized-himat.svg`)
- Clear error messages for invalid / empty input
- Accessible controls, keyboard focus, and status messaging

## Privacy architecture

| Concern | Behavior |
| --- | --- |
| Upload destination | None — files are read with the File API in memory |
| Optimization | Client-side `DOMParser` / `XMLSerializer` pipeline |
| Preview safety | SVG sanitized, then rendered as an image data URI (scripts cannot execute) |
| Network | The app does not send SVG contents to any API |

The UI states **100% Browser-Local Processing** and **Your SVG never leaves your browser.**

## Stack

- Next.js (App Router)
- React + TypeScript (strict)
- Tailwind CSS
- Vitest + happy-dom (optimizer unit tests)

## Project structure

```text
app/
  free-tools/svg-optimizer/page.tsx   # Main tool route + SEO metadata
  layout.tsx / page.tsx / globals.css
components/svg-optimizer/             # UI components
hooks/                                # useSvgOptimizer, useClipboard
lib/svg/                              # Parser, cleaners, precision, stats, data-uri
tests/svg-optimizer.test.ts
public/samples/sample.svg
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000/free-tools/svg-optimizer](http://localhost:3000/free-tools/svg-optimizer).

Compare with the live product: [https://himat.tech/free-tools/svg-optimizer](https://himat.tech/free-tools/svg-optimizer).

## Production build

```bash
npm run build
npm run start
```

## Typecheck & lint

```bash
npm run typecheck
npm run lint
```

## Testing

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage areas:

- Comment removal
- Editor metadata / namespace stripping
- Empty `<g>` removal
- Precision rounding
- Byte-size statistics (`Blob`)
- Data URI prefix
- Invalid SVG errors
- Rendering preservation / referenced IDs

## Optimization algorithm

1. **Parse** — `DOMParser` with `image/svg+xml`; reject empty or non-SVG input
2. **Strip comments** (optional) — remove comment nodes
3. **Remove metadata** (optional) — drop `<metadata>`, editor namespaces (`inkscape:`, `sodipodi:`, `sketch:`, Adobe URIs), and related attributes; keep required `xmlns` / `xlink` and referenced IDs
4. **Precision** — round numeric attrs (`cx`, `cy`, `d`, `transform`, `viewBox`, …) to 1–3 decimals without corrupting path commands
5. **Clean unused attrs** (optional) — remove clearly redundant defaults when safe
6. **Remove empty groups** (optional) — recursively delete empty `<g>` nodes that are not referenced
7. **Serialize** — `XMLSerializer`, optional whitespace minification
8. **Stats + Data URI** — `Blob` byte sizes, element node counts, Base64 data URI

**Correctness first:** IDs referenced by `url(#…)`, `<use href>`, gradients, clips, masks, filters, CSS, or animations are not removed.

## Security considerations

- Uploaded SVG is treated as untrusted
- Preview path sanitizes scripts, `foreignObject`, and `on*` handlers
- Preview uses `<img src="data:image/svg+xml;base64,…">` so scripts do not run in the page DOM
- UI never uses `dangerouslySetInnerHTML` for user SVG markup (structured JSON-LD on the page is static)

## Browser compatibility

Requires a modern browser with:

- `DOMParser` / `XMLSerializer`
- `Blob` / `URL.createObjectURL`
- `File` / `FileReader` (or `file.text()`)
- Clipboard API (with `document.execCommand('copy')` fallback)

Tested targets: latest Chrome, Firefox, Edge, and Safari.

## Deployment to Vercel

1. Push this repository to GitHub / GitLab / Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Framework preset: **Next.js** (defaults are fine)
4. Build command: `npm run build`
5. Output: Next.js default
6. Deploy

No environment variables or server routes are required for SVG processing.

## Contact & social

- **Phone:** [94452 34023](tel:+919445234023)
- **Demo:** [himat.tech/free-tools/svg-optimizer](https://himat.tech/free-tools/svg-optimizer)
- **Facebook:** [facebook.com/people/Himat-technology/61593829197445](https://www.facebook.com/people/Himat-technology/61593829197445/)
- **LinkedIn:** [linkedin.com/company/himat-technology](https://www.linkedin.com/company/himat-technology)
- **Instagram:** [instagram.com/himat_technology](https://www.instagram.com/himat_technology)

## License

See [LICENSE](./LICENSE).
