var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { svg as svgStyles } from '@ignite/web/tokens/component';
import { resolveSvg } from './svg-resolver.js';
let XESvg = class XESvg extends LitElement {
    constructor() {
        super(...arguments);
        this.name = '';
        this.align = '';
    }
    render() {
        return html `${resolveSvg(this.name)}`;
    }
};
XESvg.styles = svgStyles;
__decorate([
    property({ type: String })
], XESvg.prototype, "name", void 0);
__decorate([
    property({ type: String, reflect: true })
], XESvg.prototype, "align", void 0);
XESvg = __decorate([
    customElement('xe-svg')
], XESvg);
export { XESvg };
