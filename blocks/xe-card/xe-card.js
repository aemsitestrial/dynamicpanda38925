import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const [title, description, action_Title] = rows.children;
  const xeCard = document.createElement('xe-card');

  // create title
  const elTitle = document.createElement('h3');
  elTitle.textContent(title);
  elTitle.setAttribute('slot', "title");
  xeCard.appendChild(elTitle);

  // create description
  const elDescription = document.createElement('p');
  elDescription.textContent(description);
  xeCard.appendChild(elDescription);

  // create action
  const elAction = document.createElement('div');
  elAction.setAttribute('slot', "action");
  elAction.appendChild('<xe-button>' + action_Title + '</xe-button>');
  xeCard.appendChild(elAction);

  block.replaceChildren(xeCard);
}
