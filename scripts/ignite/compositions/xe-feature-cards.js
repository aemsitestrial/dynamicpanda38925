var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { featureCards } from '@ignite/web/tokens/component';
import '@ignite/web/primitives/layout/card-grid/xe-card-grid.js';
import '@ignite/web/primitives/layout/carousel/xe-carousel.js';
/**
 * `<xe-feature-cards>` is a section-level composition that wraps a card grid
 * with a heading, optional subheading, and a themed background.
 *
 * Slot `<xe-card>` elements directly. Set `columns` to lock the grid to a specific
 * column count; when omitted the inner grid uses responsive `auto-fit` sizing.
 *
 * @element xe-feature-cards
 *
 * @prop {string} heading - Section heading
 * @prop {string} subheading - Optional supporting text beneath the heading
 * @prop {string} headerAlign - Heading alignment: 'left' | 'center' (default: 'left')
 * @prop {string} background - Section background: 'default' | 'subtle' | 'muted' (default: 'default')
 * @prop {number} columns - Explicit column count passed to the inner card grid (optional)
 *
 * @slot - Section content (xe-card elements)
 *
 * @example
 * ```html
 * <xe-feature-cards heading="Our Services" columns="3">
 *   <xe-card variant="surface" treatment="filled">
 *     <h3 slot="title">Billing</h3>
 *   </xe-card>
 *   <xe-card variant="surface" treatment="filled">
 *     <h3 slot="title">Outages</h3>
 *   </xe-card>
 *   <xe-card variant="surface" treatment="filled">
 *     <h3 slot="title">Save Energy</h3>
 *   </xe-card>
 * </xe-feature-cards>
 * ```
 */
let XEFeatureCards = class XEFeatureCards extends LitElement {
    constructor() {
        super(...arguments);
        this.heading = '';
        this.subheading = '';
        this.headerAlign = 'left';
        this.background = 'default';
    }
    render() {
        const useCarousel = this.mobileLayout === 'carousel';
        return html `
      <div class="feature-cards">
        ${this.heading ? html `
          <div class="section-header">
            <h2 class="section-heading">${this.heading}</h2>
            ${this.subheading ? html `<p class="section-subheading">${this.subheading}</p>` : ''}
          </div>
        ` : ''}
        ${useCarousel
            ? html `<xe-carousel class="cards-carousel" desktop-layout="grid" style="--xe-carousel-columns: ${this.columns ?? 3}"><slot></slot></xe-carousel>`
            : html `<xe-card-grid .columns=${this.columns}><slot></slot></xe-card-grid>`}
      </div>
    `;
    }
};
XEFeatureCards.styles = featureCards;
__decorate([
    property({ type: String })
], XEFeatureCards.prototype, "heading", void 0);
__decorate([
    property({ type: String })
], XEFeatureCards.prototype, "subheading", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'header-align' })
], XEFeatureCards.prototype, "headerAlign", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEFeatureCards.prototype, "background", void 0);
__decorate([
    property({ type: Number })
], XEFeatureCards.prototype, "columns", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'mobile-layout' })
], XEFeatureCards.prototype, "mobileLayout", void 0);
XEFeatureCards = __decorate([
    customElement('xe-feature-cards')
], XEFeatureCards);
export { XEFeatureCards };
