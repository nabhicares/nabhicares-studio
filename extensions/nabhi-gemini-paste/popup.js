const DEFAULT_STUDIO = 'https://studio.nabhilabs.info';
const JOBS_KEY = 'recentJobs';
const MAX_JOBS = 8;

const els = {
  studioUrl: document.getElementById('studioUrl'),
  token: document.getElementById('token'),
  campaignId: document.getElementById('campaignId'),
  mapsUrl: document.getElementById('mapsUrl'),
  photoUrls: document.getElementById('photoUrls'),
  json: document.getElementById('json'),
  doPublish: document.getElementById('doPublish'),
  submit: document.getElementById('submit'),
  copyPrompt: document.getElementById('copyPrompt'),
  status: document.getElementById('status'),
  jobs: document.getElementById('jobs'),
  clipHelper: document.getElementById('clipHelper'),
};

function showStatus(text, kind) {
  els.status.hidden = false;
  els.status.className = `msg ${kind || ''}`;
  els.status.textContent = text;
}

function studioBase() {
  return (els.studioUrl.value || DEFAULT_STUDIO).replace(/\/$/, '');
}

function copyTextSync(text) {
  if (!text) return false;
  try {
    els.clipHelper.value = text;
    els.clipHelper.focus();
    els.clipHelper.select();
    const ok = document.execCommand('copy');
    els.clipHelper.blur();
    if (ok) return true;
  } catch {
    /* fall through */
  }
  return false;
}

async function copyText(text) {
  if (copyTextSync(text)) return true;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

async function loadSettings() {
  const data = await chrome.storage.local.get([
    'studioUrl',
    'token',
    'campaignId',
    'geminiPrompt',
    JOBS_KEY,
  ]);
  els.studioUrl.value = data.studioUrl || DEFAULT_STUDIO;
  els.token.value = data.token || '';
  els.campaignId.value = data.campaignId || '';
  renderJobs(data[JOBS_KEY] || []);
  if (data.token && !data.geminiPrompt) {
    void prefetchPrompt(false);
  }
}

async function saveSettings() {
  await chrome.storage.local.set({
    studioUrl: studioBase(),
    token: els.token.value.trim(),
    campaignId: els.campaignId.value.trim(),
  });
}

async function prefetchPrompt(showErrors) {
  const token = els.token.value.trim();
  if (!token) return '';
  try {
    const res = await fetch(`${studioBase()}/api/extension/tokens`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (showErrors) throw new Error(`Could not load prompt (HTTP ${res.status}). Check token.`);
      return '';
    }
    const data = await res.json();
    const prompt = (data.geminiPrompt || '').trim();
    if (prompt) await chrome.storage.local.set({ geminiPrompt: prompt });
    return prompt;
  } catch (e) {
    if (showErrors) throw e;
    return '';
  }
}

els.studioUrl.addEventListener('change', () => void saveSettings());
els.token.addEventListener('change', () => {
  void saveSettings().then(() => prefetchPrompt(false));
});
els.campaignId.addEventListener('change', () => void saveSettings());

els.copyPrompt.addEventListener('click', async () => {
  await saveSettings();
  const token = els.token.value.trim();
  if (!token) {
    showStatus('Set extension token first (Studio → CRM).', 'err');
    return;
  }

  const cached = (await chrome.storage.local.get(['geminiPrompt'])).geminiPrompt || '';
  // Copy cached prompt immediately while user gesture is fresh
  if (cached.trim()) {
    const ok = await copyText(cached);
    if (ok) {
      showStatus('Gemini prompt copied. Refreshing cache…', 'ok');
      void prefetchPrompt(false);
      return;
    }
  }

  try {
    const prompt = await prefetchPrompt(true);
    if (!prompt) {
      showStatus('Prompt was empty — check Studio / section-registry deploy.', 'err');
      return;
    }
    const ok = await copyText(prompt);
    if (!ok) {
      showStatus('Could not copy — select & copy manually from Studio CRM if needed.', 'err');
      return;
    }
    showStatus('Gemini prompt copied to clipboard.', 'ok');
  } catch (e) {
    showStatus(e instanceof Error ? e.message : 'Failed to fetch prompt', 'err');
  }
});

function normalizeGeminiJson(raw) {
  let s = String(raw || '')
    .replace(/^\uFEFF/, '')
    .trim();
  const fenced = s.match(/^```(?:json|JSON)?\s*\r?\n?([\s\S]*?)\r?\n?```\s*$/);
  if (fenced && fenced[1]) s = fenced[1].trim();
  else if (s.startsWith('```')) {
    s = s
      .replace(/^```(?:json|JSON)?\s*\r?\n?/, '')
      .replace(/\r?\n?```\s*$/, '')
      .trim();
  }
  const brace = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (brace > 0 && last > brace) s = s.slice(brace, last + 1).trim();
  return s;
}

function peekHospitalName(jsonStr) {
  try {
    const o = JSON.parse(jsonStr);
    return (o?.hospital?.name && String(o.hospital.name).trim()) || 'Hospital';
  } catch {
    return 'Hospital';
  }
}

async function readJobs() {
  const data = await chrome.storage.local.get([JOBS_KEY]);
  return Array.isArray(data[JOBS_KEY]) ? data[JOBS_KEY] : [];
}

async function writeJobs(jobs) {
  await chrome.storage.local.set({ [JOBS_KEY]: jobs.slice(0, MAX_JOBS) });
  renderJobs(jobs.slice(0, MAX_JOBS));
}

function renderJobs(jobs) {
  if (!jobs.length) {
    els.jobs.innerHTML = '<div class="job meta">No jobs yet — paste JSON and Create + publish.</div>';
    return;
  }
  els.jobs.innerHTML = jobs
    .map(
      (j) => `<div class="job">
        <strong>${escapeHtml(j.name || j.slug || 'Site')}</strong>
        <div class="meta">${escapeHtml(j.status || 'queued')}</div>
        ${j.liveUrl ? `<div><a href="${escapeHtml(j.liveUrl)}" target="_blank" rel="noreferrer">${escapeHtml(j.liveUrl)}</a></div>` : ''}
        ${j.pathUrl ? `<div class="meta">Fallback: <a href="${escapeHtml(j.pathUrl)}" target="_blank" rel="noreferrer">${escapeHtml(j.pathUrl)}</a></div>` : ''}
      </div>`,
    )
    .join('');
}

els.submit.addEventListener('click', async () => {
  await saveSettings();
  const token = els.token.value.trim();
  const json = normalizeGeminiJson(els.json.value);
  if (!token) {
    showStatus('Extension token required.', 'err');
    return;
  }
  if (!json) {
    showStatus('Paste Gemini JSON first.', 'err');
    return;
  }
  try {
    JSON.parse(json);
  } catch {
    showStatus('That does not look like valid JSON. Paste only the { … } block from Gemini.', 'err');
    return;
  }

  const nameGuess = peekHospitalName(json);
  const tempId = `tmp_${Date.now()}`;
  const body = {
    json,
    publish: els.doPublish.checked,
    reviewNote: 'Field demo — Gemini paste via Chrome extension',
  };
  if (els.campaignId.value.trim()) body.campaignId = els.campaignId.value.trim();
  if (els.mapsUrl.value.trim()) body.mapsUrl = els.mapsUrl.value.trim();
  if (els.photoUrls && els.photoUrls.value.trim()) {
    body.photoUrls = els.photoUrls.value.trim();
  }

  // Clear paste box immediately — operator keeps going
  els.json.value = '';
  els.mapsUrl.value = '';
  if (els.photoUrls) els.photoUrls.value = '';
  showStatus('Queued — keep adding hospitals. Build finishes in the background (~1 min).', 'ok');

  const jobs = await readJobs();
  jobs.unshift({
    id: tempId,
    name: nameGuess,
    status: 'sending…',
    liveUrl: '',
    pathUrl: '',
    at: Date.now(),
  });
  await writeJobs(jobs);

  // Fire and forget — do not block the UI
  void (async () => {
    try {
      const res = await fetch(`${studioBase()}/api/extension/demo-from-gemini`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      const list = await readJobs();
      const idx = list.findIndex((j) => j.id === tempId);
      if (!res.ok) {
        const err = data.error || `HTTP ${res.status}`;
        if (idx >= 0) {
          list[idx] = { ...list[idx], status: `failed: ${err}` };
          await writeJobs(list);
        }
        showStatus(`Last job failed: ${err}`, 'err');
        return;
      }
      const hospital = data.hospital || {};
      const entry = {
        id: hospital.id || tempId,
        name: hospital.name || nameGuess,
        slug: hospital.slug || '',
        status: data.publish
          ? 'publish queued (building in background)'
          : data.publishError
            ? `created — publish: ${data.publishError}`
            : 'created',
        liveUrl: data.liveUrl || '',
        pathUrl: data.pathUrl || '',
        at: Date.now(),
      };
      if (idx >= 0) list[idx] = entry;
      else list.unshift(entry);
      await writeJobs(list);
      showStatus(`Queued ${entry.name}. Paste the next hospital when ready.`, 'ok');
    } catch (e) {
      const list = await readJobs();
      const idx = list.findIndex((j) => j.id === tempId);
      const err = e instanceof Error ? e.message : 'Request failed';
      if (idx >= 0) {
        list[idx] = { ...list[idx], status: `failed: ${err}` };
        await writeJobs(list);
      }
      showStatus(`Last job failed: ${err}`, 'err');
    }
  })();
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

void loadSettings();
