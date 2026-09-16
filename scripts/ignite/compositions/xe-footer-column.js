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
import { footerColumn } from '@ignite/web/tokens/component';
import '@ignite/web/primitives/media/icon/xe-icon.js';
import '@ignite/web/primitives/content-display/accordion/xe-accordion.js';
/**
 * Footer Column Component
 *
 * Used inside <xe-footer> to render a single link group. On desktop it renders
 * as a static heading + link list; on mobile it becomes an xe-accordion panel.
 *
 * @element xe-footer-column
 *
 * @prop {string} heading - Column heading text.
 * @prop {number} headingLevel - Heading level (1–6) for the column title. Defaults
 *   to 2. Set by the consuming developer to match the page heading hierarchy.
 *
 * @slot - xe-hyperlink elements
 *
 * @example
 * ```html
 * <xe-footer-column heading="Company">
 *   <xe-hyperlink href="/careers">Careers</xe-hyperlink>
 * </xe-footer-column>
 * ```
 */
let XEFooterColumn = class XEFooterColumn extends LitElement {
    constructor() {
        super(...arguments);
        this.heading = '';
        this.headingLevel = 2;
        this._isMobile = false;
        this._mq = null;
        this._onBreakpoint = (e) => { this._isMobile = e.matches; };
    }
    connectedCallback() {
        super.connectedCallback();
        this._mq = window.matchMedia('(max-width: 1024px)');
        this._isMobile = this._mq.matches;
        this._mq.addEventListener('change', this._onBreakpoint);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._mq?.removeEventListener('change', this._onBreakpoint);
    }
    _wrapInListItems(e) {
        const slot = e.target;
        slot.assignedElements().forEach(el => {
            if (el.tagName !== 'LI') {
                const li = document.createElement('li');
                el.parentNode.insertBefore(li, el);
                li.appendChild(el);
            }
        });
    }
    render() {
        if (this._isMobile) {
            return html `
        <xe-accordion
          heading="${this.heading}"
          heading-level="${this.headingLevel}">
          <slot @slotchange=${this._wrapInListItems}></slot>
        </xe-accordion>
      `;
        }
        const level = Math.min(Math.max(this.headingLevel, 1), 6);
        const tag = level === 1 ? literal `h1`
            : level === 2 ? literal `h2`
                : level === 3 ? literal `h3`
                    : level === 4 ? literal `h4`
                        : level === 5 ? literal `h5`
                            : literal `h6`;
        return staticHtml `
      <div class="column">
        <${tag} class="heading">
          <span class="heading-text">${this.heading}</span>
        </${tag}>
        <ul>
          <slot @slotchange=${this._wrapInListItems}></slot>
        </ul>
      </div>
    `;
    }
};
XEFooterColumn.styles = footerColumn;
__decorate([
    property({ type: String })
], XEFooterColumn.prototype, "heading", void 0);
__decorate([
    property({ type: Number, attribute: 'heading-level' })
], XEFooterColumn.prototype, "headingLevel", void 0);
__decorate([
    state()
], XEFooterColumn.prototype, "_isMobile", void 0);
XEFooterColumn = __decorate([
    customElement('xe-footer-column')
], XEFooterColumn);
export { XEFooterColumn };
