/**
 * Dual-Engine Backend Translation Pipeline (Google + MyMemory + Dictionary Fallback)
 */

const COMMON_TERMS = {
    'head of rtu design factory & innovation': 'RTU Dizaina fabrikas un inovāciju vadītāja',
    'head of design factory': 'Dizaina fabrikas vadītājs',
    'director': 'Direktors',
    'lead': 'Vadītājs',
    'manager': 'Menedžeris',
    'project manager': 'Projektu vadītājs',
    'staff': 'Darbinieks',
    'core member': 'Pamatsastāva dalībnieks',
    'software engineer': 'Programmatūras inženieris',
    'hardware engineer': 'Aparatūras inženieris',
    'team lead': 'Komandas vadītājs',
    'researcher': 'Pētnieks'
};

async function queryGoogleTranslate(text, from = 'en', to = 'lv') {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    if (!response.ok) throw new Error(`Google Translate HTTP ${response.status}`);
    const result = await response.json();
    if (Array.isArray(result) && Array.isArray(result[0])) {
        const translated = result[0].map(item => item[0]).filter(Boolean).join('');
        if (translated) return translated;
    }
    throw new Error('Invalid Google Translate payload format');
}

async function queryMyMemory(text, from = 'en', to = 'lv') {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(from)}|${encodeURIComponent(to)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`MyMemory HTTP ${response.status}`);
    const json = await response.json();
    if (json && json.responseData && json.responseData.translatedText) {
        // Filter out automatic error echoes
        const translated = json.responseData.translatedText;
        if (!translated.startsWith('MYMEMORY WARNING')) {
            return translated;
        }
    }
    throw new Error('Invalid MyMemory response');
}

async function translateText(text, from = 'en', to = 'lv') {
    if (!text || typeof text !== 'string' || !text.trim()) {
        return '';
    }
    if (from === to) return text;

    const clean = text.trim();
    const lower = clean.toLowerCase();

    // 1. Direct dictionary match
    if (from === 'en' && to === 'lv' && COMMON_TERMS[lower]) {
        return COMMON_TERMS[lower];
    }

    // 2. Try Google Translate
    try {
        const res = await queryGoogleTranslate(clean, from, to);
        if (res && res.trim()) return res;
    } catch (e1) {
        // Fall through to MyMemory
    }

    // 3. Try MyMemory
    try {
        const res = await queryMyMemory(clean, from, to);
        if (res && res.trim()) return res;
    } catch (e2) {
        // Fall through to original
    }

    return text;
}

async function translateArray(arr, from = 'en', to = 'lv') {
    if (!Array.isArray(arr) || arr.length === 0) {
        return [];
    }

    const validItems = arr.map(i => (typeof i === 'string' ? i.trim() : '')).filter(Boolean);
    if (validItems.length === 0) return [];
    if (from === to) return validItems;

    const DELIMITER = ' ||| ';
    const combinedText = validItems.join(DELIMITER);

    try {
        const translatedCombined = await translateText(combinedText, from, to);
        const translatedItems = translatedCombined.split(/\s*\|\|\|\s*/).map(s => s.trim()).filter(Boolean);
        
        if (translatedItems.length === validItems.length) {
            return translatedItems;
        }
        
        // Fallback: translate individual items
        return await Promise.all(validItems.map(item => translateText(item, from, to)));
    } catch (error) {
        console.error('[Translate] translateArray fallback:', error.message);
        return validItems;
    }
}

async function autoTranslateScreenPayload(payload) {
    if (!payload || typeof payload !== 'object') return payload;

    const cloned = JSON.parse(JSON.stringify(payload));

    // 1. Top level location fields (Bi-directional)
    if (cloned.title && (!cloned.title_lv || !cloned.title_lv.trim())) {
        cloned.title_lv = await translateText(cloned.title, 'en', 'lv');
    } else if (cloned.title_lv && (!cloned.title || !cloned.title.trim())) {
        cloned.title = await translateText(cloned.title_lv, 'lv', 'en');
        if (!cloned.name || !cloned.name.trim()) cloned.name = cloned.title;
    }

    if (cloned.subtitle && (!cloned.subtitle_lv || !cloned.subtitle_lv.trim())) {
        cloned.subtitle_lv = await translateText(cloned.subtitle, 'en', 'lv');
    } else if (cloned.subtitle_lv && (!cloned.subtitle || !cloned.subtitle.trim())) {
        cloned.subtitle = await translateText(cloned.subtitle_lv, 'lv', 'en');
    }

    if (cloned.description && (!cloned.description_lv || !cloned.description_lv.trim())) {
        cloned.description_lv = await translateText(cloned.description, 'en', 'lv');
    } else if (cloned.description_lv && (!cloned.description || !cloned.description.trim())) {
        cloned.description = await translateText(cloned.description_lv, 'lv', 'en');
    }

    // 2. Nested data (Bi-directional)
    if (cloned.data && typeof cloned.data === 'object') {
        // V4: Inductees
        if (Array.isArray(cloned.data.inductees)) {
            for (const person of cloned.data.inductees) {
                if (person.role && (!person.role_lv || !person.role_lv.trim())) {
                    person.role_lv = await translateText(person.role, 'en', 'lv');
                } else if (person.role_lv && (!person.role || !person.role.trim())) {
                    person.role = await translateText(person.role_lv, 'lv', 'en');
                }

                if (person.superpower && (!person.superpower_lv || !person.superpower_lv.trim())) {
                    person.superpower_lv = await translateText(person.superpower, 'en', 'lv');
                } else if (person.superpower_lv && (!person.superpower || !person.superpower.trim())) {
                    person.superpower = await translateText(person.superpower_lv, 'lv', 'en');
                }

                if (person.current_project && (!person.current_project_lv || !person.current_project_lv.trim())) {
                    person.current_project_lv = await translateText(person.current_project, 'en', 'lv');
                } else if (person.current_project_lv && (!person.current_project || !person.current_project.trim())) {
                    person.current_project = await translateText(person.current_project_lv, 'lv', 'en');
                }
                
                // Skills (Bi-directional)
                if (person.skills && (!person.skills_lv || (Array.isArray(person.skills_lv) && person.skills_lv.length === 0) || (typeof person.skills_lv === 'string' && !person.skills_lv.trim()))) {
                    if (Array.isArray(person.skills)) {
                        person.skills_lv = await translateArray(person.skills, 'en', 'lv');
                    } else if (typeof person.skills === 'string' && person.skills.trim()) {
                        const arr = person.skills.split(',').map(s => s.trim()).filter(Boolean);
                        const translated = await translateArray(arr, 'en', 'lv');
                        person.skills_lv = translated.join(', ');
                    }
                } else if (person.skills_lv && (!person.skills || (Array.isArray(person.skills) && person.skills.length === 0) || (typeof person.skills === 'string' && !person.skills.trim()))) {
                    if (Array.isArray(person.skills_lv)) {
                        person.skills = await translateArray(person.skills_lv, 'lv', 'en');
                    } else if (typeof person.skills_lv === 'string' && person.skills_lv.trim()) {
                        const arr = person.skills_lv.split(',').map(s => s.trim()).filter(Boolean);
                        const translated = await translateArray(arr, 'lv', 'en');
                        person.skills = translated.join(', ');
                    }
                }

                // Certifications (Bi-directional)
                if (person.certifications && (!person.certifications_lv || (Array.isArray(person.certifications_lv) && person.certifications_lv.length === 0) || (typeof person.certifications_lv === 'string' && !person.certifications_lv.trim()))) {
                    if (Array.isArray(person.certifications)) {
                        person.certifications_lv = await translateArray(person.certifications, 'en', 'lv');
                    } else if (typeof person.certifications === 'string' && person.certifications.trim()) {
                        const arr = person.certifications.split(',').map(s => s.trim()).filter(Boolean);
                        const translated = await translateArray(arr, 'en', 'lv');
                        person.certifications_lv = translated.join(', ');
                    }
                } else if (person.certifications_lv && (!person.certifications || (Array.isArray(person.certifications) && person.certifications.length === 0) || (typeof person.certifications === 'string' && !person.certifications.trim()))) {
                    if (Array.isArray(person.certifications_lv)) {
                        person.certifications = await translateArray(person.certifications_lv, 'lv', 'en');
                    } else if (typeof person.certifications_lv === 'string' && person.certifications_lv.trim()) {
                        const arr = person.certifications_lv.split(',').map(s => s.trim()).filter(Boolean);
                        const translated = await translateArray(arr, 'lv', 'en');
                        person.certifications = translated.join(', ');
                    }
                }
            }
        }

        // V5: SWUP Team (Bi-directional)
        if (cloned.data.teamName && (!cloned.data.teamName_lv || !cloned.data.teamName_lv.trim())) {
            cloned.data.teamName_lv = await translateText(cloned.data.teamName, 'en', 'lv');
        } else if (cloned.data.teamName_lv && (!cloned.data.teamName || !cloned.data.teamName.trim())) {
            cloned.data.teamName = await translateText(cloned.data.teamName_lv, 'lv', 'en');
        }

        if (cloned.data.teamDestination && (!cloned.data.teamDestination_lv || !cloned.data.teamDestination_lv.trim())) {
            cloned.data.teamDestination_lv = await translateText(cloned.data.teamDestination, 'en', 'lv');
        } else if (cloned.data.teamDestination_lv && (!cloned.data.teamDestination || !cloned.data.teamDestination.trim())) {
            cloned.data.teamDestination = await translateText(cloned.data.teamDestination_lv, 'lv', 'en');
        }

        // V5: SWUP Members (Bi-directional)
        if (Array.isArray(cloned.data.members)) {
            for (const member of cloned.data.members) {
                if (member.role && (!member.role_lv || !member.role_lv.trim())) {
                    member.role_lv = await translateText(member.role, 'en', 'lv');
                } else if (member.role_lv && (!member.role || !member.role.trim())) {
                    member.role = await translateText(member.role_lv, 'lv', 'en');
                }

                if (member.specialty && (!member.specialty_lv || !member.specialty_lv.trim())) {
                    member.specialty_lv = await translateText(member.specialty, 'en', 'lv');
                } else if (member.specialty_lv && (!member.specialty || !member.specialty.trim())) {
                    member.specialty = await translateText(member.specialty_lv, 'lv', 'en');
                }

                if (member.project && (!member.project_lv || !member.project_lv.trim())) {
                    member.project_lv = await translateText(member.project, 'en', 'lv');
                } else if (member.project_lv && (!member.project || !member.project.trim())) {
                    member.project = await translateText(member.project_lv, 'lv', 'en');
                }

                if (member.skills && (!member.skills_lv || (Array.isArray(member.skills_lv) && member.skills_lv.length === 0) || (typeof member.skills_lv === 'string' && !member.skills_lv.trim()))) {
                    if (Array.isArray(member.skills)) {
                        member.skills_lv = await translateArray(member.skills, 'en', 'lv');
                    } else if (typeof member.skills === 'string' && member.skills.trim()) {
                        const arr = member.skills.split(',').map(s => s.trim()).filter(Boolean);
                        const translated = await translateArray(arr, 'en', 'lv');
                        member.skills_lv = translated.join(', ');
                    }
                } else if (member.skills_lv && (!member.skills || (Array.isArray(member.skills) && member.skills.length === 0) || (typeof member.skills === 'string' && !member.skills.trim()))) {
                    if (Array.isArray(member.skills_lv)) {
                        member.skills = await translateArray(member.skills_lv, 'lv', 'en');
                    } else if (typeof member.skills_lv === 'string' && member.skills_lv.trim()) {
                        const arr = member.skills_lv.split(',').map(s => s.trim()).filter(Boolean);
                        const translated = await translateArray(arr, 'lv', 'en');
                        member.skills = translated.join(', ');
                    }
                }
            }
        }
    }

    return cloned;
}

module.exports = {
    translateText,
    translateArray,
    autoTranslateScreenPayload
};
