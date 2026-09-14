var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var XEBento_1;
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bento } from '@ignite/web/tokens/component';
/**
 * Xcel Energy Bento Grid Layout
 *
 * A fixed-column CSS Grid container for mosaic/bento layouts where individual
 * items need to span multiple columns or rows. Unlike `xe-card-grid`, the column
 * count is always explicit — use `xe-bento-item` wrappers to control spans.
 * Collapses to a single column on mobile (≤599px).
 *
 * @element xe-bento
 *
 * @prop {number} columns - Number of grid columns (default: 3)
 * @prop {string} gap - Gap between grid items: 'xs' | 'sm' | 'md' | 'lg' (default: 'md')
 *
 * @cssprop --xe-bento-gap - Override the grid gap from outside
 *
 * @slot - Grid content (typically xe-bento-item > xe-card)
 *
 * @example
 * ```html
 * <xe-bento columns="3">
 *   <xe-bento-item col-span="2"><xe-card>Wide card</xe-card></xe-bento-item>
 *   <xe-bento-item><xe-card>Narrow card</xe-card></xe-bento-item>
 * </xe-bento>
 * ```
 */
let XEBento = XEBento_1 = class XEBento extends LitElement {
    constructor() {
        super(...arguments);
        this.columns = 3;
        this.gap = 'md';
    }
    render() {
        const styles = [
            `--columns: ${this.columns};`,
            `--bento-gap-size: ${XEBento_1._gapVars[this.gap]};`,
        ].join(' ');
        return html `
      <div class="grid" style="${styles}">
        <slot></slot>
      </div>
    `;
    }
};
XEBento.styles = bento;
XEBento._gapVars = {
    xs: 'var(--xe-spacing-inline-gap-xs)',
    sm: 'var(--xe-spacing-inline-gap-sm)',
    md: 'var(--xe-spacing-stack-gap-3xl)',
    lg: 'var(--xe-spacing-stack-gap-4xl)',
};
__decorate([
    property({ type: Number })
], XEBento.prototype, "columns", void 0);
__decorate([
    property()
], XEBento.prototype, "gap", void 0);
XEBento = XEBento_1 = __decorate([
    customElement('xe-bento')
], XEBento);
export { XEBento };
