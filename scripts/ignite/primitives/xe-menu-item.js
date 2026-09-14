var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var XEMenuItem_1;
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { menuItem } from '@ignite/web/tokens/component';
// Import icon for submenu indicator
import '../../media/icon/xe-icon.js';
/**
 * Xcel Energy Menu Item Component
 *
 * Individual menu item with optional leading/trailing icons, sublabel, divider, and nested submenu.
 *
 * @element xe-menu-item
 *
 * @slot leading-icon - Optional leading icon
 * @slot trailing-icon - Optional trailing icon (typically chevron-right)
 * @slot submenu - Optional nested submenu (xe-menu with xe-menu-items)
 *
 * @property {string} label - Main label text
 * @property {string} sublabel - Optional sublabel text
 * @property {boolean} showSublabel - Whether to show the sublabel
 * @property {boolean} showDivider - Whether to show divider after item
 * @property {boolean} selected - Whether item is in selected state
 * @property {boolean} disabled - Whether item is disabled
 * @property {string} href - Optional URL for navigation
 *
 * @example
 * ```html
 * <xe-menu-item label="Account Settings">
 *   <xe-icon slot="leading-icon" icon="faUser" size="sm"></xe-icon>
 *   <xe-icon slot="trailing-icon" icon="faChevronRight" size="sm"></xe-icon>
 * </xe-menu-item>
 *
 * <!-- With nested submenu -->
 * <xe-menu-item label="Products">
 *   <xe-menu slot="submenu">
 *     <xe-menu-item label="Category 1"></xe-menu-item>
 *     <xe-menu-item label="Category 2"></xe-menu-item>
 *   </xe-menu>
 * </xe-menu-item>
 * ```
 */
let XEMenuItem = XEMenuItem_1 = class XEMenuItem extends LitElement {
    constructor() {
        super(...arguments);
        this.label = '';
        this.sublabel = '';
        this.showSublabel = false;
        this.showDivider = false;
        this.selected = false;
        this.disabled = false;
        this.align = 'left';
        this._submenuOpen = false;
        this._hasSubmenu = false;
        this._handleDocumentClick = (e) => {
            const path = e.composedPath();
            // Don't close if clicking on this element or any child menu items
            if (path.includes(this)) {
                return;
            }
            // Check if clicking inside a nested submenu
            const clickedSubmenu = path.find((el) => {
                return el.classList?.contains('nested-submenu');
            });
            // Only close if clicking completely outside
            if (!clickedSubmenu) {
                this._submenuOpen = false;
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._handleDocumentClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._handleDocumentClick);
        if (XEMenuItem_1._openMenuItem === this) {
            XEMenuItem_1._openMenuItem = null;
        }
    }
    async firstUpdated() {
        // Wait for updateComplete to be outside the update cycle
        await this.updateComplete;
        // Now safe to check slots and set state
        const submenuSlot = this.shadowRoot?.querySelector('slot[name="submenu"]');
        if (submenuSlot) {
            this._hasSubmenu = submenuSlot.assignedElements().length > 0;
        }
    }
    reset() {
        this._submenuOpen = false;
        if (XEMenuItem_1._openMenuItem === this)
            XEMenuItem_1._openMenuItem = null;
    }
    _handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._handleClick(e);
        }
        else if (e.key === 'Escape' && this._submenuOpen) {
            e.stopPropagation();
            this._submenuOpen = false;
            if (XEMenuItem_1._openMenuItem === this)
                XEMenuItem_1._openMenuItem = null;
        }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            e.stopPropagation();
            this._moveSiblingFocus(e.key === 'ArrowDown' ? 1 : -1, e.composedPath());
        }
        else if (e.key === 'ArrowRight' && this._hasSubmenu) {
            e.preventDefault();
            e.stopPropagation();
            if (!this._submenuOpen) {
                this._submenuOpen = true;
                XEMenuItem_1._openMenuItem = this;
                this.updateComplete.then(() => this._focusFirstNestedItem());
            }
        }
        else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            e.stopPropagation();
            const parentItem = this.parentElement?.parentElement;
            if (parentItem?.tagName.toLowerCase() === 'xe-menu-item') {
                parentItem.reset();
                parentItem.shadowRoot?.querySelector('[role="menuitem"]')?.focus();
            }
        }
    }
    _moveSiblingFocus(direction, path) {
        const parent = this.parentElement;
        if (!parent)
            return;
        const siblings = Array.from(parent.children).filter(el => el.tagName.toLowerCase() === 'xe-menu-item' && !el.hasAttribute('disabled'));
        const activeIndex = siblings.findIndex(el => path.includes(el));
        const next = activeIndex === -1
            ? (direction === 1 ? 0 : siblings.length - 1)
            : activeIndex + direction;
        const clamped = Math.max(0, Math.min(siblings.length - 1, next));
        siblings[clamped].shadowRoot?.querySelector('[role="menuitem"]')?.focus();
    }
    _focusFirstNestedItem() {
        const slot = this.shadowRoot?.querySelector('slot[name="submenu"]');
        const menu = slot?.assignedElements()[0];
        if (!menu)
            return;
        const firstItem = menu.querySelector('xe-menu-item:not([disabled])');
        firstItem?.shadowRoot?.querySelector('[role="menuitem"]')?.focus();
    }
    _handleClick(e) {
        if (this.disabled)
            return;
        if (this._hasSubmenu) {
            e.stopPropagation();
            // Close sibling menu items (same parent menu) but keep parent menus open
            if (XEMenuItem_1._openMenuItem && XEMenuItem_1._openMenuItem !== this) {
                // Check if the currently open item is a sibling (has same parent)
                const thisParent = this.parentElement;
                const openParent = XEMenuItem_1._openMenuItem.parentElement;
                if (thisParent === openParent) {
                    // They're siblings, close the other one
                    XEMenuItem_1._openMenuItem._submenuOpen = false;
                }
            }
            // Toggle this submenu
            this._submenuOpen = !this._submenuOpen;
            if (this._submenuOpen) {
                XEMenuItem_1._openMenuItem = this;
                this.updateComplete.then(() => this._focusFirstNestedItem());
            }
            else if (XEMenuItem_1._openMenuItem === this) {
                XEMenuItem_1._openMenuItem = null;
            }
        }
        else if (this.href) {
            window.location.href = this.href;
        }
    }
    render() {
        const itemClasses = [
            'menu-item',
            this.selected ? 'selected' : '',
            this._hasSubmenu ? 'has-submenu' : '',
            this._submenuOpen ? 'submenu-open' : '',
        ].filter(Boolean).join(' ');
        return html `
      <div class="menu-item-wrapper">
        <div
          class="${itemClasses}"
          @click=${this._handleClick}
          @keydown=${this._handleKeyDown}
          role="menuitem"
          tabindex="-1"
          aria-disabled=${this.disabled}
          aria-haspopup=${this._hasSubmenu ? 'menu' : 'false'}
          aria-expanded=${this._hasSubmenu ? String(this._submenuOpen) : 'false'}>

          <div class="menu-item-state-layer">
            <div class="menu-item-content">
              <slot name="leading-icon"></slot>

              <div class="menu-item-labels">
                <div class="menu-item-label">${this.label}</div>
                ${this.showSublabel ? html `
                  <div class="menu-item-sublabel">${this.sublabel}</div>
                ` : nothing}
              </div>

              ${this._hasSubmenu ? html `
                <xe-icon icon="faChevronRight" size="md"></xe-icon>
              ` : this.selected ? html `
                <xe-icon icon="faCheck" size="sm"></xe-icon>
              ` : html `
                <slot name="trailing-icon"></slot>
              `}
            </div>
          </div>

          ${this.showDivider ? html `
            <div class="menu-item-divider"></div>
          ` : nothing}
        </div>

        <!-- Always render submenu slot so willUpdate can detect content -->
        <div class="nested-submenu ${this._submenuOpen ? 'open' : ''}" ?inert=${!this._submenuOpen}>
          <slot name="submenu"></slot>
        </div>
      </div>
    `;
    }
};
XEMenuItem.styles = [menuItem];
// Static tracker for currently open menu item
XEMenuItem._openMenuItem = null;
__decorate([
    property({ type: String })
], XEMenuItem.prototype, "label", void 0);
__decorate([
    property({ type: String })
], XEMenuItem.prototype, "sublabel", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'show-sublabel' })
], XEMenuItem.prototype, "showSublabel", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'show-divider' })
], XEMenuItem.prototype, "showDivider", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], XEMenuItem.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], XEMenuItem.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], XEMenuItem.prototype, "align", void 0);
__decorate([
    property({ type: String })
], XEMenuItem.prototype, "href", void 0);
__decorate([
    state()
], XEMenuItem.prototype, "_submenuOpen", void 0);
__decorate([
    state()
], XEMenuItem.prototype, "_hasSubmenu", void 0);
XEMenuItem = XEMenuItem_1 = __decorate([
    customElement('xe-menu-item')
], XEMenuItem);
export { XEMenuItem };
