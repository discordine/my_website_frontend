import { marked } from 'marked'

/**
 * MarkdownをHTMLへ変換する。
 */
export function renderMarkdown(text: string): string {
    return marked.parse(text, {
        /**
         * GitHub Flavored Markdownを有効にする。
         */
        gfm: true,

        /**
         * Markdown内の改行を <br> にする。
         */
        breaks: true,
    }) as string
}
