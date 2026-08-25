/**
 * Dual-Engine Backend Translation Pipeline (Google + MyMemory + Dictionary Fallback)
 */

const COMMON_TERMS: Record<string, string> = {
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

async function queryGoogleTranslate(text: string, from: string = 'en', to: string = 'lv'): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!response.ok) throw new Error(`Google Translate HTTP ${response.status}`);
  const result = await response.json();
  if (Array.isArray(result) && Array.isArray(result[0])) {
    const translated = result[0].map((item: any) => item[0]).filter(Boolean).join('');
    if (translated) return translated;
  }
  throw new Error('Invalid Google Translate payload format');
}

async function queryMyMemory(text: string, from: string = 'en', to: string = 'lv'): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(from)}|${encodeURIComponent(to)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`MyMemory HTTP ${response.status}`);
  const json = await response.json();
  if (json && json.responseData && json.responseData.translatedText) {
    const translated = json.responseData.translatedText;
    if (!translated.startsWith('MYMEMORY WARNING')) {
      return translated;
    }
  }
  throw new Error('Invalid MyMemory response');
}

export async function translateText(text: string, from: string = 'en', to: string = 'lv'): Promise<string> {
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

export async function translateArray(arr: string[], from: string = 'en', to: string = 'lv'): Promise<string[]> {
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
    console.error('[Translate] translateArray fallback:', error);
    return validItems;
  }
}

export async function autoTranslateScreenPayload(payload: any): Promise<any> {
  if (!payload || typeof payload !== 'object') return payload;

  const cloned = JSON.parse(JSON.stringify(payload));

  // 1. Top level location fields
  if (cloned.title && (!cloned.title_lv || !cloned.title_lv.trim())) {
    cloned.title_lv = await translateText(cloned.title);
  }
  if (cloned.subtitle && (!cloned.subtitle_lv || !cloned.subtitle_lv.trim())) {
    cloned.subtitle_lv = await translateText(cloned.subtitle);
  }
  if (cloned.description && (!cloned.description_lv || !cloned.description_lv.trim())) {
    cloned.description_lv = await translateText(cloned.description);
  }

  // 2. Nested data
  if (cloned.data && typeof cloned.data === 'object') {
    // V4: Inductees
    if (Array.isArray(cloned.data.inductees)) {
      for (const person of cloned.data.inductees) {
        if (person.role && (!person.role_lv || !person.role_lv.trim())) {
          person.role_lv = await translateText(person.role);
        }
        if (person.superpower && (!person.superpower_lv || !person.superpower_lv.trim())) {
          person.superpower_lv = await translateText(person.superpower);
        }
        if (person.current_project && (!person.current_project_lv || !person.current_project_lv.trim())) {
          person.current_project_lv = await translateText(person.current_project);
        }
        
        // Skills
        if (person.skills && (!person.skills_lv || (Array.isArray(person.skills_lv) && person.skills_lv.length === 0) || (typeof person.skills_lv === 'string' && !person.skills_lv.trim()))) {
          if (Array.isArray(person.skills)) {
            person.skills_lv = await translateArray(person.skills);
          } else if (typeof person.skills === 'string' && person.skills.trim()) {
            const arr = person.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
            const translated = await translateArray(arr);
            person.skills_lv = translated.join(', ');
          }
        }

        // Certifications
        if (person.certifications && (!person.certifications_lv || (Array.isArray(person.certifications_lv) && person.certifications_lv.length === 0) || (typeof person.certifications_lv === 'string' && !person.certifications_lv.trim()))) {
          if (Array.isArray(person.certifications)) {
            person.certifications_lv = await translateArray(person.certifications);
          } else if (typeof person.certifications === 'string' && person.certifications.trim()) {
            const arr = person.certifications.split(',').map((s: string) => s.trim()).filter(Boolean);
            const translated = await translateArray(arr);
            person.certifications_lv = translated.join(', ');
          }
        }
      }
    }

    // V5: SWUP Team
    if (cloned.data.teamName && (!cloned.data.teamName_lv || !cloned.data.teamName_lv.trim())) {
      cloned.data.teamName_lv = await translateText(cloned.data.teamName);
    }
    if (cloned.data.teamDestination && (!cloned.data.teamDestination_lv || !cloned.data.teamDestination_lv.trim())) {
      cloned.data.teamDestination_lv = await translateText(cloned.data.teamDestination);
    }

    // V5: SWUP Members
    if (Array.isArray(cloned.data.members)) {
      for (const member of cloned.data.members) {
        if (member.role && (!member.role_lv || !member.role_lv.trim())) {
          member.role_lv = await translateText(member.role);
        }
        if (member.specialty && (!member.specialty_lv || !member.specialty_lv.trim())) {
          member.specialty_lv = await translateText(member.specialty);
        }
        if (member.project && (!member.project_lv || !member.project_lv.trim())) {
          member.project_lv = await translateText(member.project);
        }
        if (member.skills && (!member.skills_lv || (Array.isArray(member.skills_lv) && member.skills_lv.length === 0) || (typeof member.skills_lv === 'string' && !member.skills_lv.trim()))) {
          if (Array.isArray(member.skills)) {
            member.skills_lv = await translateArray(member.skills);
          } else if (typeof member.skills === 'string' && member.skills.trim()) {
            const arr = member.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
            const translated = await translateArray(arr);
            member.skills_lv = translated.join(', ');
          }
        }
      }
    }
  }

  return cloned;
}
