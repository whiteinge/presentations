(function () {
    function xIncItems(scope) {
        const items = [];
        scope.querySelectorAll('x-inc').forEach(function (xi) {
            const kids = Array.from(xi.children);
            if (xi.hasAttribute('each')
                && kids.length === 1
                && /^(UL|OL)$/.test(kids[0].tagName)) {
                items.push.apply(items, Array.from(kids[0].children));
            } else {
                items.push.apply(items, kids);
            }
        });
        return items;
    }

    let expanded = false;

    function expand() {
        if (expanded) return;
        expanded = true;

        const originals = document.querySelectorAll('section.slide');
        const total = originals.length;

        // Stamp logical page numbers on each original before cloning
        // so each clone inherits the same number as its parent slide.
        originals.forEach(function (section, i) {
            if (section.classList.contains('no-page-num')) return;
            const num = document.createElement('span');
            num.className = 'page-num';
            num.dataset.xIncPageNum = '';
            num.textContent = (i + 1) + ' / ' + total;
            section.appendChild(num);
        });

        originals.forEach(function (section) {
            const items = xIncItems(section);
            const N = items.length;
            if (N === 0) return;
            // Insert N clones before original. Clone i has items 0..i-1 visible.
            // Original has all N items visible. Total pages: N+1.
            for (let i = 0; i < N; i++) {
                const clone = section.cloneNode(true);
                const cloneItems = xIncItems(clone);
                cloneItems.forEach(function (item, j) {
                    if (j >= i) item.style.visibility = 'hidden';
                });
                clone.dataset.xIncClone = '';
                section.parentNode.insertBefore(clone, section);
            }
        });
    }

    function collapse() {
        if (!expanded) return;
        expanded = false;
        document.querySelectorAll('section.slide[data-x-inc-clone]').forEach(function (n) {
            n.remove();
        });
        document.querySelectorAll('[data-x-inc-page-num]').forEach(function (n) {
            n.remove();
        });
    }

    window.addEventListener('beforeprint', expand);
    window.addEventListener('afterprint', collapse);

    if (window.matchMedia && window.matchMedia('print').matches) {
        expand();
    }

    if (location.search.indexOf('print') !== -1 || location.hash === '#print') {
        expand();
    }
})();
