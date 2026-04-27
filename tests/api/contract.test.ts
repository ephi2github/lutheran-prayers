import { describe, expect, it } from 'vitest';
import * as api from '../../src/index.js';

/**
 * Phase 0 contract test. Confirms the public API surface exists and that the
 * not-yet-implemented functions throw a recognizable sentinel rather than
 * silently returning undefined.
 */
describe('public API surface', () => {
  it('exports every documented function', () => {
    expect(typeof api.getPrayerOfTheDay).toBe('function');
    expect(typeof api.getPrayerById).toBe('function');
    expect(typeof api.listPrayers).toBe('function');
    expect(typeof api.listPrayersByCategory).toBe('function');
    expect(typeof api.listCategories).toBe('function');
    expect(typeof api.searchPrayers).toBe('function');
  });

  it('throws NOT_IMPLEMENTED for stubbed functions', () => {
    expect(() => api.getPrayerOfTheDay()).toThrow('NOT_IMPLEMENTED');
    expect(() => api.getPrayerById('x')).toThrow('NOT_IMPLEMENTED');
    expect(() => api.listPrayers()).toThrow('NOT_IMPLEMENTED');
    expect(() => api.listPrayersByCategory('x')).toThrow('NOT_IMPLEMENTED');
    expect(() => api.listCategories()).toThrow('NOT_IMPLEMENTED');
    expect(() => api.searchPrayers('x')).toThrow('NOT_IMPLEMENTED');
  });
});
