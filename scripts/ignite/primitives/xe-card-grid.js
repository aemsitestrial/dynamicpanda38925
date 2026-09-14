var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var XECardGrid_1;
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cardGrid } from '@ignite/web/tokens/component';
/**
 * Xcel Energy Card Grid Layout
 *
 * A responsive grid layout for displaying cards in a structured grid pattern.
 * Defaults to `auto-fit` column sizing. Pass an explicit `columns` number to
 * lock the column count (collapses to single-column on mobile).
 *
 * @element xe-card-grid
 *
 * @prop {number | 'auto'} columns - Column count, or 'auto' for auto-fit (default: 'auto')
 * @prop {string} gap - Gap between grid items: 'sm' | 'md' | 'lg' (default: 'md')
 *
 * @cssprop --xe-card-grid-gap - Override the grid gap from outside (used by compositions)
 *
 * @slot - Grid content (typically xe-card components)
 *
 * @example
 * ```html
 * <xe-card-grid columns="3">
 *   <xe-card>Card 1</xe-card>
 *   <xe-card>Card 2</xe-card>
 *   <xe-card>Card 3</xe-card>
 * </xe-card-grid>
 * ```
 */
let XECardGrid = XECardGrid_1 = class XECardGrid extends LitElement {
    constructor() {
        super(...arguments);
        this.gap = 'md';
    }
    render() {
        const isExplicit = this.columns !== undefined;
        const styles = [
            isExplicit ? `--columns: ${this.columns};` : '',
            `--card-grid-gap-size: ${XECardGrid_1._gapVars[this.gap]};`,
        ].filter(Boolean).join(' ');
        return html `
      <div
        class="grid ${isExplicit ? 'explicit' : ''}"
        style="${styles}">
        <slot></slot>
      </div>
    `;
    }
};
XECardGrid.styles = cardGrid;
XECardGrid._gapVars = {
    xs: 'var(--xe-spacing-inline-gap-xs)',
    sm: 'var(--xe-spacing-inline-gap-sm)',
    md: 'var(--xe-spacing-stack-gap-3xl)',
    lg: 'var(--xe-spacing-stack-gap-4xl)',
};
__decorate([
    property({ type: Number })
], XECardGrid.prototype, "columns", void 0);
__decorate([
    property()
], XECardGrid.prototype, "gap", void 0);
XECardGrid = XECardGrid_1 = __decorate([
    customElement('xe-card-grid')
], XECardGrid);
export { XECardGrid };
