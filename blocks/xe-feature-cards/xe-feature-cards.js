import decorateCard, { createCardBlock } from '../xe-card/xe-card.js';

async function safeImport(path) {
  const originalDefine = customElements.define.bind(customElements);
  customElements.define = (name, ctor, options) => {
    if (customElements.get(name)) return undefined;
    return originalDefine(name, ctor, options);
  };
  try {
    await import(path);
  } finally {
    customElements.define = originalDefine;
  }
}

await Promise.all([
  '../../scripts/ignite/bundle/compositions/feature-cards/xe-feature-cards.js',
].map(safeImport));

export default function decorate(block) {
  const [heading, subHeading, ...allCards] = [...block.children];
  const xeCardGrid = document.createElement('xe-card-grid');
  const featureCards = document.createElement('xe-feature-cards');
  featureCards.setAttribute('heading', heading.textContent);
  featureCards.setAttribute('subHeading', subHeading.textContent);
  allCards.forEach((row) => {
    decorateCard(row);
    xeCardGrid.append(row);
  });
  featureCards.append(xeCardGrid);
  block.textContent = '';
  block.append(featureCards);
}
