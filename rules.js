(function (root) {
  'use strict';
  const rules = Object.freeze({
    holes: 15, maxLevel: 10, maxMisses: 20, levelSeconds: 60,
    keys: Object.freeze(['1', '2', '3', '4', '5', 'q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g']),
    target: level => Math.ceil(20 * Math.pow(1.2, level - 1) - 1e-9),
    hideMs: level => Math.max(340, Math.round(950 * Math.pow(0.9, level - 1))),
    spawnMs: level => Math.max(230, Math.round(500 * Math.pow(0.92, level - 1)))
  });
  root.MoleRules = rules;
  if (typeof module !== 'undefined') module.exports = rules;
})(typeof window !== 'undefined' ? window : globalThis);
