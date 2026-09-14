var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { icon as iconStyles } from '@ignite/web/tokens/component';
import { resolveIcon } from './icon-resolver.js';
/**
 * Xcel Energy Icon Component
 *
 * Displays Font Awesome icons using the icon registry pattern.
 * Icons must be registered via registerIcons() before use.
 *
 * @element xe-icon
 *
 * @property {string} icon - Font Awesome icon name (e.g., 'faPlay', 'faHeart')
 * @property {string} size - Icon size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 *
 * @example
 * ```html
 * <xe-icon icon="faPlay"></xe-icon>
 * <xe-icon icon="faHeart" size="lg"></xe-icon>
 * ```
 */
let XEIcon = class XEIcon extends LitElement {
    constructor() {
        super(...arguments);
        this.icon = '';
        this.size = 'md';
    }
    render() {
        return html `${resolveIcon(this.icon)}`;
    }
};
XEIcon.styles = iconStyles;
__decorate([
    property({ type: String })
], XEIcon.prototype, "icon", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEIcon.prototype, "size", void 0);
XEIcon = __decorate([
    customElement('xe-icon')
], XEIcon);
export { XEIcon };
