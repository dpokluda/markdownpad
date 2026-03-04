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
- [x] Add Monaco editor
- [ ] Explore more Markdown

> "The best way to learn is to build something." — Someone wise

---

*Rendered with [comrak](https://github.com/kivikakk/comrak) compiled to WebAssembly.*
`;

require.config({
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" },
});

// Theme management
function getStoredTheme() {
    return localStorage.getItem("markdownpad-theme") || "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("markdownpad-theme", theme);
    document.getElementById("theme-toggle").textContent = theme === "dark" ? "☀️" : "🌙";
}

applyTheme(getStoredTheme());

// Close all dropdowns when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown") && !e.target.closest("#settings-btn")) {
        document.querySelectorAll(".dropdown-menu").forEach((m) => m.classList.remove("open"));
    }
});

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains("open");
    document.querySelectorAll(".dropdown-menu").forEach((m) => m.classList.remove("open"));
    if (!isOpen) menu.classList.add("open");
}

require(["vs/editor/editor.main"], async function () {
    const { default: init, parse_markdown_with_options } = await import("./rustdown.js");
    await init("./rustdown_bg.wasm");

    const preview = document.getElementById("preview");

    function getParserOptions() {
        return {
            table: document.getElementById("opt-table").checked,
            tasklist: document.getElementById("opt-tasklist").checked,
            strikethrough: document.getElementById("opt-strikethrough").checked,
            autolink: document.getElementById("opt-autolink").checked,
        };
    }

    function updatePreview(content) {
        const opts = getParserOptions();
        preview.innerHTML = parse_markdown_with_options(
            content, opts.table, opts.tasklist, opts.strikethrough, opts.autolink
        );
    }

    function monacoTheme() {
        return getStoredTheme() === "dark" ? "vs-dark" : "vs";
    }

    const editor = monaco.editor.create(document.getElementById("editor"), {
        value: SAMPLE_MARKDOWN,
        language: "markdown",
        theme: monacoTheme(),
        automaticLayout: true,
        minimap: { enabled: false },
        wordWrap: "on",
        lineNumbers: "on",
        fontSize: 14,
        fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
        scrollBeyondLastLine: false,
        padding: { top: 8 },
    });

    // Theme toggle
    document.getElementById("theme-toggle").addEventListener("click", () => {
        const newTheme = getStoredTheme() === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        monaco.editor.setTheme(monacoTheme());
    });

    // Samples dropdown
    document.getElementById("samples-btn").addEventListener("click", () => toggleMenu("samples-menu"));

    document.querySelectorAll("[data-sample]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const name = btn.getAttribute("data-sample");
            const res = await fetch("./samples/" + name + ".md");
            const text = await res.text();
            editor.setValue(text);
            document.getElementById("samples-menu").classList.remove("open");
        });
    });

    // Clear button
    document.getElementById("clear-btn").addEventListener("click", () => {
        editor.setValue("");
    });

    // Export dropdown
    document.getElementById("export-btn").addEventListener("click", () => toggleMenu("export-menu"));

    function getRenderedHtml() {
        return preview.innerHTML;
    }

    function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const original = btn.textContent;
            btn.textContent = "✓ Copied!";
            setTimeout(() => { btn.textContent = original; }, 1500);
        });
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        document.getElementById("export-menu").classList.remove("open");
    }

    document.getElementById("copy-md").addEventListener("click", (e) => {
        copyToClipboard(editor.getValue(), e.target);
    });

    document.getElementById("copy-html").addEventListener("click", (e) => {
        copyToClipboard(getRenderedHtml(), e.target);
    });

    document.getElementById("download-md").addEventListener("click", () => {
        downloadFile(editor.getValue(), "document.md", "text/markdown");
    });

    document.getElementById("download-html").addEventListener("click", () => {
        const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>Markdown Export</title></head>\n<body>\n${getRenderedHtml()}\n</body>\n</html>`;
        downloadFile(html, "document.html", "text/html");
    });

    // Settings dropdown
    document.getElementById("settings-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu("settings-menu");
    });

    document.getElementById("settings-menu").addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.querySelectorAll("#settings-menu input").forEach((input) => {
        input.addEventListener("change", () => {
            updatePreview(editor.getValue());
        });
    });

    // Editor change handler
    editor.onDidChangeModelContent(() => {
        updatePreview(editor.getValue());
    });

    // Initial render
    updatePreview(SAMPLE_MARKDOWN);
});
