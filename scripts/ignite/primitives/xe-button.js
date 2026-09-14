var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { button } from '@ignite/web/tokens/component';
import '../../media/icon/xe-icon.js';
/**
 * Xcel Energy Button Component
 *
 * A from-scratch button implementation following Material 3 design principles
 * with Xcel Energy design tokens. Built without wrapping Material Web Components
 * to provide full styling control and avoid shadow DOM boundary issues.
 *
 * @element xe-button
 *
 * @prop {string} variant - Button color variant: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'accent' | 'static-light' | 'static-dark'
 * @prop {string} treatment - Button visual treatment: 'filled' | 'outlined' | 'text'
 * @prop {string} size - Button size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' (affects padding only, typography stays consistent)
 * @prop {string} size-mobile - Optional size override at mobile viewports (≤768px): 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
 * @prop {boolean} disabled - Whether the button is disabled
 * @prop {string} type - Button type: 'button' | 'submit' | 'reset'
 * @prop {string} href - Optional href for link-style buttons
 * @prop {string} target - Link target (when href is provided)
 * @prop {string} aria-label - Accessible label forwarded to the inner button/anchor
 * @prop {string} aria-haspopup - Forwarded to the inner button/anchor; use when the button triggers a popup/menu
 * @prop {string} aria-expanded - Forwarded to the inner button/anchor; reflects open/closed state of a controlled popup
 * @prop {string} leadingIcon - Font Awesome Pro icon name for leading icon (e.g., 'faHeart', 'faUser')
 * @prop {string} trailingIcon - Font Awesome Pro icon name for trailing icon
 * @prop {boolean} expand - Makes button span full width of container, overriding horizontal padding
 *
 * @slot - Button content (text)
 * @slot icon - Leading icon slot
 * @slot trailing-icon - Trailing icon slot
 *
 * @example
 * ```html
 * <!-- Filled buttons -->
 * <xe-button variant="primary" treatment="filled">Primary Action</xe-button>
 * <xe-button variant="secondary" treatment="filled">Secondary Action</xe-button>
 *
 * <!-- Outlined buttons -->
 * <xe-button variant="primary" treatment="outlined">Primary Outline</xe-button>
 * <xe-button variant="neutral" treatment="outlined">Neutral Outline</xe-button>
 *
 * <!-- Text buttons -->
 * <xe-button variant="accent" treatment="text">Accent Text</xe-button>
 * ```
 */
let XEButton = class XEButton extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = 'primary';
        this.treatment = 'filled';
        this.size = 'md';
        this._isMobile = false;
        this._mqlListener = (e) => { this._isMobile = e.matches; };
        this.disabled = false;
        this.type = 'button';
        this.expand = false;
        // Managed outside Lit's property system so host attributes can be stripped
        // without a feedback loop — a generic-role host prohibits these attributes.
        this._ariaLabel = null;
        this._ariaHaspopup = null;
        this._ariaExpanded = null;
    }
    connectedCallback() {
        super.connectedCallback();
        this._mql = window.matchMedia('(max-width: 768px)');
        this._isMobile = this._mql.matches;
        this._mql.addEventListener('change', this._mqlListener);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._mql?.removeEventListener('change', this._mqlListener);
    }
    static get observedAttributes() {
        return [...(super.observedAttributes ?? []), 'aria-label', 'aria-haspopup', 'aria-expanded'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'aria-label' || name === 'aria-haspopup' || name === 'aria-expanded') {
            if (newVal !== null) {
                if (name === 'aria-label')
                    this._ariaLabel = newVal;
                if (name === 'aria-haspopup')
                    this._ariaHaspopup = newVal;
                if (name === 'aria-expanded')
                    this._ariaExpanded = newVal;
                this.removeAttribute(name);
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
        const effectiveSize = (this._isMobile && this.sizeMobile) ? this.sizeMobile : this.size;
        const hasLeadingIcon = !!(this.leadingIcon || this.shadowRoot?.querySelector('slot[name="icon"]')?.assignedElements().length);
        const hasTrailingIcon = !!(this.trailingIcon || this.shadowRoot?.querySelector('slot[name="trailing-icon"]')?.assignedElements().length);
        const classes = {
            button: true,
            [this.variant]: true,
            [this.treatment]: true,
            [effectiveSize]: true,
            'has-both-icons': hasLeadingIcon && hasTrailingIcon,
            'expand': this.expand,
        };
        const commonContent = html `
      <span class="content">
        ${this.leadingIcon ? html `<span class="icon"><xe-icon icon=${this.leadingIcon} size="sm"></xe-icon></span>` : nothing}
        <slot name="icon"></slot>
        <span class="text">
          <slot></slot>
        </span>
        <slot name="trailing-icon"></slot>
        ${this.trailingIcon ? html `<span class="trailing-icon"><xe-icon icon=${this.trailingIcon} size="sm"></xe-icon></span>` : nothing}
      </span>
    `;
        // Render as link if href is provided and not disabled
        if (this.href && !this.disabled) {
            return html `
        <a
          href=${this.href}
          target=${this.target || nothing}
          class=${classMap(classes)}
          role="button"
          aria-label=${this._ariaLabel || nothing}
          aria-haspopup=${this._ariaHaspopup || nothing}
          aria-expanded=${this._ariaExpanded || nothing}
          @click=${this._handleClick}>
          ${commonContent}
        </a>
      `;
        }
        // Render as button
        return html `
      <button
        type=${this.type}
        ?disabled=${this.disabled}
        class=${classMap(classes)}
        aria-label=${this._ariaLabel || nothing}
        aria-haspopup=${this._ariaHaspopup || nothing}
        aria-expanded=${this._ariaExpanded || nothing}
        @click=${this._handleClick}>
        ${commonContent}
      </button>
    `;
    }
};
XEButton.styles = button;
__decorate([
    property({ type: String })
], XEButton.prototype, "variant", void 0);
__decorate([
    property({ type: String })
], XEButton.prototype, "treatment", void 0);
__decorate([
    property({ type: String })
], XEButton.prototype, "size", void 0);
__decorate([
    property({ type: String, attribute: 'size-mobile' })
], XEButton.prototype, "sizeMobile", void 0);
__decorate([
    state()
], XEButton.prototype, "_isMobile", void 0);
__decorate([
    property({ type: Boolean })
], XEButton.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], XEButton.prototype, "type", void 0);
__decorate([
    property({ type: String })
], XEButton.prototype, "href", void 0);
__decorate([
    property({ type: String })
], XEButton.prototype, "target", void 0);
__decorate([
    property({ type: String, attribute: 'leading-icon' })
], XEButton.prototype, "leadingIcon", void 0);
__decorate([
    property({ type: String, attribute: 'trailing-icon' })
], XEButton.prototype, "trailingIcon", void 0);
__decorate([
    property({ type: Boolean })
], XEButton.prototype, "expand", void 0);
XEButton = __decorate([
    customElement('xe-button')
], XEButton);
export { XEButton };
