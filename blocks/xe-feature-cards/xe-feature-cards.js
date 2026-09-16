export default function decorate(block) {
  const rows = [...block.children];
  const heading = 'Hello';
  const subHeading = 'world';
  const xeCardGrid = document.createElement('xe-card-grid');
  const featureCards = document.createElement('xe-feature-cards');
  featureCards.setAttribute('heading', heading);
  featureCards.setAttribute('subHeading', subHeading);
  featureCards.appendChild(xeCardGrid);
  block.replaceChildren(featureCards);
}
