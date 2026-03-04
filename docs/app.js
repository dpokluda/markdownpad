import init, { parse_markdown } from "./rustdown.js";
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";

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
- [x] Add CodeMirror
- [ ] Add Monaco

> "The best way to learn is to build something." — Someone wise

---

*Rendered with [comrak](https://github.com/kivikakk/comrak) compiled to WebAssembly.*
`;

async function main() {
    await init();

    const preview = document.getElementById("preview");

    function updatePreview(content) {
        preview.innerHTML = parse_markdown(content);
    }

    const editor = new EditorView({
        doc: SAMPLE_MARKDOWN,
        extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            markdown(),
            syntaxHighlighting(defaultHighlightStyle),
            oneDark,
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    updatePreview(update.state.doc.toString());
                }
            }),
        ],
        parent: document.getElementById("editor"),
    });

    // Initial render
    updatePreview(SAMPLE_MARKDOWN);
}

main();
