var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement } from 'lit';
import { html as staticHtml, literal } from 'lit/static-html.js';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { bannerColumn } from '@ignite/web/tokens/component';
/**
 * Banner Column Component
 *
 * Used inside <xe-banner> to create column layouts.
 * Named slots for icon, heading, message, and action — wrappers are only
 * rendered in the DOM when the slot has assigned content.
 *
 * @element xe-banner-column
 *
 * @prop {string} align - Content alignment: 'left' | 'center' | 'right'
 * @prop {number} headingLevel - Heading level (1–6) for the banner heading. Defaults to 2. Set to match the page heading hierarchy.
 *
 * @slot icon - Optional icon displayed above the heading
 * @slot heading - Primary heading text (rendered inside the heading element determined by headingLevel)
 * @slot message - Supporting message text
 * @slot action - Call-to-action content (buttons, links)
 *
 * @example
 * ```html
 * <xe-banner variant="announcement">
 *   <xe-banner-column align="left">
 *     <xe-icon slot="icon" icon="faHeadset" size="lg"></xe-icon>
 *     <div slot="heading" class="heading">Title</div>
 *     <div slot="message" class="message">Message</div>
 *   </xe-banner-column>
 *   <xe-banner-column align="right">
 *     <xe-button slot="action">Learn More</xe-button>
 *   </xe-banner-column>
 * </xe-banner>
 * ```
 */
let XEBannerColumn = class XEBannerColumn extends LitElement {
    constructor() {
        super(...arguments);
        this.align = 'left';
        this.expand = false;
        this.headingLevel = 2;
        this._hasIcon = false;
        this._hasHeading = false;
        this._hasMessage = false;
        this._hasAction = false;
    }
    _handleSlotChange(e) {
        const slot = e.target;
        const hasNodes = slot.assignedElements({ flatten: true }).length > 0;
        switch (slot.name) {
            case 'icon':
                this._hasIcon = hasNodes;
                break;
            case 'heading':
                this._hasHeading = hasNodes;
                break;
            case 'message':
                this._hasMessage = hasNodes;
                break;
            case 'action':
                this._hasAction = hasNodes;
                break;
        }
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
      <div class="column align-${this.align}">
        ${this._hasIcon ? html `
          <div class="icon-wrapper">
            <slot name="icon" @slotchange="${this._handleSlotChange}"></slot>
          </div>
        ` : html `<slot name="icon" @slotchange="${this._handleSlotChange}"></slot>`}
        ${this._hasHeading ? staticHtml `
          <${tag} class="heading-wrapper ${this._hasIcon ? 'has-above' : ''}">
            <slot name="heading" @slotchange="${this._handleSlotChange}"></slot>
          </${tag}>
        ` : html `<slot name="heading" @slotchange="${this._handleSlotChange}"></slot>`}
        ${this._hasMessage ? html `
          <div class="message-wrapper ${this._hasIcon || this._hasHeading ? 'has-above' : ''}">
            <slot name="message" @slotchange="${this._handleSlotChange}"></slot>
          </div>
        ` : html `<slot name="message" @slotchange="${this._handleSlotChange}"></slot>`}
        ${this._hasAction ? html `
          <div class="action-wrapper ${this._hasIcon || this._hasHeading || this._hasMessage ? 'has-above' : ''}">
            <slot name="action" @slotchange="${this._handleSlotChange}"></slot>
          </div>
        ` : html `<slot name="action" @slotchange="${this._handleSlotChange}"></slot>`}
      </div>
    `;
    }
};
XEBannerColumn.styles = bannerColumn;
__decorate([
    property({ type: String })
], XEBannerColumn.prototype, "align", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], XEBannerColumn.prototype, "expand", void 0);
__decorate([
    property({ type: Number, attribute: 'heading-level' })
], XEBannerColumn.prototype, "headingLevel", void 0);
__decorate([
    state()
], XEBannerColumn.prototype, "_hasIcon", void 0);
__decorate([
    state()
], XEBannerColumn.prototype, "_hasHeading", void 0);
__decorate([
    state()
], XEBannerColumn.prototype, "_hasMessage", void 0);
__decorate([
    state()
], XEBannerColumn.prototype, "_hasAction", void 0);
XEBannerColumn = __decorate([
    customElement('xe-banner-column')
], XEBannerColumn);
export { XEBannerColumn };
