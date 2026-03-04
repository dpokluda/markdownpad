# 🦀 MarkdownPad

A browser-based Markdown playground powered by Rust and WebAssembly.

Edit Markdown on the left, see the formatted HTML preview on the right — all running client-side with a Rust parser compiled to WASM. Hosted on GitHub Pages.

## Tech Stack

- **Rust** + **comrak** — GFM-compatible Markdown-to-HTML parser
- **wasm-pack** — compiles Rust to WebAssembly with JS bindings
- **HTML / CSS / JavaScript** — static frontend
- **GitHub Pages** — free hosting

## Implementation Plan

The project is built in incremental phases. Each phase produces a working application.

### Phase 1 — Rust + WASM Foundation

Set up the Rust project and compile a working Markdown-to-HTML function to WebAssembly.

1. Initialize the Rust project with `cargo init --lib`
2. Add `comrak` and `wasm-bindgen` as dependencies
3. Write a `parse_markdown(input: &str) -> String` function exposed to JS via `wasm-bindgen`
4. Configure `Cargo.toml` for `cdylib` WASM output
5. Build with `wasm-pack build --target web` and verify the `.wasm` + JS glue are generated

### Phase 2 — Minimal Web App (Textarea)

Create a simple static website with a split-pane layout using a plain `<textarea>` as the editor.

1. Create `index.html` with a two-pane layout (editor left, preview right)
2. Add basic CSS for the split-pane layout (flexbox or CSS grid)
3. Load the WASM module in JavaScript
4. Wire up an `input` event listener on the textarea to call the WASM `parse_markdown` function
5. Render the returned HTML into the preview pane
6. Test locally with a simple HTTP server

### Phase 3 — GitHub Pages Deployment

Get the app live on the web.

1. Configure the repo for GitHub Pages (serve from `main` branch or `/docs` folder)
2. Organize build output so the static site and WASM artifacts are in the served directory
3. Verify the live site works at `https://<username>.github.io/rustdown/`

### Phase 4 — CodeMirror Editor Upgrade

Replace the plain textarea with CodeMirror for a proper editing experience.

1. Add CodeMirror 6 (via CDN or npm)
2. Configure Markdown syntax highlighting and line numbers
3. Replace the textarea with a CodeMirror editor instance
4. Wire CodeMirror's change events to the WASM parser
5. Style the editor to match the overall layout

### Phase 5 — Monaco Editor Upgrade

Replace CodeMirror with Monaco for a VS Code-like editing experience.

1. Add Monaco Editor (via CDN or npm)
2. Configure Monaco with Markdown language support and line numbers
3. Replace CodeMirror with a Monaco editor instance
4. Wire Monaco's `onDidChangeModelContent` event to the WASM parser
5. Style and tune the editor (minimap, word wrap, theme)

### Phase 6 — Polish & Enhancements (Optional)

Nice-to-have features to improve the playground.

- Toolbar with common Markdown actions (bold, italic, headings, links)
- Dark/light theme toggle
- Debounced parsing for large documents
- Sample Markdown loaded on first visit
- Responsive design for mobile/tablet
- Export rendered HTML or copy to clipboard

## Project Structure

```
markdownpad/
├── rustdown/          ← Rust WASM library
│   ├── Cargo.toml
│   └── src/lib.rs
├── docs/              ← Static website (served by GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── rustdown.js    ← WASM JS glue (build artifact)
│   └── rustdown_bg.wasm
├── README.md
├── LICENSE
└── .gitignore
```

## Development

### Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- Python 3 (for local server)
- A modern web browser

### Build & Run

```bash
# Build the WASM package
cd rustdown
wasm-pack build --target web

# Copy WASM artifacts to the website
cp pkg/rustdown_bg.wasm ../docs/
cp pkg/rustdown.js ../docs/

# Run locally
cd ../docs
.\run-local.ps1
```

### GitHub Pages Deployment

The site is served from the `docs/` folder on the `main` branch.

1. Go to **Settings → Pages** in the GitHub repository
2. Under **Source**, select **Deploy from a branch**
3. Set branch to `main` and folder to `/docs`
4. Save — the site will be live at `https://dpokluda.github.io/markdownpad/`

## License

See [LICENSE](LICENSE) for details.
