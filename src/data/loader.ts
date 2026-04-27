import type { SourceCorpus } from './types.js';

/**
 * Loads the bundled prayer corpus.
 *
 * Phase 0: returns an empty corpus. Phase 1 will replace this with an import
 * of the build-time-generated JSON. All API functions must go through this
 * loader rather than importing JSON directly.
 */
export function loadCorpus(): SourceCorpus {
  return Object.freeze({
    categories: [],
    prayers: [],
  }) as SourceCorpus;
}
