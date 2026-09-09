const DEFAULT_STUDIO = 'https://studio.nabhilabs.info';

const els = {
  studioUrl: document.getElementById('studioUrl'),
  token: document.getElementById('token'),
  campaignId: document.getElementById('campaignId'),
  mapsUrl: document.getElementById('mapsUrl'),
  json: document.getElementById('json'),
  doPublish: document.getElementById('doPublish'),
  submit: document.getElementById('submit'),
  copyPrompt: document.getElementById('copyPrompt'),
  status: document.getElementById('status'),
  result: document.getElementById('result'),
};

function showStatus(text, kind) {
  els.status.hidden = false;
  els.status.className = `msg ${kind || ''}`;
  els.status.textContent = text;
}

function studioBase() {
  return (els.studioUrl.value || DEFAULT_STUDIO).replace(/\/$/, '');
}

async function loadSettings() {
  const data = await chrome.storage.local.get([
    'studioUrl',
    'token',
    'campaignId',
    'geminiPrompt',
  ]);
  els.studioUrl.value = data.studioUrl || DEFAULT_STUDIO;
  els.token.value = data.token || '';
  els.campaignId.value = data.campaignId || '';
}

async function saveSettings() {
  await chrome.storage.local.set({
    studioUrl: studioBase(),
    token: els.token.value.trim(),
    campaignId: els.campaignId.value.trim(),
  });
}

els.studioUrl.addEventListener('change', () => void saveSettings());
els.token.addEventListener('change', () => void saveSettings());
els.campaignId.addEventListener('change', () => void saveSettings());

els.copyPrompt.addEventListener('click', async () => {
  await saveSettings();
  const token = els.token.value.trim();
  if (!token) {
    showStatus('Set extension token first (Studio → CRM).', 'err');
    return;
  }
  try {
    const res = await fetch(`${studioBase()}/api/extension/tokens`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const prompt = data.geminiPrompt || '';
    await navigator.clipboard.writeText(prompt);
    await chrome.storage.local.set({ geminiPrompt: prompt });
    showStatus('Gemini prompt copied to clipboard.', 'ok');
  } catch (e) {
    showStatus(e instanceof Error ? e.message : 'Failed to fetch prompt', 'err');
  }
});

els.submit.addEventListener('click', async () => {
  await saveSettings();
  const token = els.token.value.trim();
  const json = els.json.value.trim();
  if (!token) {
    showStatus('Extension token required.', 'err');
    return;
  }
  if (!json) {
    showStatus('Paste Gemini JSON first.', 'err');
    return;
  }

  els.submit.disabled = true;
  els.result.hidden = true;
  showStatus('Creating demo site…', '');

  try {
    const body = {
      json,
      publish: els.doPublish.checked,
      reviewNote: 'Field demo — Gemini paste via Chrome extension',
    };
    if (els.campaignId.value.trim()) body.campaignId = els.campaignId.value.trim();
    if (els.mapsUrl.value.trim()) body.mapsUrl = els.mapsUrl.value.trim();

    const res = await fetch(`${studioBase()}/api/extension/demo-from-gemini`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    const liveUrl = data.liveUrl || '';
    const qrSrc = liveUrl
      ? `https://quickchart.io/qr?text=${encodeURIComponent(liveUrl)}&size=200&margin=1`
      : '';

    els.result.hidden = false;
    els.result.innerHTML = `
      <strong>${escapeHtml(data.hospital?.name || 'Created')}</strong>
      ${data.publishError ? `<div>Publish warning: ${escapeHtml(data.publishError)}</div>` : ''}
      ${data.publish ? `<div>Publish queued: ${escapeHtml(data.publish.id)}</div>` : ''}
      <div><a href="${escapeHtml(liveUrl)}" target="_blank" rel="noreferrer">${escapeHtml(liveUrl)}</a></div>
      ${qrSrc ? `<img alt="QR" src="${escapeHtml(qrSrc)}" />` : ''}
      <button type="button" class="secondary" id="copyUrl">Copy live URL</button>
    `;
    document.getElementById('copyUrl')?.addEventListener('click', async () => {
      await navigator.clipboard.writeText(liveUrl);
      showStatus('Live URL copied.', 'ok');
    });
    showStatus('Done — demo created.', 'ok');
    els.json.value = '';
  } catch (e) {
    showStatus(e instanceof Error ? e.message : 'Request failed', 'err');
  } finally {
    els.submit.disabled = false;
  }
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

void loadSettings();
