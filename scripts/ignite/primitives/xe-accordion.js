var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { html as staticHtml, literal } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { accordion } from '@ignite/web/tokens/component';
/**
 * Xcel Energy Accordion Component
 *
 * An expandable/collapsible content panel for organizing information
 * in a space-efficient manner.
 *
 * @element xe-accordion
 *
 * @prop {boolean} expanded - Whether the accordion is expanded
 * @prop {string} heading - Accordion heading text
 * @prop {number} headingLevel - Heading level (1–6) for the accordion title. Defaults to 3.
 * @prop {boolean} disabled - Whether the accordion is disabled
 *
 * @slot - Accordion content
 * @slot heading - Custom heading content
 *
 * @fires xe-accordion-toggle - Fired when accordion is toggled (detail: { expanded: boolean })
 *
 * @example
 * ```html
 * <xe-accordion heading="Section Title">
 *   <p>Accordion content goes here...</p>
 * </xe-accordion>
 * ```
 */
let XEAccordion = class XEAccordion extends LitElement {
    constructor() {
        super(...arguments);
        this.expanded = false;
        this.heading = '';
        this.leadingIcon = '';
        this.headingLevel = 3;
        this.disabled = false;
    }
    _handleToggle() {
        if (this.disabled)
            return;
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent('xe-accordion-toggle', {
            bubbles: true,
            composed: true,
            detail: { expanded: this.expanded },
        }));
    }
    render() {
        const level = Math.min(Math.max(this.headingLevel, 1), 6);
        const tag = level === 1 ? literal `h1`
            : level === 2 ? literal `h2`
                : level === 3 ? literal `h3`
                    : level === 4 ? literal `h4`
                        : level === 5 ? literal `h5`
                            : literal `h6`;
        return staticHtml `
      <div class="accordion">
        <${tag} class="heading">
          <button
            class="header"
            ?disabled=${this.disabled}
            aria-expanded="${this.expanded}"
            @click=${this._handleToggle}>
            <div class="heading-content">
              ${this.leadingIcon ? html `<xe-icon class="leading-icon" icon="${this.leadingIcon}" size="sm"></xe-icon>` : ''}
              <slot name="heading">
                <span class="heading-text">${this.heading}</span>
              </slot>
            </div>
            <xe-icon
              class="expand-icon"
              icon="faChevronDown"
              size="sm">
            </xe-icon>
          </button>
        </${tag}>
        <div class="content" ?hidden=${!this.expanded}>
          <slot></slot>
        </div>
      </div>
    `;
    }
};
XEAccordion.styles = accordion;
__decorate([
    property({ type: Boolean })
], XEAccordion.prototype, "expanded", void 0);
__decorate([
    property({ type: String })
], XEAccordion.prototype, "heading", void 0);
__decorate([
    property({ type: String })
], XEAccordion.prototype, "leadingIcon", void 0);
__decorate([
    property({ type: Number, attribute: 'heading-level' })
], XEAccordion.prototype, "headingLevel", void 0);
__decorate([
    property({ type: Boolean })
], XEAccordion.prototype, "disabled", void 0);
XEAccordion = __decorate([
    customElement('xe-accordion')
], XEAccordion);
export { XEAccordion };
