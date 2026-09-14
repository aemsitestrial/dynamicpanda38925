var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bentoItem } from '@ignite/web/tokens/component';
/**
 * Xcel Energy Bento Grid Item
 *
 * A transparent grid-item shim that controls column and row span within
 * an `xe-bento` container. Has no visual styling of its own — it simply
 * sets `grid-column: span N` and `grid-row: span N` on the host element
 * so the slotted content fills the configured span.
 *
 * @element xe-bento-item
 *
 * @prop {number} colSpan - Number of columns to span (default: 1)
 * @prop {number} rowSpan - Number of rows to span (default: 1)
 *
 * @slot - Content to display within this grid cell (typically xe-card)
 *
 * @example
 * ```html
 * <xe-bento-item col-span="2">
 *   <xe-card variant="video" treatment="filled">...</xe-card>
 * </xe-bento-item>
 * ```
 */
let XEBentoItem = class XEBentoItem extends LitElement {
    constructor() {
        super(...arguments);
        this.colSpan = 1;
        this.rowSpan = 1;
    }
    updated() {
        this.style.setProperty('--col-span', String(this.colSpan));
        this.style.setProperty('--row-span', String(this.rowSpan));
    }
    render() {
        return html `<slot></slot>`;
    }
};
XEBentoItem.styles = bentoItem;
__decorate([
    property({ type: Number, attribute: 'col-span' })
], XEBentoItem.prototype, "colSpan", void 0);
__decorate([
    property({ type: Number, attribute: 'row-span' })
], XEBentoItem.prototype, "rowSpan", void 0);
XEBentoItem = __decorate([
    customElement('xe-bento-item')
], XEBentoItem);
export { XEBentoItem };
