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
- [x] Add Monaco

> "The best way to learn is to build something." — Someone wise

---

*Rendered with [comrak](https://github.com/kivikakk/comrak) compiled to WebAssembly.*
`;

require.config({
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" },
});

require(["vs/editor/editor.main"], async function () {
    const { default: init, parse_markdown } = await import("./rustdown.js");
    await init("./rustdown_bg.wasm");

    const preview = document.getElementById("preview");

    function updatePreview(content) {
        preview.innerHTML = parse_markdown(content);
    }

    const editor = monaco.editor.create(document.getElementById("editor"), {
        value: SAMPLE_MARKDOWN,
        language: "markdown",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        wordWrap: "on",
        lineNumbers: "on",
        fontSize: 14,
        fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
        scrollBeyondLastLine: false,
        padding: { top: 8 },
    });

    editor.onDidChangeModelContent(() => {
        updatePreview(editor.getValue());
    });

    // Initial render
    updatePreview(SAMPLE_MARKDOWN);
});
