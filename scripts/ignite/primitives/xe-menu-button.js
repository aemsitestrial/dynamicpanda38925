var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { menuButton } from '@ignite/web/tokens/component';
import '../button/xe-button.js';
import '../icon-button/xe-icon-button.js';
import '../../layout/menu/xe-menu.js';
import '../../media/icon/xe-icon.js';
/**
 * Xcel Energy Menu Button Composition
 *
 * A button or icon button that opens a menu. Encapsulates the trigger/menu
 * open-close pattern for reuse across any button-triggered menu interaction.
 *
 * @element xe-menu-button
 *
 * @prop {string} trigger - Trigger style: 'button' | 'icon-button'
 * @prop {string} label - Button label text (used when trigger='button', also the aria-label for icon-button)
 * @prop {string} icon - Icon name for the trigger button leading icon (optional for button, required for icon-button)
 * @prop {string} size - Button size: 'sm' | 'md' | 'lg' (ignored when trigger='icon-button')
 * @prop {string} treatment - Visual treatment: 'filled' | 'outlined' | 'text' (button) | 'default' | 'filled' | 'outlined' (icon-button)
 * @prop {string} variant - Button variant: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'accent' (ignored when trigger='icon-button')
 * @prop {string} menuVariant - Menu visual variant: 'filled' | 'transparent'
 * @prop {string} menuAlign - Menu alignment relative to trigger: 'start' | 'end' (default: 'start')
 * @prop {string} menuWidth - Optional fixed width for the menu (e.g. '200px'). Useful when the trigger is narrower than the desired menu width.
 * @prop {boolean} disabled - Whether the trigger is disabled
 *
 * @slot - xe-menu-item elements to populate the menu
 *
 * @fires xe-menu-button-open - Fired when the menu opens
 * @fires xe-menu-button-close - Fired when the menu closes
 *
 * @example
 * ```html
 * <xe-menu-button label="Actions" icon="faBolt" trigger="button" treatment="outlined">
 *   <xe-menu-item label="Edit"></xe-menu-item>
 *   <xe-menu-item label="Delete"></xe-menu-item>
 * </xe-menu-button>
 *
 * <xe-menu-button label="More options" icon="faEllipsis" trigger="icon-button">
 *   <xe-menu-item label="Share"></xe-menu-item>
 *   <xe-menu-item label="Download"></xe-menu-item>
 * </xe-menu-button>
 * ```
 */
let XEMenuButton = class XEMenuButton extends LitElement {
    constructor() {
        super(...arguments);
        this.trigger = 'button';
        this.label = '';
        this.icon = '';
        this.size = 'md';
        this.treatment = 'text';
        this.variant = 'neutral';
        this.menuVariant = 'filled';
        this.menuAlign = 'start';
        this._disabled = false;
        this._open = false;
        this._handleFocusOut = (e) => {
            const related = e.relatedTarget;
            if (!related || !this._containsNode(related)) {
                this._closeMenu();
            }
        };
        this._handleKeyDown = (e) => {
            if (e.key === 'Escape' && this._open) {
                e.stopPropagation();
                this._closeMenu(true);
            }
            else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && this._open) {
                e.preventDefault();
                e.stopPropagation();
                this._moveFocus(e.key === 'ArrowDown' ? 1 : -1, e.composedPath());
            }
            else if (e.key === 'Tab' && this._open) {
                e.preventDefault();
                const items = Array.from(this.children).filter(el => el.tagName.toLowerCase() === 'xe-menu-item' && !el.hasAttribute('disabled'));
                if (!items.length)
                    return;
                const path = e.composedPath();
                const activeIndex = items.findIndex(item => path.includes(item));
                const direction = e.shiftKey ? -1 : 1;
                const next = (activeIndex === -1 ? 0 : (activeIndex + direction + items.length) % items.length);
                items[next].shadowRoot?.querySelector('[role="menuitem"]')?.focus();
            }
        };
        this._toggleMenu = () => {
            this._open ? this._closeMenu(true) : this._openMenu();
        };
    }
    get disabled() { return this._disabled; }
    set disabled(v) {
        this._disabled = v;
        v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
        this.requestUpdate('disabled');
    }
    _containsNode(node) {
        let current = node;
        while (current) {
            if (current === this)
                return true;
            // this.contains() handles the case where current is a light DOM descendant
            // of this regardless of which shadow scope the traversal is currently in.
            // Without this, getRootNode() can jump past this element to a higher shadow
            // host when xe-menu-button is nested inside another component's shadow DOM.
            if (this.contains(current))
                return true;
            const root = current.getRootNode();
            current = root instanceof ShadowRoot ? root.host : current.parentElement;
        }
        return false;
    }
    _moveFocus(direction, path) {
        const items = Array.from(this.children).filter(el => el.tagName.toLowerCase() === 'xe-menu-item' && !el.hasAttribute('disabled'));
        if (!items.length)
            return;
        const activeIndex = items.findIndex(item => path.includes(item));
        const next = activeIndex === -1
            ? (direction === 1 ? 0 : items.length - 1)
            : activeIndex + direction;
        const clamped = Math.max(0, Math.min(items.length - 1, next));
        items[clamped].shadowRoot?.querySelector('[role="menuitem"]')?.focus();
    }
    _openMenu() {
        this._open = true;
        this.dispatchEvent(new CustomEvent('xe-menu-button-open', { bubbles: true, composed: true }));
        this.updateComplete.then(() => {
            const firstItem = this.querySelector('xe-menu-item:not([disabled])');
            firstItem?.shadowRoot?.querySelector('[role="menuitem"]')?.focus();
        });
    }
    _closeMenu(restoreFocus = false) {
        if (!this._open)
            return;
        this._open = false;
        this.querySelectorAll('xe-menu-item').forEach(el => el.reset?.());
        this.dispatchEvent(new CustomEvent('xe-menu-button-close', { bubbles: true, composed: true }));
        if (restoreFocus) {
            this._getTriggerEl()?.focus();
        }
    }
    _getTriggerEl() {
        const host = this.shadowRoot?.querySelector('xe-button, xe-icon-button');
        if (!host)
            return null;
        return host.shadowRoot?.querySelector('button') ?? host;
    }
    _renderTrigger() {
        if (this.trigger === 'icon-button') {
            return html `
        <xe-icon-button
          treatment="${this.treatment === 'filled' ? 'filled' : this.treatment === 'outlined' ? 'outlined' : 'default'}"
          ?disabled="${this.disabled}"
          aria-label="${this.label}"
          aria-expanded="${this._open}"
          aria-haspopup="true"
          @click="${this._toggleMenu}">
          <xe-icon icon="${this.icon}" size="sm"></xe-icon>
        </xe-icon-button>
      `;
        }
        return html `
      <xe-button
        size="${this.size}"
        treatment="${this.treatment}"
        variant="${this.variant}"
        ?disabled="${this.disabled}"
        aria-label="${this.label}"
        aria-expanded="${this._open}"
        aria-haspopup="true"
        @click="${this._toggleMenu}">
        ${this.icon ? html `<xe-icon slot="icon" icon="${this.icon}" size="sm"></xe-icon>` : ''}
        ${this.label}
      </xe-button>
    `;
    }
    render() {
        return html `
      ${this._open ? html `<div class="backdrop" @pointerdown="${() => this._closeMenu()}"></div>` : nothing}
      <div class="menu-button" @focusout=${this._handleFocusOut} @keydown=${this._handleKeyDown}>
        ${this._renderTrigger()}
        ${this._open ? html `
          <div class="menu ${this.menuAlign === 'end' ? 'align-end' : ''}"
               @click="${(e) => {
            if (e.composedPath().some(el => el instanceof Element && el.tagName.toLowerCase() === 'xe-menu-item')) {
                this._closeMenu(true);
            }
        }}">
            <xe-menu variant="${this.menuVariant}" .width="${this.menuWidth}">
              <slot></slot>
            </xe-menu>
          </div>
        ` : nothing}
      </div>
    `;
    }
};
XEMenuButton.styles = [menuButton];
__decorate([
    property({ type: String })
], XEMenuButton.prototype, "trigger", void 0);
__decorate([
    property({ type: String })
], XEMenuButton.prototype, "label", void 0);
__decorate([
    property({ type: String })
], XEMenuButton.prototype, "icon", void 0);
__decorate([
    property({ type: String })
], XEMenuButton.prototype, "size", void 0);
__decorate([
    property({ type: String })
], XEMenuButton.prototype, "treatment", void 0);
__decorate([
    property({ type: String })
], XEMenuButton.prototype, "variant", void 0);
__decorate([
    property({ type: String, attribute: 'menu-variant' })
], XEMenuButton.prototype, "menuVariant", void 0);
__decorate([
    property({ type: String, attribute: 'menu-align' })
], XEMenuButton.prototype, "menuAlign", void 0);
__decorate([
    property({ type: String, attribute: 'menu-width' })
], XEMenuButton.prototype, "menuWidth", void 0);
__decorate([
    property({ type: Boolean })
], XEMenuButton.prototype, "disabled", null);
__decorate([
    state()
], XEMenuButton.prototype, "_open", void 0);
XEMenuButton = __decorate([
    customElement('xe-menu-button')
], XEMenuButton);
export { XEMenuButton };
