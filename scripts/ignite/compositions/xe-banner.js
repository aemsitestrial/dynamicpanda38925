var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { banner } from '@ignite/web/tokens/component';
import './xe-banner-column.js';
// Re-export for TypeScript users
export { XEBannerColumn } from './xe-banner-column.js';
/**
 * Xcel Energy Banner Component
 *
 * A full-width, page-level banner for prominent announcements, alerts,
 * and calls-to-action. Use <xe-banner-column> children to create layouts.
 *
 * @element xe-banner
 *
 * @prop {string} size - Banner size controlling vertical padding: 'compact' | 'comfortable' | 'spacious' | 'generous'
 * @prop {string} background - Background color variant: 'default' | 'subtle' | 'muted'
 *
 * @slot - Banner columns (xe-banner-column elements)
 *
 * @example
 * ```html
 * <!-- Single column -->
 * <xe-banner>
 *   <xe-banner-column align="center">
 *     <xe-icon slot="icon" icon="faLeaf" size="lg"></xe-icon>
 *     <div slot="heading" class="heading">Title</div>
 *     <div slot="message" class="message">Message content here.</div>
 *     <xe-button slot="action">Learn More</xe-button>
 *   </xe-banner-column>
 * </xe-banner>
 *
 * <!-- Multi-column -->
 * <xe-banner>
 *   <xe-banner-column align="left">
 *     <div slot="heading" class="heading">Title</div>
 *     <div slot="message" class="message">Message</div>
 *   </xe-banner-column>
 *   <xe-banner-column align="right">
 *     <xe-button slot="action">Action</xe-button>
 *   </xe-banner-column>
 * </xe-banner>
 * ```
 */
let XEBanner = class XEBanner extends LitElement {
    constructor() {
        super(...arguments);
        this.size = 'generous';
        this.background = 'default';
    }
    render() {
        return html `
      <div
        class="banner ${this.size}"
        role="status"
        aria-live="polite">
        <slot></slot>
      </div>
    `;
    }
};
XEBanner.styles = banner;
__decorate([
    property({ type: String })
], XEBanner.prototype, "size", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEBanner.prototype, "background", void 0);
XEBanner = __decorate([
    customElement('xe-banner')
], XEBanner);
export { XEBanner };
