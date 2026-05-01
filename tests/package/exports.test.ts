import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import type * as LutheranPrayers from '../../src/index.js';

const requirePackage = createRequire(import.meta.url);

describe('package exports', () => {
  it('loads the ESM export with import()', async () => {
    const pkg = await import('lutheran-prayers');
    const p = pkg.getPrayerById('P001');

    expect(p?.id).toBe('P001');
    expect(p?.language).toBe('en');
  });

  it('loads the CommonJS export with require()', () => {
    const pkg = requirePackage('lutheran-prayers') as typeof LutheranPrayers;
    const p = pkg.getPrayerById('P001');

    expect(p?.id).toBe('P001');
    expect(p?.language).toBe('en');
  });
});
