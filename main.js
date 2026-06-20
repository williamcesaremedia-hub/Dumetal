/* =============================================================
   Dumetal — Chrome partagé (header + footer)
   Injecté sur toutes les pages pour rester DRY.
   Chaque page déclare son nom via <body data-page="...">.
   ============================================================= */

const NAV = [
    { href: 'index.html',        label: 'Accueil',                 key: 'accueil' },
    { href: 'modeles.html',      label: 'Nos Modèles',             key: 'modeles' },
    { href: 'location.html',     label: 'Location',                key: 'location' },
    { href: 'realisations.html', label: 'Réalisations',            key: 'realisations' },
    { href: 'a-propos.html',     label: 'À Propos',                key: 'apropos' },
    { href: 'contact.html',      label: 'Contact',                 key: 'contact' },
];

const CONTACT = {
    email: 'contact@dumetal.fr',
    phoneDisplay: '+33 0 00 00 00 00',
    phoneTel: '+33000000000',
    whatsapp: '33000000000',           // numéro international sans + ni espaces
    address: '9 rue Charles Tellier',
    postalCode: '78520',
    city: 'Limay',
    region: 'Île-de-France',
};

// Logo (fond noir) + nom de la société "Dumetal".
const LOGO = `<span class="inline-flex items-center gap-2.5">
    <span class="inline-flex items-center rounded-lg" style="background:#0a0a0b;padding:4px 7px;"><img src="assets/logo-dumetal.jpeg" alt="Logo Dumetal — Containers aménagés" style="height:46px;width:auto;display:block;" /></span>
    <span class="font-serif font-black text-xl md:text-2xl tracking-tight" style="font-family:'Merriweather',serif;color:var(--ink);line-height:1;"><span style="color:var(--green)">Du</span>metal</span>
</span>`;

(() => {
    const current = document.body.dataset.page || '';

    /* -------- HEADER -------- */
    const navItems = NAV.map(item => {
        const active = item.key === current ? ' active' : '';
        return `<a href="${item.href}" class="nav-link${active}">${item.label}</a>`;
    }).join('');

    const mobileItems = NAV.map(item => {
        const active = item.key === current ? ' active' : '';
        return `<a href="${item.href}" class="nav-link${active} block py-3 border-b border-[var(--line)]">${item.label}</a>`;
    }).join('');

    const header = `
    <header class="site-header">
        <div class="max-w-7xl mx-auto px-5 md:px-6">
            <div class="flex items-center justify-between h-[68px]">
                <a href="index.html" class="flex items-center" aria-label="Accueil DUMETAL">${LOGO}</a>
                <nav class="hidden lg:flex items-center gap-7 text-sm">${navItems}</nav>
                <div class="flex items-center gap-3">
                    <a href="devis.html" class="btn btn-primary hidden sm:inline-flex px-5 py-2.5 text-sm">Devis personnalisé</a>
                    <button id="burger" class="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-[var(--line)]" aria-label="Ouvrir le menu" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                </div>
            </div>
        </div>
        <div id="mobile-menu" class="mobile-menu lg:hidden px-5 pb-4">
            ${mobileItems}
            <a href="devis.html" class="btn btn-primary w-full mt-4 py-3">Devis personnalisé</a>
        </div>
    </header>`;

    /* -------- FOOTER -------- */
    const footerLinks = [...NAV, { href: 'faq.html', label: 'FAQ' }];
    const footerNav = footerLinks.map(i => `<a href="${i.href}" class="block py-1.5 text-[var(--muted)] hover:text-[var(--green)] transition">${i.label}</a>`).join('');

    const SERVICES = [
        { href: 'transformation.html', label: 'Transformation de conteneurs' },
        { href: 'location.html',       label: 'Location de conteneurs' },
        { href: 'amenagements.html',   label: 'Aménagements intérieurs' },
        { href: 'conception.html',     label: 'Conception et design' },
    ];
    const footerServices = SERVICES.map(i => `<a href="${i.href}" class="block py-1.5 text-[var(--muted)] hover:text-[var(--green)] transition">${i.label}</a>`).join('');

    const footer = `
    <footer class="border-t border-[var(--line)] bg-[var(--bg-alt)] mt-0">
        <div class="max-w-7xl mx-auto px-5 md:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div class="md:col-span-2">
                <a href="index.html" class="inline-flex items-center mb-4">${LOGO}</a>
                <p class="text-[var(--muted)] text-sm leading-relaxed max-w-md">DUMETAL — vente, location et aménagement sur mesure de conteneurs maritimes. Livraison par camion grue partout en Île-de-France, devis sous 24h.</p>
            </div>
            <div>
                <h4 class="font-bold mb-3 text-sm uppercase tracking-wide">Services</h4>
                <div class="text-sm">${footerServices}</div>
            </div>
            <div>
                <h4 class="font-bold mb-3 text-sm uppercase tracking-wide">Navigation</h4>
                <div class="text-sm">${footerNav}</div>
            </div>
            <div>
                <h4 class="font-bold mb-3 text-sm uppercase tracking-wide">Contact</h4>
                <a href="mailto:${CONTACT.email}" class="block py-1.5 text-[var(--muted)] hover:text-[var(--green)] transition text-sm">${CONTACT.email}</a>
                <a href="tel:${CONTACT.phoneTel}" class="block py-1.5 text-[var(--muted)] hover:text-[var(--green)] transition text-sm">${CONTACT.phoneDisplay}</a>
                <a href="devis.html" class="btn btn-primary mt-4 px-5 py-2.5 text-sm">Obtenir un devis</a>
            </div>
        </div>
        <div class="border-t border-[var(--line)]">
            <div class="max-w-7xl mx-auto px-5 md:px-6 py-5 text-xs text-[var(--muted)] flex flex-col sm:flex-row gap-2 justify-between">
                <span>© <span id="year"></span> DUMETAL — Containers aménagés. Tous droits réservés.</span>
                <span>Livraison en Île-de-France · Devis gratuit sous 24h</span>
            </div>
        </div>
    </footer>`;

    const headerMount = document.getElementById('site-header');
    const footerMount = document.getElementById('site-footer');
    if (headerMount) headerMount.outerHTML = header;
    if (footerMount) footerMount.outerHTML = footer;

    /* -------- Interactions -------- */
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobile-menu');
    if (burger && menu) {
        burger.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            burger.setAttribute('aria-expanded', String(open));
        });
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* -------- Données structurées (SEO local) --------
       LocalBusiness injecté sur toutes les pages. Pas d'aggregateRating ici :
       à n'ajouter qu'avec de vrais avis vérifiables (sous peine de pénalité Google). */
    const ld = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'DUMETAL — Containers aménagés',
        description: 'Vente, location et aménagement sur mesure de conteneurs maritimes. Livraison par camion grue en Île-de-France, devis sous 24h.',
        url: location.origin + '/',
        email: CONTACT.email,
        telephone: CONTACT.phoneTel,
        address: {
            '@type': 'PostalAddress',
            streetAddress: CONTACT.address,
            postalCode: CONTACT.postalCode,
            addressLocality: CONTACT.city,
            addressCountry: 'FR',
        },
        areaServed: CONTACT.region,
        openingHoursSpecification: [
            { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '17:00' },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '15:00' },
        ],
    };
    const ldScript = document.createElement('script');
    ldScript.type = 'application/ld+json';
    ldScript.textContent = JSON.stringify(ld);
    document.head.appendChild(ldScript);

    /* -------- Boutons de contact flottants (mobile + desktop) -------- */
    const fab = document.createElement('div');
    fab.className = 'fab';
    fab.innerHTML = `
        <a class="fab-btn fab-wa" href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.477-.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        </a>
        <a class="fab-btn fab-tel" href="tel:${CONTACT.phoneTel}" aria-label="Nous appeler">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </a>`;
    document.body.appendChild(fab);

    /* -------- Slider avant / après -------- */
    document.querySelectorAll('.ba').forEach(ba => {
        const before = ba.querySelector('.ba-before');
        const handle = ba.querySelector('.ba-handle');
        if (!before || !handle) return;
        // L'image "avant" doit faire la largeur complète du slider (et non celle du calque rogné)
        // pour rester à la même échelle que l'image "après".
        const beforeImg = before.querySelector('img');
        const sizeImg = function () { if (beforeImg) beforeImg.style.width = ba.getBoundingClientRect().width + 'px'; };
        sizeImg();
        window.addEventListener('resize', sizeImg);
        const setPos = (clientX) => {
            const rect = ba.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.max(2, Math.min(98, pct));
            before.style.width = pct + '%';
            handle.style.left = pct + '%';
        };
        let dragging = false;
        const start = () => { dragging = true; };
        const stop = () => { dragging = false; };
        const move = (e) => {
            if (!dragging) return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            setPos(x);
        };
        handle.addEventListener('mousedown', start);
        handle.addEventListener('touchstart', start, { passive: true });
        window.addEventListener('mouseup', stop);
        window.addEventListener('touchend', stop);
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: true });
        // Clic direct sur la zone pour positionner
        ba.addEventListener('click', (e) => { if (e.target.closest('.ba-handle')) return; setPos(e.clientX); });
    });
})();
