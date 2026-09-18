// registers the <xe-card> and <xe-button> custom elements
import '../../scripts/ignite/bundle/primitives/layout/card/xe-card.js';
import '../../scripts/ignite/bundle/primitives/action/button/xe-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleCell, bodyCell, linkCell] = [...block.children];
  const card = document.createElement('xe-card');
  moveInstrumentation(block, card);
  card.setAttribute('variant', 'surface');
  card.setAttribute('treatment', 'filled');
  if (titleCell) {
    const title = document.createElement('h3');
    title.setAttribute('slot', 'title');
    title.textContent = titleCell.textContent.trim();
    card.append(title);
  }

  if (bodyCell) {
    // Body paragraphs go into the card's default slot.
    while (bodyCell.firstChild) card.append(bodyCell.firstChild);
  }

  const link = linkCell?.querySelector('a');
  if (link) {
    const actions = document.createElement('div');
    actions.setAttribute('slot', 'actions');

    const button = document.createElement('xe-button');
    button.setAttribute('variant', 'primary');
    button.setAttribute('treatment', 'outline');
    const href = link.getAttribute('href');
    if (href) button.setAttribute('href', href);
    button.textContent = link.textContent.trim();

    actions.append(button);
    card.append(actions);
  }

  block.textContent = '';
  block.append(card);
}

// builds the raw [title, body, link] cell markup xe-card's decorate() expects
export function createCardBlock({ title = 'Title', body = 'Description', linkHref = 'https://www.google.com', linkText = 'View' } = {}) {
  const block = `          
  <div>
    <div>${title}</div>
    <div>${body}</div>
    <div><a href=\"${linkHref}\">${linkText}</a></div>
  </div>`;
  return block;
}

export { decorate };
