use wasm_bindgen::prelude::*;
use comrak::{markdown_to_html, Options};

#[wasm_bindgen]
pub fn parse_markdown(input: &str) -> String {
    parse_markdown_with_options(input, true, true, true, true)
}

#[wasm_bindgen]
pub fn parse_markdown_with_options(
    input: &str,
    table: bool,
    tasklist: bool,
    strikethrough: bool,
    autolink: bool,
) -> String {
    let mut options = Options::default();
    options.extension.table = table;
    options.extension.tasklist = tasklist;
    options.extension.strikethrough = strikethrough;
    options.extension.autolink = autolink;
    markdown_to_html(input, &options)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn basic_markdown() {
        let result = parse_markdown("# Hello\n\nThis is **bold**.");
        assert!(result.contains("<h1>"));
        assert!(result.contains("<strong>bold</strong>"));
    }

    #[test]
    fn gfm_table() {
        let input = "| A | B |\n|---|---|\n| 1 | 2 |";
        let result = parse_markdown(input);
        assert!(result.contains("<table>"));
    }

    #[test]
    fn gfm_tasklist() {
        let input = "- [x] Done\n- [ ] Todo";
        let result = parse_markdown(input);
        assert!(result.contains("checked"));
    }
}
