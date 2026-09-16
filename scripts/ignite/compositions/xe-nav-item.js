var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var XENavItem_1;
import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { navItem } from '@ignite/web/tokens/component';
// Import dependencies
import '@ignite/web/primitives/media/icon/xe-icon.js';
import '@ignite/web/primitives/layout/menu/xe-menu.js';
import '@ignite/web/primitives/layout/menu-item/xe-menu-item.js';
/**
 * Xcel Energy Nav Item Component
 *
 * A navigation item for use within xe-navbar with optional submenu support
 *
 * @element xe-nav-item
 *
 * @prop {boolean} active - Whether the nav item is currently active
 * @prop {string} content-theme - Theme override for overlay navbars ('light' | 'dark')
 * @prop {string} href - Optional URL for navigation (when no submenu)
 *
 * @slot - Nav item content (text)
 * @slot submenu - Optional submenu content (xe-menu with xe-menu-items)
 *
 * @example
 * ```html
 * <xe-nav-item>Home</xe-nav-item>
 * <xe-nav-item active>Current Page</xe-nav-item>
 *
 * <!-- With submenu -->
 * <xe-nav-item>
 *   Products
 *   <xe-menu slot="submenu" variant="filled">
 *     <xe-menu-item label="Category 1"></xe-menu-item>
 *     <xe-menu-item label="Category 2"></xe-menu-item>
 *   </xe-menu>
 * </xe-nav-item>
 * ```
 */
let XENavItem = XENavItem_1 = class XENavItem extends LitElement {
    constructor() {
        super(...arguments);
        this.active = false;
        this._submenuOpen = false;
        this._hasSubmenu = false;
        this._handleDocumentClick = (e) => {
            if (!e.composedPath().includes(this)) {
                this._closeMenu();
            }
        };
        this._handleFocusOut = (e) => {
            const related = e.relatedTarget;
            if (!related || !this._containsNode(related)) {
                this._closeMenu();
            }
        };
        this._handleKeyDown = (e) => {
            if (e.key === 'Escape' && this._submenuOpen) {
                e.stopPropagation();
                this._closeMenu();
                this.shadowRoot?.querySelector('button.nav-item')?.focus();
            }
            else if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && this._hasSubmenu && !this._submenuOpen) {
                e.preventDefault();
                if (XENavItem_1._openNavItem && XENavItem_1._openNavItem !== this) {
                    XENavItem_1._openNavItem._closeMenu();
                }
                this._submenuOpen = true;
                XENavItem_1._openNavItem = this;
                this.updateComplete.then(() => {
                    this._positionSubmenu();
                    this._focusFirstMenuItem();
                });
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
        if (XENavItem_1._openNavItem === this) {
            XENavItem_1._openNavItem = null;
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
    _positionSubmenu() {
        const container = this.shadowRoot?.querySelector('.submenu-container');
        if (!container)
            return;
        const navbar = this.closest('xe-navbar');
        if (!navbar)
            return;
        const navbarRow = navbar.shadowRoot?.querySelector('.navbar') ?? navbar;
        const referenceRect = navbarRow.getBoundingClientRect();
        const thisRect = this.getBoundingClientRect();
        container.style.top = `${referenceRect.bottom - thisRect.top - 12}px`;
    }
    _closeMenu() {
        this._submenuOpen = false;
        if (XENavItem_1._openNavItem === this)
            XENavItem_1._openNavItem = null;
        // Reset all nested xe-menu-items so the tree is fresh on next open
        const slot = this.shadowRoot?.querySelector('slot[name="submenu"]');
        const menu = slot?.assignedElements()[0];
        menu?.querySelectorAll('xe-menu-item').forEach(el => el.reset?.());
    }
    // Walk up through shadow host ancestors to check if a node is within this element.
    _containsNode(node) {
        let current = node;
        while (current) {
            if (current === this)
                return true;
            const root = current.getRootNode();
            current = root instanceof ShadowRoot ? root.host : current.parentElement;
        }
        return false;
    }
    _focusFirstMenuItem() {
        const slot = this.shadowRoot?.querySelector('slot[name="submenu"]');
        const menu = slot?.assignedElements()[0];
        if (!menu)
            return;
        const firstItem = menu.querySelector('xe-menu-item:not([disabled])');
        firstItem?.shadowRoot?.querySelector('[role="menuitem"]')?.focus();
    }
    _handleClick(e) {
        if (this._hasSubmenu) {
            e.preventDefault();
            e.stopPropagation();
            if (XENavItem_1._openNavItem && XENavItem_1._openNavItem !== this) {
                XENavItem_1._openNavItem._closeMenu();
            }
            this._submenuOpen = !this._submenuOpen;
            if (this._submenuOpen) {
                XENavItem_1._openNavItem = this;
                this.updateComplete.then(() => {
                    this._positionSubmenu();
                    this._focusFirstMenuItem();
                });
            }
            else {
                this._closeMenu();
            }
        }
        else if (this.href) {
            window.location.href = this.href;
        }
    }
    // Removed - rely only on slotchange event to avoid update-in-update warning
    render() {
        const classes = {
            'nav-item': true,
            'active': this.active,
            'has-submenu': this._hasSubmenu,
            'submenu-open': this._submenuOpen,
            ...(this.contentTheme && { [`content-theme-${this.contentTheme}`]: true }),
        };
        return html `
      <div class="nav-item-wrapper" @focusout=${this._handleFocusOut} @keydown=${this._handleKeyDown}>
        <button
          class=${classMap(classes)}
          type="button"
          aria-haspopup=${ifDefined(this._hasSubmenu ? 'menu' : undefined)}
          aria-expanded=${ifDefined(this._hasSubmenu ? String(this._submenuOpen) : undefined)}
          @click=${this._handleClick}>
          <slot></slot>
          ${this._hasSubmenu ? html `
            <xe-icon icon="faChevronDown" size="sm"></xe-icon>
          ` : nothing}
        </button>

        <div class="submenu-container ${this._submenuOpen ? 'open' : ''}" ?inert=${!this._submenuOpen}>
          <slot name="submenu"></slot>
        </div>
      </div>
    `;
    }
};
XENavItem.styles = navItem;
// Static tracker for currently open nav item
XENavItem._openNavItem = null;
__decorate([
    property({ type: Boolean, reflect: true })
], XENavItem.prototype, "active", void 0);
__decorate([
    property({ type: String, attribute: 'content-theme' })
], XENavItem.prototype, "contentTheme", void 0);
__decorate([
    property({ type: String })
], XENavItem.prototype, "href", void 0);
__decorate([
    state()
], XENavItem.prototype, "_submenuOpen", void 0);
__decorate([
    state()
], XENavItem.prototype, "_hasSubmenu", void 0);
XENavItem = XENavItem_1 = __decorate([
    customElement('xe-nav-item')
], XENavItem);
export { XENavItem };
