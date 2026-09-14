var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { menu } from '@ignite/web/tokens/component';
// Import menu-item so it's automatically registered
import '../menu-item/xe-menu-item.js';
/**
 * Xcel Energy Menu Component
 *
 * A menu container following Material 3 design principles
 * with Xcel Energy design tokens.
 *
 * @element xe-menu
 *
 * @slot - Default slot for xe-menu-item elements
 *
 * @property {string} variant - Visual variant: "filled" (default with background/elevation) or "transparent"
 * @property {string} width - Optional fixed width for the menu (e.g. "200px"). Useful when the trigger is narrower than the desired menu width.
 *
 * @example
 * ```html
 * <xe-menu variant="filled">
 *   <xe-menu-item label="Profile">
 *     <xe-icon slot="leading-icon" icon="faUser" size="sm"></xe-icon>
 *   </xe-menu-item>
 *   <xe-menu-item label="Settings">
 *     <xe-icon slot="leading-icon" icon="faGear" size="sm"></xe-icon>
 *   </xe-menu-item>
 *   <xe-menu-item label="Logout" show-divider>
 *     <xe-icon slot="leading-icon" icon="faSignOut" size="sm"></xe-icon>
 *   </xe-menu-item>
 * </xe-menu>
 * ```
 */
let XEMenu = class XEMenu extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = 'filled';
    }
    render() {
        return html `
      <div class="menu ${this.variant}" role="menu" style=${this.width ? `width:${this.width}` : ''}>
        <slot></slot>
      </div>
    `;
    }
};
XEMenu.styles = [menu];
__decorate([
    property({ type: String, reflect: true })
], XEMenu.prototype, "variant", void 0);
__decorate([
    property({ type: String })
], XEMenu.prototype, "width", void 0);
XEMenu = __decorate([
    customElement('xe-menu')
], XEMenu);
export { XEMenu };
