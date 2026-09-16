var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { iconButton } from '@ignite/web/tokens/component';
import '../../media/icon/xe-icon.js';
/**
 * Xcel Energy Icon Button Component
 *
 * Icon buttons help people take minor actions with one tap. When `href` is
 * provided the component renders an `<a>` element instead of `<button>`.
 *
 * - **Default**: Low-emphasis for lowest priority actions
 * - **Fill**: High-emphasis for important, final actions
 * - **Outline**: Medium-emphasis for important but secondary actions
 *
 * @element xe-icon-button
 *
 * @prop {string} treatment - Visual treatment ('default' | 'filled' | 'outlined')
 * @prop {string} href - When set, renders an <a> instead of <button>
 * @prop {string} target - Anchor target (e.g. '_blank'); only used with href
 * @prop {boolean} disabled - Whether the button is disabled
 * @prop {string} aria-label - Accessible label (required)
 *
 * @slot - Icon content (use xe-icon component)
 *
 * @example
 * ```html
 * <xe-icon-button aria-label="Settings">
 *   <xe-icon icon="faGear"></xe-icon>
 * </xe-icon-button>
 *
 * <xe-icon-button href="https://facebook.com/xcelenergy" target="_blank"
 *   aria-label="Xcel Energy on Facebook (opens in a new window)">
 *   <xe-icon icon="faSquareFacebook"></xe-icon>
 * </xe-icon-button>
 * ```
 */
let XEIconButton = class XEIconButton extends LitElement {
    constructor() {
        super(...arguments);
        // Managed outside Lit's property system so the host attribute can be stripped
        // without triggering a feedback loop back through attributeChangedCallback.
        this._ariaLabel = null;
        this.treatment = 'default';
        this.size = 'md';
        this.href = '';
        this.target = '';
        this.disabled = false;
    }
    static get observedAttributes() {
        return [...(super.observedAttributes ?? []), 'aria-label'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'aria-label') {
            // Only capture non-null values — the removal we trigger below fires this
            // callback again with null, and we must not overwrite the stored value.
            if (newVal !== null) {
                this._ariaLabel = newVal;
                this.removeAttribute('aria-label');
                this.requestUpdate();
            }
            return;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    _handleClick(e) {
        if (this.disabled) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    render() {
        const classes = {
            'icon-button': true,
            [this.treatment]: true,
        };
        const inner = html `
      <div class="icon-button-container">
        <div class="icon-button-state-layer">
          <slot></slot>
        </div>
      </div>
    `;
        if (this.href) {
            return html `
        <a
          class=${classMap(classes)}
          href=${this.href}
          target=${this.target || nothing}
          rel=${this.target === '_blank' ? 'noopener noreferrer' : nothing}
          aria-label=${this._ariaLabel || nothing}
          @click=${this._handleClick}>
          ${inner}
        </a>
      `;
        }
        return html `
      <button
        class=${classMap(classes)}
        type="button"
        ?disabled=${this.disabled}
        aria-label=${this._ariaLabel || nothing}
        @click=${this._handleClick}>
        ${inner}
      </button>
    `;
    }
};
XEIconButton.styles = iconButton;
__decorate([
    property({ type: String, reflect: true })
], XEIconButton.prototype, "treatment", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEIconButton.prototype, "size", void 0);
__decorate([
    property({ type: String })
], XEIconButton.prototype, "href", void 0);
__decorate([
    property({ type: String })
], XEIconButton.prototype, "target", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], XEIconButton.prototype, "disabled", void 0);
XEIconButton = __decorate([
    customElement('xe-icon-button')
], XEIconButton);
export { XEIconButton };
