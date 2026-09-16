var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { quickActions } from '@ignite/web/tokens/component';
/**
 * `<xe-quick-actions>` is a responsive grid composition for 3–5 action cards.
 *
 * Layout adapts automatically based on the number of slotted cards:
 * - 3 cards: 3-column equal-width row (mobile: single column)
 * - 4 cards: 2×2 grid
 * - 5 cards: 3-column top row + 1-col / 2-col second row (mobile: 2×2 + full-width last)
 *
 * @element xe-quick-actions
 *
 * @prop {string} background - Section background: 'default' | 'subtle' | 'muted' (default: 'default')
 * @prop {string} label - Accessible label for the region landmark (required for a11y)
 *
 * @slot - 3–5 `<xe-card>` elements
 */
let XEQuickActions = class XEQuickActions extends LitElement {
    constructor() {
        super(...arguments);
        this.background = 'default';
        this.label = '';
        this._cardCount = 0;
    }
    _onSlotChange(e) {
        const slot = e.target;
        const assigned = slot.assignedElements({ flatten: true });
        this._cardCount = Math.min(assigned.length, 5);
    }
    render() {
        const gridClass = this._cardCount >= 3 ? `grid grid--${this._cardCount}` : 'grid';
        return html `
      <div class="quick-actions" role="region" aria-label=${this.label}>
        <div class=${gridClass}>
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `;
    }
};
XEQuickActions.styles = quickActions;
__decorate([
    property({ type: String, reflect: true })
], XEQuickActions.prototype, "background", void 0);
__decorate([
    property({ type: String })
], XEQuickActions.prototype, "label", void 0);
__decorate([
    state()
], XEQuickActions.prototype, "_cardCount", void 0);
XEQuickActions = __decorate([
    customElement('xe-quick-actions')
], XEQuickActions);
export { XEQuickActions };
