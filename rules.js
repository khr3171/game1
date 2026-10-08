(function (root) {
  'use strict';
  const rules = Object.freeze({
    holes: 7, maxMisses: 20, levelSeconds: 60,
    target: level => Math.ceil(10 * Math.pow(1.1, level - 1) - 1e-9),
    hideMs: level => Math.max(380, Math.round(1700 * Math.pow(0.88, level - 1))),
    spawnMs: level => Math.max(220, Math.round(850 * Math.pow(0.92, level - 1)))
  });
  root.MoleRules = rules;
  if (typeof module !== 'undefined') module.exports = rules;
})(typeof window !== 'undefined' ? window : globalThis);
