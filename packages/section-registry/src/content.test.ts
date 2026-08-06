import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  importContentJson,
  importHospitalBundleJson,
  validateSectionContent,
  sanitizeContentString,
  migrateSectionContent,
  exampleContentForSection,
  CONTENT_SCHEMA_VERSION,
} from './index';

describe('sanitizeContentString', () => {
  it('strips HTML tags and keeps text', () => {
    const r = sanitizeContentString('<b>Emergency</b> care', 'body');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.value, 'Emergency care');
  });

  it('rejects javascript: URLs', () => {
    const r = sanitizeContentString('javascript:alert(1)', 'image');
    assert.equal(r.ok, false);
  });

  it('allows plain text and https URLs', () => {
    const r = sanitizeContentString('https://cdn.example/a.jpg', 'image');
    assert.equal(r.ok, true);
    if (r.ok && 'value' in r) assert.equal(r.value.includes('cdn.example'), true);
  });
});

describe('validateSectionContent', () => {
  it('accepts valid hero content', () => {
    const r = validateSectionContent('hero', {
      title: 'Hello',
      body: 'Care nearby',
      image: 'https://example.com/x.jpg',
    });
    assert.equal(r.ok, true);
  });

  it('rejects design keys', () => {
    const r = validateSectionContent('hero', { title: 'x', colors: '#fff' });
    assert.equal(r.ok, false);
  });

  it('strips HTML in fields on import', () => {
    const r = validateSectionContent('hero', { title: '<b>x</b>' });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.content.title, 'x');
  });

  it('strict import rejects unknown fields', () => {
    const r = importContentJson('hero', JSON.stringify({ title: 'ok', evil: 'no' }));
    assert.equal(r.ok, false);
  });

  it('non-strict strips unknown fields', () => {
    const r = validateSectionContent(
      'hero',
      { title: 'ok', evil: 'no' },
      undefined,
      { strictUnknown: false },
    );
    assert.equal(r.ok, true);
    if (r.ok) assert.equal('evil' in r.content, false);
  });
});

describe('migrateSectionContent', () => {
  it('migrates v0 hero with legacy cta field', () => {
    const r = migrateSectionContent('hero', { title: 'Hi', cta: 'Book' }, 0);
    assert.equal(r.version, CONTENT_SCHEMA_VERSION);
    assert.equal(r.content.ctaPrimary, 'Book');
    assert.equal('cta' in r.content, false);
    assert.equal(r.changed, true);
  });

  it('is a no-op when already at current version', () => {
    const r = migrateSectionContent('hero', { title: 'Hi' }, CONTENT_SCHEMA_VERSION);
    assert.equal(r.version, CONTENT_SCHEMA_VERSION);
    assert.equal(r.changed, false);
  });
});

describe('contact + hospital bundle', () => {
  it('validates contact example content', () => {
    const r = validateSectionContent('contact', exampleContentForSection('contact'));
    assert.equal(r.ok, true);
  });

  it('imports a whole-hospital Gemini bundle', () => {
    const raw = JSON.stringify({
      hospital: {
        name: 'Greenfield Multispecialty',
        slug: 'greenfield',
        seoTitle: 'Greenfield',
        seoDescription: 'Local care',
      },
      sections: {
        hero: exampleContentForSection('hero'),
        contact: exampleContentForSection('contact'),
      },
    });
    const r = importHospitalBundleJson(raw);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.hospital.name, 'Greenfield Multispecialty');
    assert.equal(typeof r.sections.hero.title, 'string');
    assert.equal(typeof r.sections.contact.phone, 'string');
  });

  it('rejects unknown section keys in the bundle', () => {
    const r = importHospitalBundleJson(
      JSON.stringify({ hospital: {}, sections: { nope: { title: 'x' } } }),
    );
    assert.equal(r.ok, false);
  });
});
