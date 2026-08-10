import { marked } from 'marked'

/**
 * [aa] ～ [/aa] をAAブロックとして扱う拡張。
 */
const aaExtension = {
    name: 'aa',
    level: 'block' as const,

    /**
     * Markdown内に [aa] が存在する位置を返す。
     */
    start(src: string) {
        const index = src.search(/\[aa\]/i)

        return index >= 0 ? index : undefined
    },

    /**
     * [aa] ～ [/aa] を1つのトークンとして取得する。
     */
    tokenizer(src: string) {
        const rule = /^\[aa\]([\s\S]*?)\[\/aa\](?:\n+|$)/i
        const match = rule.exec(src)

        if (!match) {
            return
        }

        console.log('AA matched')

        return {
            type: 'aa',
            raw: match[0],
            text: match[1],
        }
    },

    /**
     * AAを <pre> として出力する。
     */
    renderer(token: any) {
        const escaped = escapeHtml(token.text)

        return `<pre class="aa">${escaped}</pre>\n`
    },
}

/**
 * HTML特殊文字をエスケープする。
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

/**
 * AA拡張をMarkedに登録する。
 *
 * marked.parse() より前に登録する必要がある。
 */
marked.use({
    extensions: [aaExtension],
})

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