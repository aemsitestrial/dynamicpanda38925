
export default function decorate(block) {
  const rows = [...block.children];
  const [heading, subHeading] = rows.children;
  const xeCardGrid = document.createElement('xe-card-grid');
  const featureCards = document.createElement('xe-featured-cards');
  featureCards.setAttribute('heading', heading);
  featureCards.setAttribute('subHeading', subHeading);
  featureCards.appendChild(xeCardGrid);
  block.replaceChildren(featureCards);
}
