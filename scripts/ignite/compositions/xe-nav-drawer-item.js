var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { navDrawerItem } from '@ignite/web/tokens/component';
import '@ignite/web/primitives/media/icon/xe-icon.js';
/**
 * Xcel Energy Nav Drawer Item Component
 *
 * An individual navigation row within `xe-nav-drawer`. Renders a leading icon
 * slot, a label (required), an optional sublabel, and a trailing chevron when
 * child items are present.
 *
 * Child items are declared via `slot="children"`. When tapped, the item fires
 * `xe-nav-drawer-item-expand` so the parent drawer can push a new navigation
 * level. Leaf items (no children) navigate via `href`.
 *
 * @element xe-nav-drawer-item
 *
 * @prop {string} label - Primary label text (required)
 * @prop {string} sublabel - Optional secondary descriptor shown below the label
 * @prop {string} href - Optional URL; when set the item navigates on click
 * @prop {boolean} selected - Shows a trailing checkmark to indicate the active selection
 *
 * @slot leading-icon - Optional leading icon (xe-icon recommended, 20px)
 * @slot children - Nested `xe-nav-drawer-item` elements for sub-navigation
 *
 * @fires xe-nav-drawer-item-click - Fired on leaf-item click (detail: { href })
 * @fires xe-nav-drawer-item-expand - Fired when an item with children is tapped (detail: { label })
 */
let XENavDrawerItem = class XENavDrawerItem extends LitElement {
    constructor() {
        super(...arguments);
        this.label = '';
        this.sublabel = '';
        this.href = '';
        this.selected = false;
        this._hasLeadingIcon = false;
        // Determined once from the live DOM on connection — never driven by slotchange
        // so it remains stable when children are moved into a slide panel.
        this._hasChildren = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this._hasChildren = Array.from(this.children).some(el => el.getAttribute('slot') === 'children');
    }
    _onLeadingIconSlotChange(e) {
        const slot = e.target;
        this._hasLeadingIcon = slot.assignedNodes({ flatten: true }).length > 0;
    }
    _handleClick(e) {
        e.preventDefault();
        if (this._hasChildren) {
            this.dispatchEvent(new CustomEvent('xe-nav-drawer-item-expand', {
                bubbles: true,
                composed: true,
                detail: { label: this.label },
            }));
            return;
        }
        this.dispatchEvent(new CustomEvent('xe-nav-drawer-item-click', {
            bubbles: true,
            composed: true,
            detail: { href: this.href },
        }));
        if (this.href) {
            window.location.href = this.href;
        }
    }
    render() {
        return html `
      <button class="item" type="button" @click=${this._handleClick}>
        <span class="item-leading-icon" ?hidden=${!this._hasLeadingIcon}>
          <slot name="leading-icon" @slotchange=${this._onLeadingIconSlotChange}></slot>
        </span>

        <span class="item-labels">
          <span class="item-label">${this.label}</span>
          ${this.sublabel
            ? html `<span class="item-sublabel">${this.sublabel}</span>`
            : nothing}
        </span>

        ${this._hasChildren ? html `
          <span class="item-trailing-icon">
            <xe-icon icon="faChevronRight" size="md"></xe-icon>
          </span>
        ` : this.selected ? html `
          <span class="item-trailing-icon">
            <xe-icon icon="faCheck" size="sm"></xe-icon>
          </span>
        ` : nothing}
      </button>

      <!-- Hidden slot — xe-nav-drawer queries assignedElements() from here -->
      <div hidden>
        <slot name="children"></slot>
      </div>
    `;
    }
};
XENavDrawerItem.styles = navDrawerItem;
__decorate([
    property({ type: String })
], XENavDrawerItem.prototype, "label", void 0);
__decorate([
    property({ type: String })
], XENavDrawerItem.prototype, "sublabel", void 0);
__decorate([
    property({ type: String })
], XENavDrawerItem.prototype, "href", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], XENavDrawerItem.prototype, "selected", void 0);
__decorate([
    state()
], XENavDrawerItem.prototype, "_hasLeadingIcon", void 0);
XENavDrawerItem = __decorate([
    customElement('xe-nav-drawer-item')
], XENavDrawerItem);
export { XENavDrawerItem };
