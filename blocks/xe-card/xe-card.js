// registers the <xe-card> and <xe-button> custom elements
import '../../scripts/ignite/bundle/primitives/layout/card/xe-card.js';
import '../../scripts/ignite/bundle/primitives/action/button/xe-button.js';

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
  '../../scripts/ignite/bundle/primitives/layout/card/xe-card.js',
  '../../scripts/ignite/bundle/primitives/action/button/xe-button.js',
].map(safeImport));

export default function decorate(block) {
  const title = 'Title';
  const description = 'description';
  const actionTitle = 'actionTitle';
  const xeCard = document.createElement('xe-card');

  // create title
  const elTitle = document.createElement('h3');
  elTitle.textContent = title;
  elTitle.setAttribute('slot', 'title');
  xeCard.appendChild(elTitle);

  // create description
  const elDescription = document.createElement('p');
  elDescription.textContent = description;
  xeCard.appendChild(elDescription);

  // create action
  const elAction = document.createElement('div');
  elAction.setAttribute('slot', 'action');
  const elButton = document.createElement('xe-button');
  elButton.textContent = actionTitle;
  elAction.appendChild(elButton);
  xeCard.appendChild(elAction);

  block.replaceChildren(xeCard);
}
