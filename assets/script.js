(function () {
    const i18n = {
        zh: {
            name: '贾周阳',
            bio: '主要从事操作系统和软件可靠性领域相关研究，目前特别关注开放环境下的软件工程和系统软件等问题。欢迎通过邮件联系。',
            position: '国防科技大学计算机学院副研究员',
            education: '教育背景',
            educationHTML: `
                    <li>国防科技大学，博士（2016.02 — 2020.12）</li>
                    <li>美国肯塔基大学，访问学者（2018.08 — 2020.08）</li>
                    <li>国防科技大学，硕士（2013.09 — 2015.12）</li>
                    <li>国防科技大学，本科（2009.09 — 2013.07）</li>
                `,
            papers: '论文',
            awards: '获奖',
            awardsHTML: `
                    <ul>
                        <li>ACM SIGSOFT 杰出论文奖 @ ICSE'25 (2025)</li>
                        <li>ACM SIGSOFT 杰出论文奖 @ ICSE'23 (2023)</li>
                        <li>IEEE TCSE 杰出论文奖 @ SANER'23 (2023)</li>
                        <li>IEEE TCSE 杰出论文奖 @ SANER'18 (2018)</li>
                        <li>CCF 优秀博士学位论文提名 (2022)</li>
                        <li>CCF 优秀大学生 (2012)</li>
                    </ul>
                `,
            contact: '联系方式',
            email: '邮箱: jiazhouyang@nudt.edu.cn',
            address: '地址: 湖南省长沙市开福区德雅路109号, 410072',
            copyright: '© 2025 贾周阳。保留所有权利。'
        },
        en: {
            name: 'Zhouyang Jia',
            bio: 'I conduct research in operating systems and software reliability, currently focusing on software-engineering and systems-software challenges in open environments. Feel free to contact me.',
            position: 'Associate Professor, College of Computer Science, National University of Defense Technology',
            education: 'Education',
            educationHTML: `
                    <li>Ph.D. in Software Engineering, National University of Defense Technology (2016.02 — 2020.12)</li>
                    <li>Visiting Scholar, University of Kentucky, USA (2018.08 — 2020.08)</li>
                    <li>M.E. in Software Engineering, National University of Defense Technology (2013.09 — 2015.12)</li>
                    <li>B.E. in Computer Science, National University of Defense Technology (2009.09 — 2013.07)</li>
                `,
            papers: 'Publications',
            awards: 'Awards',
            awardsHTML: `
                    <ul>
                        <li>ACM SIGSOFT Distinguished Paper Award @ ICSE'25 (2025)</li>
                        <li>ACM SIGSOFT Distinguished Paper Award @ ICSE'23 (2023)</li>
                        <li>IEEE TCSE Distinguished Paper Award @ SANER'23 (2023)</li>
                        <li>IEEE TCSE Distinguished Paper Award @ SANER'18 (2018)</li>
                        <li>CCF Excellent Doctoral Incentive Program Nomination Award (2022)</li>
                        <li>CCF Elite Collegiate Award (2012)</li>
                    </ul>
                `,
            contact: 'Contact',
            email: 'Email: jiazhouyang@nudt.edu.cn',
            address: 'Address: 109 Deya Road, Changsha, China, 410072',
            copyright: '© 2025 Zhouyang Jia. All rights reserved.'
        }
    };

    let publicationsData = null;
    let currentLang = 'zh';

    // Helpers
    const $ = sel => document.querySelector(sel);
    const create = (tag, cls) => {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        return el;
    };

    function safeText(el, text) {
        el.textContent = text ?? '';
        return el;
    }

    // highlight occurrences of the target name (supports English/Chinese),
    // returns HTML string (safe-escaped except the highlight spans)
    function highlightAuthorsHtml(raw) {
        if (!raw) return '';
        // escape first
        const esc = s => String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const escaped = esc(raw);
        // highlight both English and Chinese variants, case-insensitive for English
        return escaped
            .replace(/贾周阳/g, '<span class="author-highlight">贾周阳</span>')
            .replace(/Zhouyang Jia/gi, match => `<span class="author-highlight">${match}</span>`);
    }

    // render a single paper item using DOM (better performance/safer than heavy innerHTML)
    function renderPaperItem(p) {
        const li = create('li', 'pub-item');

        const content = create('div', 'paper-content');
        const title = create('div', 'paper-title');
        safeText(title, p._title || p.title || '');
        content.appendChild(title);

        if (p._authors || p.authors) {
            const auth = create('div', 'paper-authors');
            // set innerHTML because we intentionally insert highlight spans
            auth.innerHTML = highlightAuthorsHtml(p._authors || p.authors);
            content.appendChild(auth);
        }

        if (p._venue || p.venue) {
            const venue = create('div', 'paper-venue');
            safeText(venue, p._venue || p.venue || '');
            content.appendChild(venue);
        }

        const actions = create('div', 'paper-actions');

        const pdfLink = create('a', 'pdf-link');
        // encodeURI for the full path; preserve readable filenames
        const href = p.pdf ? encodeURI(p.pdf) : '#';
        pdfLink.setAttribute('href', href);
        pdfLink.setAttribute('target', '_blank');
        pdfLink.setAttribute('rel', 'noopener noreferrer');
        safeText(pdfLink, 'PDF');
        actions.appendChild(pdfLink);

        if (p.type) {
            const typeBadge = create('span', 'paper-type');
            // 根据 type 生成可识别的类名，例如 "CCF A" -> "type-ccf-a"
            const typeClass = 'type-' + String(p.type).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
            typeBadge.classList.add(typeClass);
            safeText(typeBadge, p.type);
            actions.appendChild(typeBadge);
        }

        li.appendChild(content);
        li.appendChild(actions);
        return li;
    }

    // render all publications into container using DOM operations and a DocumentFragment
    function renderPublicationsDOM(data) {
        const container = $('#publications');
        if (!container) return;
        container.innerHTML = ''; // clear
        if (!Array.isArray(data)) return;

        const frag = document.createDocumentFragment();

        data.forEach(group => {
            const groupWrap = create('div', 'pub-group');

            const yearEl = create('div', 'pub-year');
            safeText(yearEl, group.year || '');
            groupWrap.appendChild(yearEl);

            const list = create('ul', 'pub-list');

            if (Array.isArray(group.papers)) {
                // create items
                for (let i = 0, len = group.papers.length; i < len; i++) {
                    const p = group.papers[i];
                    // allow per-language override fields (title_zh/title_en etc.)
                    // set transient _title/_authors/_venue based on currentLang
                    p._title = (currentLang === 'zh' && p.title_zh) ? p.title_zh : p.title;
                    p._authors = (currentLang === 'zh' && p.authors_zh) ? p.authors_zh : p.authors;
                    p._venue = (currentLang === 'zh' && p.venue_zh) ? p.venue_zh : p.venue;

                    list.appendChild(renderPaperItem(p));
                }
            }

            groupWrap.appendChild(list);
            frag.appendChild(groupWrap);
        });

        container.appendChild(frag);
    }

    function applyI18n(lang) {
        const map = i18n[lang] || i18n.zh;
        currentLang = lang;
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (!key) return;
            if (key.endsWith('HTML') && map[key]) {
                el.innerHTML = map[key];
            } else if (map[key]) {
                el.textContent = map[key];
            }
        });

        // update contact/email/address explicit fields (if present)
        const phoneEl = document.querySelector('[data-i18n-key="phone"]');
        if (phoneEl) phoneEl.textContent = map.phone || '';
        const emailEl = document.querySelector('[data-i18n-key="email"]');
        if (emailEl) emailEl.textContent = map.email || '';
        const addressEl = document.querySelector('[data-i18n-key="address"]');
        if (addressEl) addressEl.textContent = map.address || '';

        // render publications (DOM)
        if (publicationsData) {
            renderPublicationsDOM(publicationsData);
        }

        document.getElementById('btn-zh')?.classList.toggle('active', lang === 'zh');
        document.getElementById('btn-en')?.classList.toggle('active', lang === 'en');
        localStorage.setItem('preferredLang', lang);
    }

    // initialize: load JSON once, wire buttons, apply language
    async function init() {
        try {
            const res = await fetch('assets/papers.json', { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            publicationsData = await res.json();
        } catch (err) {
            console.error('Failed to load publications:', err);
            publicationsData = [];
        }

        // wire language buttons (if present)
        const btnZh = document.getElementById('btn-zh');
        const btnEn = document.getElementById('btn-en');

        const preferred = localStorage.getItem('preferredLang') ||
            ((navigator.language && navigator.language.startsWith('en')) ? 'en' : 'zh');

        btnZh?.addEventListener('click', () => applyI18n('zh'));
        btnEn?.addEventListener('click', () => applyI18n('en'));

        // initial render
        applyI18n(preferred);
    }

    // start
    document.addEventListener('DOMContentLoaded', init);
})();
