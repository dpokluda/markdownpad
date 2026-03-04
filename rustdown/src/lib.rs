use wasm_bindgen::prelude::*;
use comrak::{markdown_to_html, Options};

#[wasm_bindgen]
pub fn parse_markdown(input: &str) -> String {
    let mut options = Options::default();
    options.extension.strikethrough = true;
    options.extension.table = true;
    options.extension.autolink = true;
    options.extension.tasklist = true;
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
