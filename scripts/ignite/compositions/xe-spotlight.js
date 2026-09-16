var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { spotlight } from '@ignite/web/tokens/component';
/**
 * `<xe-spotlight>` is a full-width hero section with centered content.
 *
 * The `background` controls the backdrop:
 * - `image` — full-bleed background image; pair with `overlay` to control the dark scrim and text color
 * - `subtle` / `muted` — solid surface background with dark text
 *
 * @element xe-spotlight
 *
 * @prop {string} background - Section background: 'image' | 'subtle' | 'muted' (default: 'image')
 * @prop {string} overlay - Scrim over the background image: 'dark' (dark scrim + white text) | 'light' (white scrim + dark text). Only applies when `background="image"`. (default: 'dark')
 * @prop {string} imagePosition - CSS `object-position` value for the background image at desktop (default: 'center')
 * @prop {string} imagePositionMobile - CSS `object-position` value for the background image at mobile ≤768px. Falls back to `imagePosition` if unset.
 * @prop {string} src - URL of the background image (desktop). When set, the component renders the image internally; no `<img slot="background">` needed.
 * @prop {string} mobileSrc - URL of an alternate background image served at ≤768px. Requires `src` to be set.
 *
 * @slot background - Full-bleed background image or video. Used when `src` is not set.
 * @slot title - Heading content
 * @slot - Subtitle / supporting text
 * @slot actions - Call-to-action buttons. Slot each `<xe-button>` directly (not wrapped in a div) so the component's `action-gap` token spaces them.
 */
let XESpotlight = class XESpotlight extends LitElement {
    constructor() {
        super(...arguments);
        this.background = 'image';
        this.overlay = 'dark';
    }
    updated(changed) {
        if (changed.has('imagePosition'))
            this.style.setProperty('--xe-spotlight-image-position', this.imagePosition ?? '');
        if (changed.has('imagePositionMobile'))
            this.style.setProperty('--xe-spotlight-image-position-mobile', this.imagePositionMobile ?? '');
    }
    render() {
        return html `
      <div class="spotlight">
        <div class="spotlight-background">
          ${this.src ? html `
            <picture class="spotlight-picture">
              ${this.mobileSrc ? html `<source media="(max-width: 768px)" srcset="${this.mobileSrc}">` : nothing}
              <img class="spotlight-image" src="${this.src}" alt="">
            </picture>
          ` : html `<slot name="background"></slot>`}
        </div>
        <div class="spotlight-overlay"></div>
        <div class="spotlight-content">
          <slot name="title"></slot>
          <slot></slot>
          <div class="spotlight-actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
    }
};
XESpotlight.styles = spotlight;
__decorate([
    property({ type: String, reflect: true })
], XESpotlight.prototype, "background", void 0);
__decorate([
    property({ type: String, reflect: true })
], XESpotlight.prototype, "overlay", void 0);
__decorate([
    property({ type: String, attribute: 'image-position' })
], XESpotlight.prototype, "imagePosition", void 0);
__decorate([
    property({ type: String, attribute: 'image-position-mobile' })
], XESpotlight.prototype, "imagePositionMobile", void 0);
__decorate([
    property({ type: String })
], XESpotlight.prototype, "src", void 0);
__decorate([
    property({ type: String, attribute: 'mobile-src' })
], XESpotlight.prototype, "mobileSrc", void 0);
XESpotlight = __decorate([
    customElement('xe-spotlight')
], XESpotlight);
export { XESpotlight };
