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
export function createCardBlock({ title = 'Title', body = 'Description', linkHref = '', linkText = 'View' } = {}) {
  const block = document.createElement('div');
  const titleCell = document.createElement('div');
  titleCell.textContent = title;
  const bodyCell = document.createElement('div');
  bodyCell.innerHTML = `<p>${body}</p>`;
  const linkCell = document.createElement('div');
  if (linkHref) {
    const link = document.createElement('a');
    link.setAttribute('href', linkHref);
    link.textContent = linkText;
    linkCell.append(link);
  }
  block.append(titleCell, bodyCell, linkCell);
  return block;
}

export { decorate };
