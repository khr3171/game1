(function (root) {
  'use strict';
  const rules = Object.freeze({
    holes: 15, maxLevel: 10, maxMisses: 20, levelSeconds: 60,
    keys: Object.freeze(['1', '2', '3', '4', '5', 'q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g']),
    target: level => Math.ceil(20 * Math.pow(1.2, level - 1) - 1e-9),
    hideMs: level => Math.max(340, Math.round(950 * Math.pow(0.9, level - 1))),
    spawnMs: level => Math.max(230, Math.round(500 * Math.pow(0.92, level - 1))),
    specialCount: (type, level) => Math.ceil((type === 'king' ? 1 : 10) * Math.pow(1.05, level - 1) - 1e-9),
    makeDeck: (level, random = Math.random) => {
      const deck = [];
      for (const type of ['red', 'yellow', 'king']) {
        const count = Math.ceil((type === 'king' ? 1 : 10) * Math.pow(1.05, level - 1) - 1e-9);
        deck.push(...Array(count).fill(type));
      }
      deck.push(...Array(deck.length).fill('normal'));
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    }
  });
  root.MoleRules = rules;
  if (typeof module !== 'undefined') module.exports = rules;
})(typeof window !== 'undefined' ? window : globalThis);
