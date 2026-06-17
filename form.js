/* =============================================================
   Conteneurs Maritimes — Formulaire de devis multi-étapes
   -------------------------------------------------------------
   Envoi du lead vers un webhook (Make / Zapier / n8n / CRM…)
   + remontée de conversion GA4 via dataLayer.push.
   ============================================================= */

/* =============================================================
   CONFIG — À RENSEIGNER
   -------------------------------------------------------------
   Site statique : il n'y a pas de process.env côté navigateur.
   Renseignez l'URL de votre webhook ci-dessous. En production
   sur Vercel/Netlify, vous pouvez injecter la valeur de
   NEXT_PUBLIC_WEBHOOK_URL au build dans cette constante.
   ============================================================= */

const WEBHOOK_URL =
    (typeof window !== 'undefined' && window.NEXT_PUBLIC_WEBHOOK_URL) ||
    'VOTRE_URL_WEBHOOK';

// Adresse de secours si le webhook n'est pas configuré (ouvre le client mail).
const FALLBACK_EMAIL = 'contact@dumetal.fr';

/* =============================================================
   LOGIQUE DU FORMULAIRE
   ============================================================= */

(() => {
    const form = document.getElementById('quote-form');
    if (!form) return;

    const steps       = Array.from(form.querySelectorAll('.form-step'));
    const totalSteps  = 4; // L'étape 5 est la confirmation
    const prevBtn     = document.getElementById('prev-btn');
    const nextBtn     = document.getElementById('next-btn');
    const submitBtn   = document.getElementById('submit-btn');
    const submitText  = document.getElementById('submit-text');
    const progressBar = document.getElementById('progress-bar');
    const stepLabel   = document.getElementById('step-label');
    const stepCounter = document.getElementById('step-counter');
    const errorBox    = document.getElementById('form-error');
    const formNav     = document.getElementById('form-nav');

    const stepNames = {
        1: 'Votre besoin',
        2: 'Taille souhaitée',
        3: 'Livraison',
        4: 'Vos coordonnées',
    };

    let currentStep = 1;

    /* -------- Navigation entre les étapes -------- */
    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        const target = form.querySelector(`.form-step[data-step="${step}"]`);
        if (target) target.classList.add('active');

        const pct = (step / totalSteps) * 100;
        progressBar.style.width = `${Math.min(pct, 100)}%`;

        if (step <= totalSteps) {
            stepLabel.textContent   = `Étape ${step} sur ${totalSteps} — ${stepNames[step]}`;
            stepCounter.textContent = `${step} / ${totalSteps}`;
        } else {
            stepLabel.textContent   = 'Demande envoyée';
            stepCounter.textContent = '✓';
        }

        prevBtn.disabled = (step === 1);

        if (step === totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else if (step > totalSteps) {
            formNav.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }

        clearError();
        document.getElementById('devis').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* -------- Validation par étape -------- */
    function validateStep(step) {
        const stepEl = form.querySelector(`.form-step[data-step="${step}"]`);
        if (!stepEl) return true;

        let valid = true;
        let firstErrorMsg = '';
        const seenRadioGroups = new Set();

        const fields = stepEl.querySelectorAll('input, select, textarea');
        fields.forEach(f => {
            f.classList.remove('error');

            // Groupes radio (besoin, taille, statut)
            if (f.type === 'radio') {
                if (seenRadioGroups.has(f.name)) return;
                seenRadioGroups.add(f.name);
                const checked = form.querySelector(`input[name="${f.name}"]:checked`);
                if (f.hasAttribute('required') && !checked) {
                    valid = false;
                    if (!firstErrorMsg) firstErrorMsg = 'Merci de sélectionner une option.';
                }
                return;
            }

            if (f.type === 'checkbox') {
                if (f.hasAttribute('required') && !f.checked) {
                    valid = false;
                    if (!firstErrorMsg) firstErrorMsg = 'Merci d\'accepter le traitement de vos données (RGPD).';
                }
                return;
            }

            if (f.hasAttribute('required') && !f.value.trim()) {
                f.classList.add('error');
                valid = false;
                if (!firstErrorMsg) firstErrorMsg = 'Merci de remplir tous les champs obligatoires.';
            }

            if (f.type === 'email' && f.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
                f.classList.add('error');
                valid = false;
                if (!firstErrorMsg) firstErrorMsg = 'L\'adresse e-mail ne semble pas valide.';
            }

            if (f.type === 'tel' && f.value.trim() && f.value.replace(/\D/g, '').length < 8) {
                f.classList.add('error');
                valid = false;
                if (!firstErrorMsg) firstErrorMsg = 'Le numéro de téléphone semble incomplet.';
            }

            // Code postal français : 5 chiffres
            if (f.name === 'postal_code' && f.value.trim() && !/^\d{5}$/.test(f.value.trim())) {
                f.classList.add('error');
                valid = false;
                if (!firstErrorMsg) firstErrorMsg = 'Le code postal doit comporter 5 chiffres.';
            }
        });

        if (!valid) showError(firstErrorMsg);
        return valid;
    }

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
    }

    function clearError() {
        errorBox.classList.add('hidden');
        errorBox.textContent = '';
    }

    /* -------- Boutons -------- */
    nextBtn.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Sélection d'une carte radio → avance automatiquement (étapes 1 et 2)
    form.querySelectorAll('.choice-card input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            clearError();
            if ((currentStep === 1 || currentStep === 2) && radio.checked) {
                setTimeout(() => {
                    if (currentStep < totalSteps) { currentStep++; showStep(currentStep); }
                }, 220);
            }
        });
    });

    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && currentStep < totalSteps) {
            e.preventDefault();
            nextBtn.click();
        }
    });

    /* -------- Soumission -------- */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        submitBtn.disabled = true;
        submitText.textContent = 'Envoi en cours…';

        const data = collectFormData();

        try {
            await sendToWebhook(data);

            // Remontée de conversion GA4
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'generate_lead_container',
                lead_need_type: data.need_type,
                lead_size: data.size,
                lead_status: data.status,
                lead_postal_code: data.postal_code,
            });

            currentStep = totalSteps + 1;
            showStep(currentStep);
        } catch (err) {
            console.error('Erreur d\'envoi :', err);
            showError('Une erreur est survenue. Merci de réessayer ou de nous contacter directement à ' + FALLBACK_EMAIL + '.');
            submitBtn.disabled = false;
            submitText.textContent = 'Recevoir mon devis';
        }
    });

    /* -------- Collecte des données -------- */
    function collectFormData() {
        const fd = new FormData(form);
        const data = {};
        fd.forEach((value, key) => { data[key] = value; });

        data.source       = 'site-conteneurs-maritimes';
        data.submitted_at = new Date().toISOString();
        data.page_url     = window.location.href;
        return data;
    }

    /* -------- Envoi vers le webhook -------- */
    async function sendToWebhook(data) {
        if (!WEBHOOK_URL || WEBHOOK_URL === 'VOTRE_URL_WEBHOOK') {
            console.warn('Webhook non configuré — bascule vers mailto.');
            return sendViaMailto(data);
        }

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Webhook responded ' + response.status);
        }
    }

    /* -------- Fallback : mailto -------- */
    function sendViaMailto(data) {
        const subject = encodeURIComponent(`Demande de devis conteneur — ${data.name || 'Client'}`);
        const body = encodeURIComponent(
`NOUVELLE DEMANDE DE DEVIS — CONTENEURS MARITIMES

Besoin        : ${data.need_type || '-'}
Taille        : ${data.size || '-'}

Code postal   : ${data.postal_code || '-'}
Ville         : ${data.city || '-'}
Accès terrain : ${data.access || '-'}
Type terrain  : ${data.ground_type || '-'}

Statut        : ${data.status || '-'}
Nom / Société : ${data.name || '-'}
Email         : ${data.email || '-'}
Téléphone     : ${data.phone || '-'}

Précisions    : ${data.message || '-'}`
        );
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    }

    /* -------- Init -------- */
    showStep(currentStep);
})();
