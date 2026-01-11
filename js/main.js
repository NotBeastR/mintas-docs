document.addEventListener('DOMContentLoaded', () => {
    // Simple mobile menu toggle
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.innerHTML = '☰';
    toggle.onclick = () => {
        document.querySelector('.sidebar').classList.toggle('open');
    };

    // Only add toggle on small screens
    if (window.innerWidth <= 768) {
        document.body.appendChild(toggle);
    }

    // Safer Syntax Highlighting (Scanner approach)
    // This prevents replacing text inside already generated HTML tags (like 'class=".."')
    const highlightSyntax = (text) => {
        const keywords = new Set(['say', 'let', 'so', 'if', 'else', 'end', 'for', 'while', 'goto', 'times', 'include', 'class', 'public', 'private', 'lamda', 'func', 'return', 'true', 'false', 'maybe']);

        let html = '';
        let i = 0;
        const length = text.length;

        // Html Escape Helper
        const escape = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        while (i < length) {
            const char = text[i];

            // 1. Comments (# ...)
            if (char === '#') {
                let end = text.indexOf('\n', i);
                if (end === -1) end = length;
                const comment = text.substring(i, end);
                html += `<span class="token-comment">${escape(comment)}</span>`;
                i = end;
                continue;
            }

            // 2. Strings ("...")
            if (char === '"') {
                let end = i + 1;
                while (end < length && text[end] !== '"') {
                    if (text[end] === '\\') end++; // skip escaped char
                    end++;
                }
                if (end < length) end++; // consume closing quote
                const string = text.substring(i, end);
                html += `<span class="token-string">${escape(string)}</span>`;
                i = end;
                continue;
            }

            // 3. Numbers
            if (/\d/.test(char)) {
                let end = i;
                while (end < length && /[\d.]/.test(text[end])) end++;
                const num = text.substring(i, end);
                html += `<span class="token-number">${num}</span>`;
                i = end;
                continue;
            }

            // 4. Keywords & Identifiers
            if (/[a-zA-Z_]/.test(char)) {
                let end = i;
                while (end < length && /[a-zA-Z0-9_]/.test(text[end])) end++;
                const word = text.substring(i, end);
                if (keywords.has(word)) {
                    html += `<span class="token-keyword">${word}</span>`;
                } else {
                    html += word;
                }
                i = end;
                continue;
            }

            // 5. Default: just escape and append
            html += escape(char);
            i++;
        }

        return html;
    };

    document.querySelectorAll('pre code').forEach(block => {
        block.innerHTML = highlightSyntax(block.textContent);
    });
});
