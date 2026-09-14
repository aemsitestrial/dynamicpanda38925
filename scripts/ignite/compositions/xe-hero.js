var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hero } from '@ignite/web/tokens/component';
/**
 * Xcel Energy Hero Component
 *
 * A full-width hero section with background image, title, optional sublabel, and optional actions.
 * Introduces the page with clear messaging and guides next steps.
 *
 * @element xe-hero
 *
 * @prop {string} image - Background image URL
 * @prop {string} alt - Alt text for background image (for accessibility)
 * @prop {string} title - Hero title text (rendered as h1)
 * @prop {string} sublabel - Optional supporting text below title
 * @prop {string} height - Height variant: 'responsive' | 'tall' | 'standard' | 'compact'
 * @prop {string} alignment - Content alignment: 'center' | 'left' | 'bottom-center'
 * @prop {string} imagePosition - Background image focal point: 'center' | 'top' | 'bottom'
 *
 * @slot actions - Action buttons (typically 2 buttons)
 *
 * @example
 * ```html
 * <xe-hero
 *   image="/images/hero.jpg"
 *   alt="Power lines against mountain backdrop"
 *   title="POWERING COLORADO"
 *   sublabel="Clean energy for a sustainable future"
 *   height="tall"
 *   alignment="center">
 *   <div slot="actions">
 *     <xe-button variant="primary" treatment="filled">Get Started</xe-button>
 *     <xe-button variant="neutral" treatment="outlined">Learn More</xe-button>
 *   </div>
 * </xe-hero>
 * ```
 */
let XEHero = class XEHero extends LitElement {
    constructor() {
        super(...arguments);
        this.image = '';
        this.alt = '';
        this.title = '';
        this.sublabel = '';
        this.height = 'responsive';
        this.alignment = 'center';
        this.imagePosition = 'center';
    }
    _onActionsSlotChange(e) {
        const slot = e.target;
        const hasActions = slot.assignedElements({ flatten: true }).length > 0;
        this.toggleAttribute('no-actions', !hasActions);
    }
    render() {
        return html `
      <div class="hero">
        <div
          class="hero-image"
          role="img"
          aria-label="${this.alt}"
          style="background-image: url('${this.image}')">
        </div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-header">
            ${this.title ? html `<h1 class="hero-title">${this.title}</h1>` : ''}
            ${this.sublabel ? html `<p class="hero-sublabel">${this.sublabel}</p>` : ''}
          </div>
          <div class="hero-actions">
            <slot name="actions" @slotchange="${this._onActionsSlotChange}"></slot>
          </div>
        </div>
      </div>
    `;
    }
};
XEHero.styles = hero;
__decorate([
    property({ type: String })
], XEHero.prototype, "image", void 0);
__decorate([
    property({ type: String })
], XEHero.prototype, "alt", void 0);
__decorate([
    property({ type: String })
], XEHero.prototype, "title", void 0);
__decorate([
    property({ type: String })
], XEHero.prototype, "sublabel", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEHero.prototype, "height", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEHero.prototype, "alignment", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'image-position' })
], XEHero.prototype, "imagePosition", void 0);
XEHero = __decorate([
    customElement('xe-hero')
], XEHero);
export { XEHero };
