(function () {
    const i18n = {
        zh: {
            name: '贾周阳',
            bio: '主要从事操作系统和软件可靠性领域相关研究，目前特别关注开放环境下的软件工程和系统软件等问题。欢迎通过邮件联系。',
            position: '副研究员，国防科技大学计算机学院',
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
            bio: 'I conduct research in operating systems and software reliability, currently focusing on the software-engineering and systems-software challenges in open environment. Feel free to contact me.',
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

    function renderPublications(data, lang) {
        if (!data || !Array.isArray(data)) return '';
        const useZh = lang === 'zh';
        let html = '';
        data.forEach(group => {
            html += `<div class="pub-group"><div class="pub-year">${group.year}</div><ul class="pub-list">`;
            group.papers.forEach(p => {
                const title = (useZh && p.title_zh) ? p.title_zh : (p.title || '');
                // 优先使用显式的 authors / venue 字段；若缺失则回退到 legacy meta 拆分
                let authors = p.authors || '';
                let venue = p.venue || '';
                if ((!authors || !venue) && p.meta) {
                    const meta = p.meta;
                    const dotIdx = meta.indexOf('.');
                    if (dotIdx !== -1) {
                        authors = authors || meta.slice(0, dotIdx).trim();
                        venue = venue || meta.slice(dotIdx + 1).trim();
                    } else {
                        const zDot = meta.indexOf('。');
                        if (zDot !== -1) {
                            authors = authors || meta.slice(0, zDot).trim();
                            venue = venue || meta.slice(zDot + 1).trim();
                        } else {
                            venue = venue || meta.trim();
                        }
                    }
                }

                // 高亮作者名（支持英文与中文）
                let authorsHtml = '';
                if (authors) {
                    const esc = s => String(s)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;');
                    authorsHtml = esc(authors)
                        .replace(/Zhouyang Jia/gi, '<span class="author-highlight">Zhouyang Jia</span>')
                        .replace(/贾周阳/g, '<span class="author-highlight">贾周阳</span>');
                }

                const pdf = p.pdf || '#';
                // 将 PDF 按钮与 type（CCF A/B/C 等）并排放在右侧
                html += `<li class="pub-item">
                            <div class="paper-content">
                              <div class="paper-title">${title}</div>
                              ${authors ? `<div class="paper-authors">${authorsHtml}</div>` : ''}
                              ${venue ? `<div class="paper-venue">${venue}</div>` : ''}
                            </div>
                            <div class="paper-actions">
                              <a class="pdf-link" href="${encodeURI(pdf)}" target="_blank" rel="noopener">PDF</a>
                              ${p.type ? `<span class="paper-type">${p.type}</span>` : ''}
                            </div>
                         </li>`;
            });
            html += `</ul></div>`;
        });
        return html;
    }

    function setLang(lang) {
        const map = i18n[lang] || i18n.zh;
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (key && key.endsWith('HTML') && map[key]) {
                el.innerHTML = map[key];
            } else if (map[key]) {
                el.textContent = map[key];
            }
        });

        // render publications from JSON source
        const pubEl = document.getElementById('publications');
        if (pubEl && publicationsData) {
            pubEl.innerHTML = renderPublications(publicationsData, lang);
        }

        const phoneEl = document.querySelector('[data-i18n-key="phone"]');
        if (phoneEl) phoneEl.textContent = map.phone || '';
        const emailEl = document.querySelector('[data-i18n-key="email"]');
        if (emailEl) emailEl.textContent = map.email || '';
        const addressEl = document.querySelector('[data-i18n-key="address"]');
        if (addressEl) addressEl.textContent = map.address || '';

        document.getElementById('btn-zh').classList.toggle('active', lang === 'zh');
        document.getElementById('btn-en').classList.toggle('active', lang === 'en');
        localStorage.setItem('preferredLang', lang);
    }

    // load publications JSON, then initialize UI
    async function loadPublicationsAndInit() {
        try {
            const res = await fetch('assets/papers.json', { cache: "no-store" });
            if (!res.ok) throw new Error('Failed to load publications');
            publicationsData = await res.json();
        } catch (e) {
            console.error('Could not load publications.json:', e);
            publicationsData = []; // avoid errors
        }

        const preferred = localStorage.getItem('preferredLang') || (navigator.language && navigator.language.startsWith('en') ? 'en' : 'zh');

        document.getElementById('btn-zh').addEventListener('click', () => setLang('zh'));
        document.getElementById('btn-en').addEventListener('click', () => setLang('en'));

        setLang(preferred);
    }

    loadPublicationsAndInit();
})();
