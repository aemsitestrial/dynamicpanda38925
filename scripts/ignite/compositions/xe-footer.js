var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { footer } from '@ignite/web/tokens/component';
import './xe-footer-column.js';
import '@ignite/web/primitives/media/logo/xe-logo.js';
import '@ignite/web/primitives/action/hyperlink/xe-hyperlink.js';
export { XEFooterColumn } from './xe-footer-column.js';
/**
 * Xcel Energy Footer Component
 *
 * Full-width site footer. On desktop, renders a left panel (logo, social, legal)
 * and a five-column link grid side by side. On mobile (< 1024px), the link columns
 * stack below the logo; CSS `order` handles the visual resequencing.
 *
 * @element xe-footer
 *
 * @slot logo - Brand logo element
 * @slot copyright - Copyright text
 * @slot - xe-footer-column children (link groups)
 * @slot social - Row of xe-icon-button social media icons
 * @slot legal - Legal link elements (use xe-hyperlink with variant="variant" and trailing-icon)
 * @slot banner-image - Background image for the footer banner section
 * @slot tagline - Tagline text/markup displayed over the banner image
 *
 * @example
 * ```html
 * <xe-footer>
 *   <img slot="logo" src="/logo.svg" alt="Xcel Energy" />
 *   <span slot="copyright">© 2026 Xcel Energy Inc. All rights reserved.</span>
 *   <xe-footer-column>
 *     <h3 slot="heading">COMPANY</h3>
 *     <a href="/careers">Careers</a>
 *     <a href="/community">Community</a>
 *   </xe-footer-column>
 *   <xe-icon-button slot="social" aria-label="Facebook">
 *     <xe-icon icon="faSquareFacebook"></xe-icon>
 *   </xe-icon-button>
 *   <xe-hyperlink slot="legal" href="/terms" variant="variant" trailing-icon>Terms &amp; Conditions</xe-hyperlink>
 *   <img slot="banner-image" src="/solar-field.jpg" alt="" />
 *   <span slot="tagline">Our Energy, Your Power</span>
 * </xe-footer>
 * ```
 */
let XEFooter = class XEFooter extends LitElement {
    constructor() {
        super(...arguments);
        this.columns = 5;
        this.tagline = '';
        this.imagePosition = 'center';
    }
    updated(changedProperties) {
        if (changedProperties.has('columns')) {
            this.style.setProperty('--xe-footer-columns', String(this.columns));
        }
    }
    render() {
        return html `
      <footer class="footer" aria-label="Footer">
        <div class="main">
          <div class="left-panel">
            <div class="logo-copyright">
              <slot name="logo"></slot>
              <slot name="copyright"></slot>
            </div>
          </div>
          <div class="social-legal">
            <div class="social"><slot name="social"></slot></div>
            <div class="legal"><slot name="legal"></slot></div>
          </div>
          <div class="columns">
            <slot></slot>
          </div>
        </div>
        <div class="banner">
          <div class="banner-image">
            <slot name="banner-image"></slot>
          </div>
          <span class="tagline">
            <slot name="tagline">${this.tagline}</slot>
          </span>
        </div>
      </footer>
    `;
    }
};
XEFooter.styles = footer;
__decorate([
    property({ type: Number })
], XEFooter.prototype, "columns", void 0);
__decorate([
    property({ type: String })
], XEFooter.prototype, "tagline", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'image-position' })
], XEFooter.prototype, "imagePosition", void 0);
XEFooter = __decorate([
    customElement('xe-footer')
], XEFooter);
export { XEFooter };
