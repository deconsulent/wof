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
            
            // Sidebar Navigation
            "nav_main": "MAIN",
            "nav_dashboard": "Dashboard",
            "nav_screens": "Screens",
            "nav_add_screen": "Add Screen",
            "nav_tools": "TOOLS",
            "nav_templates": "Templates",
            "nav_qr": "QR Codes",
            "user_role_admin": "ADMINISTRATOR",
            "sign_out": "Sign Out",

            // Dashboard
            "dash_title": "Dashboard",
            "dash_subtitle": "Overview of your Wall of Fame deployment",
            "metric_active_screens": "Active Screens",
            "metric_total_people": "Total People",
            "metric_ar_templates": "AR Templates",
            "metric_system_status": "System Status",
            "status_online": "Online",
            "your_screens": "Your Screens",
            "btn_new_screen": "+ New Screen",
            "no_screens_yet": "No screens yet",
            "no_screens_p": "Create your first AR Wall of Fame screen to get started.",
            "btn_create_first_screen": "+ Create First Screen",
            "person": "person",
            "people": "people",
            "btn_edit": "✎ Edit",
            "btn_live_view": "↗ Live View",
            "btn_qr": "📱 QR",

            // Screens Manager
            "screens_title": "Manage Screens",
            "screens_subtitle": "All registered AR screens in the system",
            "search_screens_placeholder": "Search screens...",
            "no_screens_found": "No screens found",
            "no_screens_found_p": "Create your first screen to begin.",
            "table_screen": "Screen",
            "table_template": "Template",
            "table_people": "People",
            "table_coords": "GPS Coordinates",
            "table_actions": "Actions",

            // Templates Library
            "templates_title": "AR Templates Library",
            "templates_subtitle": "Available Spatial AR display engines for Wall of Fame screens",
            "tmpl_tree_title": "Hierarchy Tree",
            "tmpl_tree_version": "V4 · DesignFactory Engine",
            "tmpl_tree_desc": "Spatial 3D orbital tree visualization. Arranges team members in concentric tiers — Root (Director/Head), Lead (Team Leads), and Staff (Core Members) — orbiting a central anchor. Each inductee is represented by a floating card with photo, role, and accent color. Supports virtual card deep links via double-tap.",
            "tag_3d_orbit": "3D Orbit Layout",
            "tag_hierarchy_tiers": "Hierarchy Tiers",
            "tag_draggable": "Draggable",
            "tag_virtual_cards": "Virtual Cards",
            "tag_gps_anchored": "GPS Anchored",
            "tag_horizontal_carousel": "Horizontal Carousel",
            "tag_hero_stage": "Hero Stage",
            "tag_skills_radar": "Skills Radar",
            "tag_swipeable": "Swipeable",
            "tag_custom_crops": "Custom Crops",
            "tmpl_swup_title": "Team Profile Showcase",
            "tmpl_swup_version": "V5 · SWUP Engine",
            "tmpl_swup_desc": "Horizontal kinetic carousel with interactive hero stage. Features team members in a swipeable horizontal strip with individual profile cards showcasing specialty, project status, skills radar, and custom crop positioning. Includes team-level hero photo and destination branding.",
            "btn_create_with_template": "Create Screen with This Template",

            // QR Codes
            "qr_title": "QR Code Generator",
            "qr_subtitle": "Generate scannable QR codes for your AR Wall of Fame screens",
            "qr_select_screen": "Select a Screen",
            "qr_placeholder_text": "Select a screen from the list to generate its QR code",
            "qr_download_btn": "Download QR Code (.png)",
            "qr_open_ar_preview": "Live AR Preview ↗",

            // Editor
            "breadcrumb_screens": "Screens",
            "breadcrumb_editor": "Editor",
            "btn_auto_translate": "✨ Auto-Translate LV",
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
            "no_inductees_yet": "No inductees added to this tree yet.",
            "no_members_yet": "No team members added yet.",

            "template_df_title": "Hierarchy Tree Data (Design Factory)",
            "add_person": "+ Add Person",
            "add_inductee": "+ Add Inductee",
            "edit": "Edit",
            "delete": "Delete",
            "confirm_delete_person": "Delete this person from the tree?",
            
            "modal_df_title": "Hierarchy Inductee Profile",
            "full_name": "FULL NAME",
            "photo_upload": "PHOTO",
            "click_to_upload": "Click box to upload photo",
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
            "virtual_card_url": "VIRTUAL CARD URL (Redirect on Double Tap)",
            "virtual_card_hint": "Defaults to https://df-virtual-cards.vercel.app/(firstname-lastname)",
            "crop_label": "CROP (CSS object-position)",
            "cancel": "Cancel",
            "save_inductee": "Save Inductee",
            "translate_lv_btn": "✨ Translate LV",

            "template_swup_title": "SWUP Team Profile Data",
            "team_name_en": "TEAM NAME (EN)",
            "team_name_lv": "TEAM NAME (LV)",
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

            // Create Screen Modal
            "modal_new_screen_title": "Create New Screen",
            "label_screen_name": "INTERNAL NAME / TITLE (EN)",
            "label_screen_id": "UNIQUE SCREEN ID",
            "hint_screen_id": "lowercase, hyphens only",
            "btn_create_screen_submit": "Create Screen →",

            // Login Screen
            "login_title": "Wall of Fame",
            "login_subtitle": "SPATIAL CMS · ADMIN PORTAL",
            "login_username": "Username",
            "login_password": "Password",
            "login_btn": "Sign In",
            "login_error_invalid": "Invalid username or password",

            // Footer
            "footer_copyright": "© 2026 Riga Technical University · RTU Science & Innovation Centre",

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
            
            // Sidebar Navigation
            "nav_main": "GALVENAIS",
            "nav_dashboard": "Pārskats",
            "nav_screens": "Ekrāni",
            "nav_add_screen": "Pievienot Ekrānu",
            "nav_tools": "RĪKI",
            "nav_templates": "Veidnes",
            "nav_qr": "QR Kodi",
            "user_role_admin": "ADMINISTRATORS",
            "sign_out": "Iziet",

            // Dashboard
            "dash_title": "Pārskats",
            "dash_subtitle": "Goda Sienas sistēmas un ekrānu pārskats",
            "metric_active_screens": "Aktīvie Ekrāni",
            "metric_total_people": "Kopā Dalībnieki",
            "metric_ar_templates": "AR Veidnes",
            "metric_system_status": "Sistēmas Statuss",
            "status_online": "Tiešsaistē",
            "your_screens": "Jūsu Ekrāni",
            "btn_new_screen": "+ Jauns Ekrāns",
            "no_screens_yet": "Pagaidām nav neviena ekrāna",
            "no_screens_p": "Izveidojiet savu pirmo AR Goda Sienas ekrānu, lai sāktu darbu.",
            "btn_create_first_screen": "+ Izveidot Pirmo Ekrānu",
            "person": "persona",
            "people": "dalībnieki",
            "btn_edit": "✎ Rediģēt",
            "btn_live_view": "↗ Tiešskats",
            "btn_qr": "📱 QR",

            // Screens Manager
            "screens_title": "Pārvaldīt Ekrānus",
            "screens_subtitle": "Visi sistēmā reģistrētie AR ekrāni",
            "search_screens_placeholder": "Meklēt ekrānus...",
            "no_screens_found": "Ekrāni nav atrasti",
            "no_screens_found_p": "Izveidojiet savu pirmo ekrānu, lai sāktu.",
            "table_screen": "Ekrāns",
            "table_template": "Veidne",
            "table_people": "Dalībnieki",
            "table_coords": "GPS Koordinātas",
            "table_actions": "Darbības",

            // Templates Library
            "templates_title": "AR Veidņu Bibliotēka",
            "templates_subtitle": "Pieejamie telpiskie AR displeja dzinēji Goda Sienas ekrāniem",
            "tmpl_tree_title": "Hierarhijas Koks",
            "tmpl_tree_version": "V4 · DesignFactory Dzinējs",
            "tmpl_tree_desc": "Telpiskā 3D orbitālā koka vizualizācija. Izvieto komandas dalībniekus koncentriskos līmeņos — Sakne (Direktors/Vadītājs), Līderis (Komandas vadītājs) un Dalībnieks (Pamatsastāvs) — ap centrālo enkuru. Katrs dalībnieks tiek attēlots ar peldošu kartīti ar foto, lomu un akcenta krāsu. Atbalsta virtuālo vizītkaršu saites ar dubultskārienu.",
            "tag_3d_orbit": "3D Orbītas Izkārtojums",
            "tag_hierarchy_tiers": "Hierarhijas Līmeņi",
            "tag_draggable": "Pārvietojams",
            "tag_virtual_cards": "Virtuālās Vizītkartes",
            "tag_gps_anchored": "GPS Piesaiste",
            "tag_horizontal_carousel": "Horizontāls Karuselis",
            "tag_hero_stage": "Galvenā Skatuve",
            "tag_skills_radar": "Prasmju Radars",
            "tag_swipeable": "Pārvelkams",
            "tag_custom_crops": "Pielāgots Foto Apgriezums",
            "tmpl_swup_title": "Komandas Profilu Skats",
            "tmpl_swup_version": "V5 · SWUP Dzinējs",
            "tmpl_swup_desc": "Horizontāls kinētisks karuselis ar interaktīvu galveno skatuvi. Parāda komandas dalībniekus pārvelkamā horizontālā joslā ar individuālām profila kartītēm, kas attēlo specialitāti, projekta statusu, prasmju radaru un pielāgotu foto pozicionēšanu. Ietver komandas galveno fotoattēlu un mērķa zīmolvedību.",
            "btn_create_with_template": "Izveidot Ekrānu ar Šo Veidni",

            // QR Codes
            "qr_title": "QR Kodu Ģenerators",
            "qr_subtitle": "Ģenerējiet skenējamus QR kodus saviem AR Goda Sienas ekrāniem",
            "qr_select_screen": "Izvēlieties Ekrānu",
            "qr_placeholder_text": "Izvēlieties ekrānu no saraksta, lai ģenerētu tā QR kodu",
            "qr_download_btn": "Lejupielādēt QR Kodu (.png)",
            "qr_open_ar_preview": "Atvērt AR Priekšskatījumu ↗",

            // Editor
            "breadcrumb_screens": "Ekrāni",
            "breadcrumb_editor": "Redaktors",
            "btn_auto_translate": "✨ Auto-Tulkot uz LV",
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
            "no_inductees_yet": "Šajā hierarhijas kokā pagaidām nav pievienots neviens dalībnieks.",
            "no_members_yet": "Pagaidām nav pievienots neviens komandas dalībnieks.",

            "template_df_title": "Hierarhijas Koka Dati (Design Factory)",
            "add_person": "+ Pievienot Personu",
            "add_inductee": "+ Pievienot Dalībnieku",
            "edit": "Rediģēt",
            "delete": "Dzēst",
            "confirm_delete_person": "Dzēst šo personu no hierarhijas koka?",
            
            "modal_df_title": "Hierarhijas Dalībnieka Profils",
            "full_name": "VĀRDS UZVĀRDS",
            "photo_upload": "FOTO",
            "click_to_upload": "Noklikšķiniet, lai augšupielādētu foto",
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
            "virtual_card_url": "VIRTUĀLĀS VIZĪTKARTES SAITE (Dubultskāriens)",
            "virtual_card_hint": "Noklusējums: https://df-virtual-cards.vercel.app/(vards-uzvards)",
            "crop_label": "APGRIEZUMS (CSS object-position)",
            "cancel": "Atcelt",
            "save_inductee": "Saglabāt Dalībnieku",
            "translate_lv_btn": "✨ Tulkot uz LV",

            "template_swup_title": "SWUP Komandas Profila Dati",
            "team_name_en": "KOMANDAS NOSAUKUMS (EN)",
            "team_name_lv": "KOMANDAS NOSAUKUMS (LV)",
            "team_subhead_en": "MĒRĶIS / ZEMVIRSRAKSTS (EN)",
            "team_subhead_lv": "MĒRĶIS / ZEMVIRSRAKSTS (LV)",
            "team_hero_photo": "KOMANDAS GALVENAIS FOTO",
            "team_members": "Komandas Dalībnieki",
            "add_member": "+ Pievienot Dalībnieku",
            "confirm_delete_member": "Dzēst šo dalībnieku no komandas?",

            "modal_swup_title": "SWUP Komandas Dalībnieka Profils",
            "specialty_en": "SPECIALITĀTE / JOMA (EN)",
            "specialty_lv": "SPECIALITĀTE / JOMA (LV)",
            "project_status_en": "PROJEKTS / STATUSS (EN)",
            "project_status_lv": "PROJEKTS / STATUSS (LV)",
            "save_member": "Saglabāt Dalībnieku",

            // Create Screen Modal
            "modal_new_screen_title": "Izveidot Jaunu Ekrānu",
            "label_screen_name": "IEKŠĒJAIS NOSAUKUMS / VIRSRAKSTS (EN)",
            "label_screen_id": "UNIKĀLAIS EKRĀNA ID",
            "hint_screen_id": "mazie burti, tikai defises",
            "btn_create_screen_submit": "Izveidot Ekrānu →",

            // Login Screen
            "login_title": "Goda Siena",
            "login_subtitle": "TELPISKĀ TVS · ADMINA PORTĀLS",
            "login_username": "Lietotājvārds",
            "login_password": "Parole",
            "login_btn": "Pieslēgties",
            "login_error_invalid": "Nederīgs lietotājvārds vai parole",

            // Footer
            "footer_copyright": "© 2026 Rīgas Tehniskā universitāte · RTU Zinātnes un inovāciju centrs",

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
                    🇬🇧 EN
                </button>
                <button type="button" class="lang-switcher-btn ${isLv ? 'active' : ''}" data-lang="lv" onclick="event.stopPropagation(); window.i18n.setLanguage('lv')" style="pointer-events: auto; cursor: pointer;">
                    🇱🇻 LV
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
