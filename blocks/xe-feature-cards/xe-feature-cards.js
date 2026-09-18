import decorateCard from '../xe-card/xe-card.js';

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

const MIN_CARDS = 2;
const MAX_CARDS = 3;

// stand-in row matching the [title, body, link] cell structure xe-card.js expects
function createPlaceholderCardRow(index) {
  const row = document.createElement('div');
  const titleCell = document.createElement('div');
  titleCell.textContent = `Card title ${index}`;
  const bodyCell = document.createElement('div');
  bodyCell.innerHTML = '<p>Add a description for this card.</p>';
  const linkCell = document.createElement('div');
  row.append(titleCell, bodyCell, linkCell);
  return row;
}

export default function decorate(block) {
  const [heading, subHeading, ...allCards] = [...block.children];
  if (allCards.length > MAX_CARDS) {
    // eslint-disable-next-line no-console
    console.warn(`xe-feature-cards expects at most ${MAX_CARDS} xe-card items, but found ${allCards.length}. Extra cards are hidden.`);
  }
  const cards = allCards.slice(0, MAX_CARDS);
  while (cards.length < MIN_CARDS) {
    cards.push(createPlaceholderCardRow(cards.length + 1));
  }
  const xeCardGrid = document.createElement('xe-card-grid');
  const featureCards = document.createElement('xe-feature-cards');
  featureCards.setAttribute('heading', heading.textContent);
  featureCards.setAttribute('subHeading', subHeading.textContent);
  cards.forEach((row) => {
    decorateCard(row);
    xeCardGrid.append(row);
  });
  featureCards.append(xeCardGrid);
  block.textContent = '';
  block.append(featureCards);
}
