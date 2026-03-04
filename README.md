# 🦀 MarkdownPad

A browser-based Markdown playground that renders Markdown to HTML in real time — entirely client-side, with no server required.

The Markdown-to-HTML conversion is powered by [comrak](https://github.com/kivikakk/comrak) (a GitHub Flavored Markdown parser written in Rust), compiled to [WebAssembly](https://webassembly.org/) and running directly in the browser. The editor is [Monaco](https://microsoft.github.io/monaco-editor/) (the engine behind VS Code), and the whole app is a static site hosted on [GitHub Pages](https://pages.github.com/).

**🔗 Live demo:** [dpokluda.github.io/markdownpad](https://dpokluda.github.io/markdownpad/)

## What This Demonstrates

- **Rust → WebAssembly** — compiling a Rust library to WASM with `wasm-pack` and `wasm-bindgen`
- **Calling Rust from JavaScript** — the JS frontend calls Rust functions through auto-generated WASM bindings
- **Static site + WASM** — no backend, no Node.js build step, no bundler; just HTML, CSS, JS, and a `.wasm` file
- **GitHub Pages deployment** — free hosting of a static site from a repository's `/docs` folder

## Features

- **Live preview** — edit Markdown on the left, see formatted HTML on the right, updated on every keystroke
- **Monaco editor** — VS Code's editor with Markdown syntax highlighting, line numbers, and word wrap
- **GFM support** — tables, task lists, strikethrough, and autolinks (GitHub Flavored Markdown)
- **Configurable parser** — toggle individual GFM extensions on/off via the Settings menu
- **Sample documents** — load pre-built examples (Welcome, Tables, Empty) from the toolbar
- **Dark/light theme** — GitHub-inspired themes with one-click toggle; preference saved to localStorage

## Project Structure

```
markdownpad/
├── rustdown/                ← Rust WASM library
│   ├── Cargo.toml           ← Rust dependencies and build config
│   └── src/
│       └── lib.rs           ← Markdown parser (comrak wrapper exposed to JS)
├── docs/                    ← Static website (served by GitHub Pages)
│   ├── index.html           ← Page layout, Monaco loader, toolbar
│   ├── style.css            ← GitHub-inspired dark/light themes
│   ├── app.js               ← Editor setup, WASM integration, UI logic
│   ├── rustdown.js          ← Auto-generated JS glue (wasm-bindgen output)
│   ├── rustdown_bg.wasm     ← Compiled WASM binary (~500 KB)
│   ├── run-local.ps1        ← PowerShell script to start a local dev server
│   └── samples/             ← Sample Markdown files
│       ├── welcome.md
│       ├── tables.md
│       └── empty.md
├── .gitignore
├── LICENSE
└── README.md
```

## How It Works

### 1. Rust Library (`rustdown/`)

The core of the project is a small Rust library that wraps [comrak](https://github.com/kivikakk/comrak), a GFM-compatible Markdown parser. The library exposes two functions to JavaScript via `wasm-bindgen`:

- **`parse_markdown(input)`** — converts Markdown to HTML with all GFM extensions enabled
- **`parse_markdown_with_options(input, table, tasklist, strikethrough, autolink)`** — same conversion but with individually toggleable GFM features

The `Cargo.toml` configures the crate as a `cdylib` (required for WASM output) and `rlib` (required for `cargo test`). The `[profile.release]` section optimizes for binary size (`opt-level = "s"`) and enables link-time optimization (`lto = true`) to keep the `.wasm` file small.

### 2. WASM Build (`wasm-pack`)

Running `wasm-pack build --target web` compiles the Rust library to WebAssembly and generates:

- **`rustdown_bg.wasm`** — the compiled WASM binary containing the parser
- **`rustdown.js`** — auto-generated JavaScript glue code that handles memory management (string passing between JS and WASM), module initialization, and function bindings

These two files are copied into `docs/` to be served alongside the website.

### 3. Static Website (`docs/`)

The frontend is plain HTML, CSS, and JavaScript with no build tools or bundlers:

- **`index.html`** — defines the layout (header, toolbar, split-pane editor/preview, footer) and loads Monaco Editor from a CDN via its AMD loader
- **`style.css`** — implements GitHub-inspired dark and light themes using CSS custom properties. Theme switching simply changes a `data-theme` attribute on `<html>`, and all colors update via CSS variables
- **`app.js`** — the main application logic:
  1. Loads Monaco Editor from the jsdelivr CDN (AMD pattern)
  2. Dynamically imports the WASM module and initializes it
  3. Creates the Monaco editor with Markdown language support
  4. On every editor change, calls the Rust `parse_markdown_with_options()` function through the WASM bridge
  5. Injects the returned HTML into the preview pane
  6. Handles toolbar interactions (samples dropdown, clear, settings toggles, theme switching)

### 4. GitHub Pages Deployment

The site is served from the `docs/` folder on the `main` branch. GitHub Pages serves the static files as-is, including the `.wasm` binary. No CI/CD pipeline or build step is needed — just push and it's live.

## Building and Running Locally

### Prerequisites

| Tool | Purpose | Install |
|------|---------|---------|
| [Rust](https://rustup.rs/) (stable) | Compile the Markdown parser | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| [wasm-pack](https://rustwasm.github.io/wasm-pack/) | Compile Rust to WASM + generate JS bindings | `cargo install wasm-pack` |
| [Python 3](https://www.python.org/) | Local HTTP server (any static server works) | Pre-installed on most systems |

### Step-by-Step Build

```bash
# 1. Clone the repository
git clone https://github.com/dpokluda/markdownpad.git
cd markdownpad

# 2. Run the Rust unit tests
cd rustdown
cargo test

# 3. Build the WASM package
wasm-pack build --target web

# 4. Copy the WASM artifacts to the website directory
cp pkg/rustdown_bg.wasm ../docs/
cp pkg/rustdown.js ../docs/

# 5. Start a local web server
cd ../docs
python -m http.server 8080

# 6. Open in your browser
#    http://localhost:8080
```

> **Windows (PowerShell):** Replace `cp` with `Copy-Item` in step 4, or use the included `docs/run-local.ps1` script for step 5.

### Rebuilding After Changes

If you modify `rustdown/src/lib.rs`, repeat steps 2–4 to rebuild and copy the updated WASM artifacts.

## Deploying to GitHub Pages

1. Push your changes to the `main` branch
2. Go to **Settings → Pages** in your GitHub repository
3. Set **Source** to "Deploy from a branch"
4. Set branch to **`main`** and folder to **`/docs`**
5. Save — the site will be live at `https://<username>.github.io/markdownpad/`

## Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Parser | [comrak](https://github.com/kivikakk/comrak) (Rust) | GFM Markdown → HTML conversion |
| WASM bridge | [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) | Rust ↔ JavaScript interop |
| Build tool | [wasm-pack](https://github.com/nickel-org/rust-web-framework-comparison) | Compiles Rust to `.wasm` + JS glue |
| Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) | VS Code-like editing experience |
| Hosting | [GitHub Pages](https://pages.github.com/) | Free static site hosting |

## License

See [LICENSE](LICENSE) for details.
