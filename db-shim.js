/**
 * Wall of Fame — static-hosting API shim (Hostinger / plain FTP compatible).
 *
 * The portal normally talks to a Node/Express backend (api/index.js) at /api/*.
 * On static-only hosting there is no Node runtime, so this shim wraps
 * window.fetch: it first tries the real /api/* endpoint (Node/Vercel), and if
 * that answers 404/405/403 or fails to connect (static file server), it serves
 * the same endpoint shape directly from Supabase (same anon key as api/index.js).
 *
 * Endpoints covered: GET/POST /api/locations, GET/PUT/DELETE /api/locations/:id,
 * POST /api/auth, POST /api/translate.
 * Image uploads + translate already talk to Supabase/Google directly elsewhere.
 *
 * Also exposes:
 *   window.APP_ROOT             — subfolder-safe app root, e.g. "/wall-of-fame/"
 *   window.viewUrlFor(id,tmpl)  — public viewer URL for a screen
 */
(function () {
    'use strict';

    var SB_URL = 'https://vbscjdjzisdyohurjsro.supabase.co';
    var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZic2NqZGp6aXNkeW9odXJqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MjcwMjAsImV4cCI6MjEwMzIwMzAyMH0.c3iLIPXleuclBgy0B9Qe8U9kIyVHgOyNLLbbI_jpkr4';
    var ADMIN_U = 'admin';
    var ADMIN_P = 'DFAdmin2026!';

    // e.g. "/wall-of-fame/admin.html" -> "/wall-of-fame/"
    var APP_ROOT = window.location.pathname.replace(/[^/]*$/, '');
    if (APP_ROOT.charAt(APP_ROOT.length - 1) !== '/') APP_ROOT += '/';
    window.APP_ROOT = APP_ROOT;

    window.viewUrlFor = function (id, tmpl) {
        return window.location.origin + APP_ROOT + 'templates/' +
            encodeURIComponent(tmpl || 'designfactory') + '.html?id=' + encodeURIComponent(id);
    };

    window.resolvePhotoUrl = function (photoPath) {
        if (!photoPath) return '';
        if (photoPath.startsWith('data:') || photoPath.startsWith('blob:') || photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
            return photoPath;
        }
        var cleanPath = photoPath.replace(/^\/?(uploads\/)?/, '');
        if (window.location.protocol === 'file:') {
            return (window.location.pathname.indexOf('/templates/') !== -1 || window.location.pathname.indexOf('\\templates\\') !== -1)
                ? '../uploads/' + cleanPath
                : 'uploads/' + cleanPath;
        }
        if (window.location.hostname.indexOf('vercel.app') !== -1) {
            return 'https://vbscjdjzisdyohurjsro.supabase.co/storage/v1/object/public/images/uploads/' + cleanPath;
        }
        return '/uploads/' + cleanPath;
    };

    var _fetch = window.fetch.bind(window);

    function jsonResp(obj, status) {
        return new window.Response(JSON.stringify(obj), {
            status: status || 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    function sbHeaders(extra) {
        var h = {
            'apikey': SB_KEY,
            'Authorization': 'Bearer ' + SB_KEY,
            'Content-Type': 'application/json'
        };
        if (extra) {
            for (var k in extra) h[k] = extra[k];
        }
        return h;
    }

    async function gTranslate(text, from, to) {
        var clean = String(text || '').trim();
        if (!clean) return '';
        if (from === to) return clean;
        try {
            var r = await _fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
                encodeURIComponent(from) + '&tl=' + encodeURIComponent(to) + '&dt=t&q=' + encodeURIComponent(clean));
            if (r.ok) {
                var j = await r.json();
                if (Array.isArray(j) && Array.isArray(j[0])) {
                    var t = j[0].map(function (x) { return x[0]; }).filter(Boolean).join('');
                    if (t && t.trim()) return t.trim();
                }
            }
        } catch (e) { /* fall through */ }
        return clean;
    }

    async function loadLocalLocations() {
        var local = localStorage.getItem('wof_locations_cache');
        if (local) {
            try { return JSON.parse(local); } catch(e) {}
        }
        try {
            var r = await _fetch(APP_ROOT + 'database.json');
            if (r.ok) {
                var j = await r.json();
                if (j && Array.isArray(j.locations)) {
                    localStorage.setItem('wof_locations_cache', JSON.stringify(j.locations));
                    return j.locations;
                }
            }
        } catch(e) {}
        return [];
    }

    function saveLocalLocations(list) {
        try { localStorage.setItem('wof_locations_cache', JSON.stringify(list)); } catch(e) {}
    }

    async function fallback(url, opts) {
        opts = opts || {};
        var method = String(opts.method || 'GET').toUpperCase();
        var u;
        try { u = new URL(String(url), window.location.origin); }
        catch (e) { return jsonResp({ error: 'Bad request' }, 400); }
        var parts = u.pathname.split('/').filter(Boolean); // [..., 'api', 'locations', ':id'?]
        var apiIdx = parts.lastIndexOf('api');
        var res = apiIdx > -1 ? parts.slice(apiIdx + 1) : [];
        var body = null;
        try { body = opts.body ? JSON.parse(opts.body) : null; } catch (e) { body = null; }

        try {
            // ---- POST /api/auth ----
            if (res[0] === 'auth' && method === 'POST') {
                if (body && body.username === ADMIN_U && body.password === ADMIN_P) {
                    return jsonResp({
                        success: true, message: 'Login successful',
                        user: { username: 'admin', name: 'Admin', role: 'admin' },
                        token: 'df-admin-token-' + Date.now()
                    });
                }
                return jsonResp({ error: 'Invalid username or password' }, 401);
            }

            // ---- POST /api/translate ----
            if (res[0] === 'translate' && method === 'POST') {
                var from = (body && body.from) || 'en';
                var to = (body && body.to) || 'lv';
                if (body && Array.isArray(body.arr)) {
                    var out = [];
                    for (var i = 0; i < body.arr.length; i++) {
                        out.push(await gTranslate(body.arr[i], from, to));
                    }
                    return jsonResp({ success: true, translated: out });
                }
                if (body && typeof body.text === 'string') {
                    return jsonResp({ success: true, translated: await gTranslate(body.text, from, to) });
                }
                return jsonResp({ error: "Please provide 'text' string or 'arr' array." }, 400);
            }

            // ---- /api/locations* ----
            if (res[0] === 'locations') {
                var id = res[1] ? decodeURIComponent(res[1]) : null;

                if (method === 'GET' && !id) {
                    try {
                        var rl = await _fetch(SB_URL + '/rest/v1/locations?select=*', { headers: sbHeaders() });
                        if (rl.ok) {
                            var jl = await rl.json();
                            if (Array.isArray(jl) && jl.length > 0) {
                                saveLocalLocations(jl);
                                return jsonResp(jl, rl.status);
                            }
                        }
                    } catch (e) {
                        console.warn('Supabase offline/paused, falling back to local database.json:', e);
                    }
                    var cached = await loadLocalLocations();
                    return jsonResp(cached, 200);
                }
                if (method === 'GET' && id) {
                    try {
                        var ro = await _fetch(SB_URL + '/rest/v1/locations?id=eq.' + encodeURIComponent(id) + '&select=*', { headers: sbHeaders() });
                        if (ro.ok) {
                            var jo = await ro.json();
                            if (Array.isArray(jo) && jo.length > 0) {
                                return jsonResp(jo[0]);
                            }
                        }
                    } catch (e) {
                        console.warn('Supabase offline/paused, falling back to local database.json:', e);
                    }
                    var all = await loadLocalLocations();
                    var found = all.find(function(l) { return l.id === id; });
                    if (found) return jsonResp(found);
                    return jsonResp({ error: 'Location not found' }, 404);
                }
                if (method === 'POST' && !id) {
                    var created = body || {};
                    try {
                        var rc = await _fetch(SB_URL + '/rest/v1/locations?select=*', {
                            method: 'POST', headers: sbHeaders({ 'Prefer': 'return=representation' }),
                            body: JSON.stringify(body)
                        });
                        if (rc.ok) {
                            var jc = await rc.json();
                            if (Array.isArray(jc) && jc[0]) created = jc[0];
                        }
                    } catch (e) {}
                    var list = await loadLocalLocations();
                    var idx = list.findIndex(function(l) { return l.id === created.id; });
                    if (idx >= 0) list[idx] = created;
                    else list.push(created);
                    saveLocalLocations(list);
                    return jsonResp({ success: true, location: created });
                }
                if ((method === 'PUT' || method === 'PATCH') && id) {
                    var updated = body || {};
                    try {
                        var ru = await _fetch(SB_URL + '/rest/v1/locations?id=eq.' + encodeURIComponent(id) + '&select=*', {
                            method: 'PATCH', headers: sbHeaders({ 'Prefer': 'return=representation' }),
                            body: JSON.stringify(body)
                        });
                        if (ru.ok) {
                            var ju = await ru.json();
                            if (Array.isArray(ju) && ju[0]) updated = ju[0];
                        }
                    } catch (e) {}
                    var listU = await loadLocalLocations();
                    var idxU = listU.findIndex(function(l) { return l.id === id; });
                    if (idxU >= 0) {
                        listU[idxU] = Object.assign({}, listU[idxU], updated);
                        updated = listU[idxU];
                    } else {
                        listU.push(updated);
                    }
                    saveLocalLocations(listU);
                    return jsonResp({ success: true, location: updated });
                }
                if (method === 'DELETE' && id) {
                    try {
                        await _fetch(SB_URL + '/rest/v1/locations?id=eq.' + encodeURIComponent(id), {
                            method: 'DELETE', headers: sbHeaders()
                        });
                    } catch (e) {}
                    var listD = await loadLocalLocations();
                    listD = listD.filter(function(l) { return l.id !== id; });
                    saveLocalLocations(listD);
                    return jsonResp({ success: true });
                }
            }
        } catch (e) {
            return jsonResp({ error: String((e && e.message) || e) }, 500);
        }
        return jsonResp({ error: 'Not supported' }, 400);
    }

    window.fetch = function (url, opts) {
        var s = String(url || '');
        var isApi = s.indexOf('/api/') === 0 ||
            (s.indexOf(window.location.origin) === 0 && s.indexOf('/api/') > -1);
        if (!isApi) return _fetch(url, opts);
        return _fetch(url, opts).then(
            function (r) {
                if (r.status === 404 || r.status === 405 || r.status === 403) return fallback(url, opts);
                return r;
            },
            function () { return fallback(url, opts); }
        );
    };
})();
