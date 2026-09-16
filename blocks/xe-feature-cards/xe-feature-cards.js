// registers the <xe-feature-cards> and <xe-card-grid> custom elements
import '../../scripts/ignite/bundle/compositions/feature-cards/xe-feature-cards.js';
import '../../scripts/ignite/bundle/primitives/layout/card-grid/xe-card-grid.js';
import '../../scripts/ignite/bundle/primitives/layout/card/xe-card.js';
import '../../scripts/ignite/bundle/primitives/action/button/xe-button.js';

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
