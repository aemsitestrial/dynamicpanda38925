var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hyperlink } from '@ignite/web/tokens/component';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { registerIcons } from '../../media/icon/icon-resolver.js';
import '../../media/icon/xe-icon.js';
registerIcons({ faArrowUpRightFromSquare, faChevronRight });
/**
 * Xcel Energy Hyperlink Component
 *
 * Renders an anchor element with optional trailing external-link icon.
 *
 * @element xe-hyperlink
 *
 * @prop {string} href - URL the link navigates to
 * @prop {string} target - Anchor target attribute (e.g. '_blank')
 * @prop {string} variant - Color variant: 'default' | 'variant' (white, for use on dark backgrounds)
 * @prop {boolean} trailing-icon - Show a trailing icon after the label
 * @prop {'external'|'internal'} link-type - Controls the trailing icon: 'external' (default, arrow-up-right) or 'internal' (arrow-right)
 *
 * @slot - Link label text
 *
 * @example
 * ```html
 * <xe-hyperlink href="/terms" trailing-icon>Terms & Conditions</xe-hyperlink>
 * <xe-hyperlink href="/careers" variant="variant">Careers</xe-hyperlink>
 * ```
 */
let XEHyperlink = class XEHyperlink extends LitElement {
    constructor() {
        super(...arguments);
        this.href = '';
        this.target = '';
        this.ariaLabel = '';
        this.variant = 'default';
        this.trailingIcon = false;
        this.linkType = 'external';
    }
    render() {
        const icon = this.linkType === 'internal' ? 'faChevronRight' : 'faArrowUpRightFromSquare';
        return html `
      <a
        class="hyperlink"
        href=${this.href || nothing}
        target=${this.target || nothing}
        rel=${this.target === '_blank' ? 'noopener noreferrer' : nothing}
        aria-label=${this.ariaLabel || nothing}
      >
        <slot></slot>
        ${this.trailingIcon
            ? html `<span class="icon"><xe-icon icon=${icon} size="sm" aria-hidden="true"></xe-icon></span>`
            : nothing}
      </a>
    `;
    }
};
XEHyperlink.styles = hyperlink;
__decorate([
    property({ type: String })
], XEHyperlink.prototype, "href", void 0);
__decorate([
    property({ type: String })
], XEHyperlink.prototype, "target", void 0);
__decorate([
    property({ type: String, attribute: 'aria-label' })
], XEHyperlink.prototype, "ariaLabel", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEHyperlink.prototype, "variant", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'trailing-icon' })
], XEHyperlink.prototype, "trailingIcon", void 0);
__decorate([
    property({ type: String, attribute: 'link-type' })
], XEHyperlink.prototype, "linkType", void 0);
XEHyperlink = __decorate([
    customElement('xe-hyperlink')
], XEHyperlink);
export { XEHyperlink };
