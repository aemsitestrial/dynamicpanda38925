export default function decorate(block) {
  const rows = [...block.children];
  const title = "Title", description = "description", actionTitle = "actionTitle";
  const xeCard = document.createElement('xe-card');

  // create title
  const elTitle = document.createElement('h3');
  elTitle.textContent(title);
  elTitle.setAttribute('slot', 'title');
  xeCard.appendChild(elTitle);

  // create description
  const elDescription = document.createElement('p');
  elDescription.textContent(description);
  xeCard.appendChild(elDescription);

  // create action
  const elAction = document.createElement('div');
  elAction.setAttribute('slot', 'action');
  elAction.appendChild(`<xe-button>${actionTitle}</xe-button>`);
  xeCard.appendChild(elAction);

  block.replaceChildren(xeCard);
}
