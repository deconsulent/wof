/**
 * Wall of Fame - Unified Bilingual Localization Engine (EN 🇬🇧 / LV 🇱🇻)
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.i18n = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    const DICTIONARIES = {
        en: {
            "app_title": "Wall of Fame",
            "spatial_cms": "Spatial CMS",
            "active_screens": "Active Screens",
            "create_new_screen": "+ Create New Screen",
            "enter_screen_id_prompt": "Enter a unique ID for the new screen (e.g. 'library'):",
            "invalid_id_alert": "Please enter a valid ID with letters or numbers.",
            "id_exists_alert": "A screen with ID '{id}' already exists!",
            "select_screen": "Select a screen",
            "location_id": "LOCATION ID:",
            "test_view": "Test View ↗",
            "save_changes": "Save Changes",
            "saving": "Saving...",
            "saved_successfully": "Saved successfully!",
            "save_failed": "Failed to save: {error}",
            "delete_screen": "Delete",
            "confirm_delete_screen": "Are you sure you want to delete this screen?",
            "network_error": "Network error: {error}",
            
            "internal_name": "INTERNAL NAME",
            "display_template": "DISPLAY TEMPLATE / AR ENGINE",
            "latitude": "LATITUDE (GPS)",
            "longitude": "LONGITUDE (GPS)",
            "display_title_en": "DISPLAY TITLE (EN)",
            "display_title_lv": "DISPLAY TITLE (LV)",
            "display_subtitle_en": "DISPLAY SUBTITLE (EN)",
            "display_subtitle_lv": "DISPLAY SUBTITLE (LV)",
            "description_en": "DESCRIPTION (EN)",
            "description_lv": "DESCRIPTION (LV)",
            "auto_translate_hint": "Auto-translates from EN if left empty",

            "template_df_title": "Hierarchy Tree Data (Design Factory)",
            "add_person": "+ Add Person",
            "edit": "Edit",
            "delete": "Delete",
            "confirm_delete_person": "Delete this person from the tree?",
            
            "modal_df_title": "Hierarchy Inductee Profile",
            "full_name": "FULL NAME",
            "photo_upload": "PHOTO UPLOAD",
            "role_en": "ROLE / TITLE (EN)",
            "role_lv": "ROLE / TITLE (LV)",
            "hierarchy_level": "HIERARCHY LEVEL / GROUP",
            "level_root": "Root (e.g. Head / Director)",
            "level_lead": "Lead (e.g. Team Lead / Manager)",
            "level_staff": "Staff / Core Member",
            "superpower_en": "SUPERPOWER / BIO (EN)",
            "superpower_lv": "SUPERPOWER / BIO (LV)",
            "current_project_en": "CURRENT PROJECT (EN)",
            "current_project_lv": "CURRENT PROJECT (LV)",
            "skills_en": "SKILLS (EN - comma separated)",
            "skills_lv": "SKILLS (LV - comma separated)",
            "certifications_en": "CERTIFICATIONS (EN - comma separated)",
            "certifications_lv": "CERTIFICATIONS (LV - comma separated)",
            "accent_color": "ACCENT COLOR",
            "cancel": "Cancel",
            "save_inductee": "Save Inductee",

            "template_swup_title": "Team Profile Projection Data (SWUP)",
            "team_name_en": "TEAM / SQUAD NAME (EN)",
            "team_name_lv": "TEAM / SQUAD NAME (LV)",
            "team_subhead_en": "DESTINATION / SUBHEAD (EN)",
            "team_subhead_lv": "DESTINATION / SUBHEAD (LV)",
            "team_hero_photo": "TEAM HERO PHOTO",
            "team_members": "Team Members",
            "add_member": "+ Add Member",
            "confirm_delete_member": "Delete this member from the team?",

            "modal_swup_title": "SWUP Team Member Profile",
            "specialty_en": "SPECIALTY / STREAM (EN)",
            "specialty_lv": "SPECIALTY / STREAM (LV)",
            "project_status_en": "PROJECT / STATUS (EN)",
            "project_status_lv": "PROJECT / STATUS (LV)",
            "save_member": "Save Member",

            "ar_protocol": "AR / SPATIAL PROTOCOL",
            "open_stage_title": "Open the stage\nin your space.",
            "permission_hint": "Enable your camera to place the holographic projection directly in your room.",
            "enable_camera": "Enable camera ↗",
            "camera_blocked": "Camera access was denied or is unavailable on this device. You can explore the spatial directory with touch/mouse controls.",
            "view_3d_mode": "Continue in 3D Mode ↗",
            "tracking_online": "TRACKING ONLINE",
            "calibrating": "CALIBRATING...",
            "recenter": "Recenter View",
            "drag_to_explore": "Drag to look around space",
            "align_reticle": "Align reticle with any member\nto project their full hologram profile",
            "looking_for_profiles": "LOOKING FOR PROFILES...",
            "profile_locked": "PROFILE LOCKED",
            "live_feed": "LIVE AR FEED",
            "members_detected": "{count} PROFILES DETECTED",
            "language": "Language",
            "english": "English",
            "latvian": "Latvian"
        },
        lv: {
            "app_title": "Goda Siena",
            "spatial_cms": "Telpiskā TVS",
            "active_screens": "Aktīvie Ekrāni",
            "create_new_screen": "+ Izveidot Jaunu Ekrānu",
            "enter_screen_id_prompt": "Ievadiet unikālu ekrāna identifikatoru (piem., 'biblioteka'):",
            "invalid_id_alert": "Lūdzu, ievadiet derīgu ID ar burtiem vai cipariem.",
            "id_exists_alert": "Ekrāns ar ID '{id}' jau eksistē!",
            "select_screen": "Izvēlieties ekrānu",
            "location_id": "LOKĀCIJAS ID:",
            "test_view": "Testa Skats ↗",
            "save_changes": "Saglabāt Izmaiņas",
            "saving": "Saglabā...",
            "saved_successfully": "Veiksmīgi saglabāts!",
            "save_failed": "Neizdevās saglabāt: {error}",
            "delete_screen": "Dzēst",
            "confirm_delete_screen": "Vai tiešām vēlaties dzēst šo ekrānu?",
            "network_error": "Tīkla kļūda: {error}",
            
            "internal_name": "IEKŠĒJAIS NOSAUKUMS",
            "display_template": "DISPLEJA VEIDNE / AR DZINĒJS",
            "latitude": "PLATUMS (GPS)",
            "longitude": "GARUMS (GPS)",
            "display_title_en": "DISPLEJA VIRSRAKSTS (EN)",
            "display_title_lv": "DISPLEJA VIRSRAKSTS (LV)",
            "display_subtitle_en": "DISPLEJA ZEMVIRSRAKSTS (EN)",
            "display_subtitle_lv": "DISPLEJA ZEMVIRSRAKSTS (LV)",
            "description_en": "APRAKSTS (EN)",
            "description_lv": "APRAKSTS (LV)",
            "auto_translate_hint": "Automātiski tulko no EN, ja atstāts tukšs",

            "template_df_title": "Hierarhijas Koka Dati (Design Factory)",
            "add_person": "+ Pievienot Personu",
            "edit": "Rediģēt",
            "delete": "Dzēst",
            "confirm_delete_person": "Dzēst šo personu no hierarhijas koka?",
            
            "modal_df_title": "Hierarhijas Dalībnieka Profils",
            "full_name": "VĀRDS UZVĀRDS",
            "photo_upload": "FOTO AUGŠUPIELĀDE",
            "role_en": "AMATS / LOMA (EN)",
            "role_lv": "AMATS / LOMA (LV)",
            "hierarchy_level": "HIERARHIJAS LĪMENIS / GRUPA",
            "level_root": "Sakne (piem., Vadītājs / Direktors)",
            "level_lead": "Līderis (piem., Komandas vadītājs / Menedžeris)",
            "level_staff": "Dalībnieks / Pamatsastāvs",
            "superpower_en": "SUPERSKILS / BIO (EN)",
            "superpower_lv": "SUPERSKILS / BIO (LV)",
            "current_project_en": "PAŠREIZĒJAIS PROJEKTS (EN)",
            "current_project_lv": "PAŠREIZĒJAIS PROJEKTS (LV)",
            "skills_en": "PRASMES (EN - atdalītas ar komatu)",
            "skills_lv": "PRASMES (LV - atdalītas ar komatu)",
            "certifications_en": "SERTIFIKĀTI (EN - atdalīti ar komatu)",
            "certifications_lv": "SERTIFIKĀTI (LV - atdalīti ar komatu)",
            "accent_color": "AKCENTA KRĀSA",
            "cancel": "Atcelt",
            "save_inductee": "Saglabāt Dalībnieku",

            "template_swup_title": "Komandas Profila Projekcijas Dati (SWUP)",
            "team_name_en": "KOMANDAS NOSAUKUMS (EN)",
            "team_name_lv": "KOMANDAS NOSAUKUMS (LV)",
            "team_subhead_en": "MĒRĶIS / ZEMVIRSRAKSTS (EN)",
            "team_subhead_lv": "MĒRĶIS / ZEMVIRSRAKSTS (LV)",
            "team_hero_photo": "KOMANDAS FOTO",
            "team_members": "Komandas Dalībnieki",
            "add_member": "+ Pievienot Dalībnieku",
            "confirm_delete_member": "Dzēst šo dalībnieku no komandas?",

            "modal_swup_title": "SWUP Komandas Dalībnieka Profils",
            "specialty_en": "SPECIALITĀTE / JOMA (EN)",
            "specialty_lv": "SPECIALITĀTE / JOMA (LV)",
            "project_status_en": "PROJEKTS / STATUSS (EN)",
            "project_status_lv": "PROJEKTS / STATUSS (LV)",
            "save_member": "Saglabāt Dalībnieku",

            "ar_protocol": "AR / TELPISKAIS PROTOKOLS",
            "open_stage_title": "Atveriet skatuvi\nsavā telpā.",
            "permission_hint": "Iespējojiet kameru, lai novietotu hologrāfisko projekciju tieši savā telpā.",
            "enable_camera": "Iespējot kameru ↗",
            "camera_blocked": "Kameras piekļuve tika liegta vai nav pieejama šajā ierīcē. Varat izpētīt telpisko sarakstu ar skārienvadību/peli.",
            "view_3d_mode": "Turpināt 3D Režīmā ↗",
            "tracking_online": "IZSEKOŠANA AKTĪVA",
            "calibrating": "KALIBRĒ...",
            "recenter": "Centrēt Skatu",
            "drag_to_explore": "Velciet, lai apskatītu telpu",
            "align_reticle": "Pavērsiet mērķi pret jebkuru dalībnieku,\nlai projicētu pilnu hologrāfisko profilu",
            "looking_for_profiles": "MEKLĒ PROFILUS...",
            "profile_locked": "PROFILS FIKSĒTS",
            "live_feed": "TIEŠRAIDES AR PLŪSMA",
            "members_detected": "NOTEIKTI {count} PROFILI",
            "language": "Valoda",
            "english": "Angļu",
            "latvian": "Latviešu"
        }
    };

    let currentLang = 'en';
    const listeners = new Set();

    // Initialize from storage or browser language
    try {
        const stored = localStorage.getItem('app_language');
        if (stored === 'en' || stored === 'lv') {
            currentLang = stored;
        } else if (typeof navigator !== 'undefined' && navigator.language && navigator.language.slice(0, 2) === 'lv') {
            currentLang = 'lv';
        }
    } catch (e) {
        console.warn('[i18n] Storage access unavailable');
    }

    function getLanguage() {
        return currentLang;
    }

    function setLanguage(lang) {
        if (lang !== 'en' && lang !== 'lv') return;
        currentLang = lang;
        try {
            localStorage.setItem('app_language', lang);
            if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.lang = lang;
            }
        } catch (e) {}

        // Update all DOM elements with data-i18n attributes
        updateDOM();

        // Update active class on switchers
        if (typeof document !== 'undefined') {
            document.querySelectorAll('.lang-switcher-btn').forEach(btn => {
                const btnLang = btn.getAttribute('data-lang');
                if (btnLang === lang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Notify custom subscribers
        listeners.forEach(fn => {
            try { fn(currentLang); } catch (err) { console.error('[i18n] listener err:', err); }
        });
    }

    function subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    }

    function t(key, params) {
        let text = DICTIONARIES[currentLang]?.[key] || DICTIONARIES.en?.[key] || key;
        if (params && typeof params === 'object') {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
            });
        }
        return text;
    }

    function getLocalized(data, field) {
        if (!data) return '';
        if (currentLang === 'lv') {
            const lvVal = data[`${field}_lv`] ?? data[`${field}Lv`];
            if (Array.isArray(lvVal) && lvVal.length > 0) return lvVal;
            if (typeof lvVal === 'string' && lvVal.trim()) return lvVal;
        }
        return data[field] || '';
    }

    function updateDOM(rootEl) {
        if (typeof document === 'undefined') return;
        const root = rootEl || document;

        // Elements with data-i18n="key"
        root.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = t(key);
            }
        });

        // Placeholders with data-i18n-placeholder="key"
        root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                el.placeholder = t(key);
            }
        });

        // Titles with data-i18n-title="key"
        root.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) {
                el.title = t(key);
            }
        });
    }

    function createSwitcherHTML(customClass = '') {
        const isEn = currentLang === 'en';
        const isLv = currentLang === 'lv';
        return `
            <div class="lang-switcher ${customClass}" role="group" aria-label="Language Selector" style="pointer-events: auto; z-index: 9999;">
                <button type="button" class="lang-switcher-btn ${isEn ? 'active' : ''}" data-lang="en" onclick="event.stopPropagation(); window.i18n.setLanguage('en')" style="pointer-events: auto; cursor: pointer;">
                    GB EN
                </button>
                <button type="button" class="lang-switcher-btn ${isLv ? 'active' : ''}" data-lang="lv" onclick="event.stopPropagation(); window.i18n.setLanguage('lv')" style="pointer-events: auto; cursor: pointer;">
                    LV LV
                </button>
            </div>
        `;
    }

    // Capture-phase event delegation to prevent 3D drag capture from intercepting language clicks
    if (typeof document !== 'undefined') {
        const handleSwitcherAction = (e) => {
            const btn = e.target.closest && e.target.closest('.lang-switcher-btn');
            if (btn) {
                e.stopPropagation();
                if (e.type === 'click') {
                    const targetLang = btn.getAttribute('data-lang');
                    if (targetLang && (targetLang === 'en' || targetLang === 'lv')) {
                        setLanguage(targetLang);
                    }
                }
            }
        };

        document.addEventListener('pointerdown', handleSwitcherAction, true);
        document.addEventListener('mousedown', handleSwitcherAction, true);
        document.addEventListener('touchstart', handleSwitcherAction, true);
        document.addEventListener('click', handleSwitcherAction, true);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.documentElement.lang = currentLang;
                updateDOM();
            });
        } else {
            document.documentElement.lang = currentLang;
            updateDOM();
        }
    }

    const instance = {
        getLanguage,
        setLanguage,
        t,
        getLocalized,
        subscribe,
        updateDOM,
        createSwitcherHTML,
        dictionaries: DICTIONARIES
    };

    if (typeof window !== 'undefined') {
        window.i18n = instance;
    }

    return instance;
}));
