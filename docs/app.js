import init, { parse_markdown } from "./rustdown.js";

const SAMPLE_MARKDOWN = `# Welcome to MarkdownPad 🦀

A **live Markdown playground** powered by Rust and WebAssembly.

## Features

- ~~Strikethrough~~ text
- **Bold** and *italic*
- [Links](https://github.com)
- Inline \`code\`

## Code Block

\`\`\`rust
fn main() {
    println!("Hello from Rust!");
}
\`\`\`

## Table

| Feature | Status |
|---------|--------|
| GFM Tables | ✅ |
| Task Lists | ✅ |
| Strikethrough | ✅ |

## Task List

- [x] Set up Rust + WASM
- [x] Build the playground
- [ ] Add CodeMirror
- [ ] Add Monaco

> "The best way to learn is to build something." — Someone wise

---

*Rendered with [comrak](https://github.com/kivikakk/comrak) compiled to WebAssembly.*
`;

async function main() {
    await init();

    const editor = document.getElementById("editor");
    const preview = document.getElementById("preview");

    function updatePreview() {
        preview.innerHTML = parse_markdown(editor.value);
    }

    editor.addEventListener("input", updatePreview);

    // Load sample content
    editor.value = SAMPLE_MARKDOWN;
    updatePreview();
}

main();
