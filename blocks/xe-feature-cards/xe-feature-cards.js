// Each ignite bundle self-registers its own copy of shared elements (e.g.
// xe-icon), so importing more than one bundle that touches the same tag
// throws NotSupportedError and aborts the rest of that bundle's
// registrations (including the element the import was meant to add). Load
// them through customElements.define guarded against re-registration so one
// bundle's duplicate definition can't stop another's from completing.
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

// registers <xe-feature-cards>, <xe-card-grid>, <xe-icon>, <xe-icon-button>, <xe-carousel>, <xe-card>, <xe-button>
await Promise.all([
  '../../scripts/ignite/bundle/compositions/feature-cards/xe-feature-cards.js',
  '../../scripts/ignite/bundle/primitives/layout/card/xe-card.js',
  '../../scripts/ignite/bundle/primitives/action/button/xe-button.js',
].map(safeImport));

export default function decorate(block) {
  const heading = 'Hello';
  const subHeading = 'world';
  const xeCardGrid = document.createElement('xe-card-grid');
  const featureCards = document.createElement('xe-feature-cards');
  featureCards.setAttribute('heading', heading);
  featureCards.setAttribute('subHeading', subHeading);
  // move (not replace) the authored rows so each xe-card item keeps its
  // data-aue-* instrumentation, otherwise the Universal Editor can no longer
  // track existing items or let you add new ones inside this block.
  [...block.children].forEach((row) => xeCardGrid.append(row));
  featureCards.appendChild(xeCardGrid);
  block.append(featureCards);
}
