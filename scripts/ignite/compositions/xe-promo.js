var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { promo } from '@ignite/web/tokens/component';
/**
 * `<xe-promo>` is a two-column promotional section: editorial content (title,
 * body, actions) on the left and a media slot on the right, set over a
 * decorative background.
 *
 * @element xe-promo
 *
 * @prop {string} title - Section heading (renders in shadow DOM with display/sm type style)
 * @prop {'default' | 'subtle' | 'muted'} background - Background color variant
 *
 * @slot background-image - Optional decorative background element (e.g. brand illustration), centered behind the content
 * @slot title - Heading content (used when rich HTML is needed; prefer the `title` prop for plain text)
 * @slot - Body / supporting text
 * @slot actions - Call-to-action buttons
 * @slot media - Supporting image or other media (right column)
 */
let XEPromo = class XEPromo extends LitElement {
    constructor() {
        super(...arguments);
        this.title = '';
        this.background = 'default';
        this.hideMediaOnMobile = false;
    }
    render() {
        return html `
      <div class="promo">
        <div class="promo-background">
          <slot name="background-image"></slot>
        </div>
        <div class="promo-grid">
          <div class="promo-content">
            ${this.title ? html `<h2 class="promo-title">${this.title}</h2>` : nothing}
            <slot name="title"></slot>
            <slot></slot>
            <slot name="actions"></slot>
          </div>
          <div class="promo-media">
            <slot name="media"></slot>
          </div>
        </div>
      </div>
    `;
    }
};
XEPromo.styles = promo;
__decorate([
    property({ type: String })
], XEPromo.prototype, "title", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEPromo.prototype, "background", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'hide-media-on-mobile' })
], XEPromo.prototype, "hideMediaOnMobile", void 0);
XEPromo = __decorate([
    customElement('xe-promo')
], XEPromo);
export { XEPromo };
