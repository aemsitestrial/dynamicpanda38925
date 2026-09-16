var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { segmentedButtonSegment } from '@ignite/web/tokens/component';
import '../../media/icon/xe-icon.js';
/**
 * Xcel Energy Segmented Button Segment
 *
 * An individual segment within `xe-segmented-button`. When selected, shows a
 * checkmark icon alongside the label.
 *
 * @element xe-segmented-button-segment
 *
 * @prop {string} value - The value this segment represents (required)
 * @prop {string} label - The label text displayed in the segment (required)
 * @prop {boolean} selected - Whether this segment is currently selected (managed by parent)
 * @prop {boolean} disabled - Whether this segment is disabled
 *
 * @fires xe-segmented-button-segment-select - Fired when this segment is activated (detail: { value: string })
 */
let XESegmentedButtonSegment = class XESegmentedButtonSegment extends LitElement {
    constructor() {
        super(...arguments);
        this._value = '';
        this.label = '';
        this._selected = false;
        this._disabled = false;
    }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        v ? this.setAttribute('value', v) : this.removeAttribute('value');
        this.requestUpdate('value');
    }
    get selected() { return this._selected; }
    set selected(v) {
        this._selected = v;
        v ? this.setAttribute('selected', '') : this.removeAttribute('selected');
        this.requestUpdate('selected');
    }
    get disabled() { return this._disabled; }
    set disabled(v) {
        this._disabled = v;
        v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
        this.requestUpdate('disabled');
    }
    _activate() {
        if (this.disabled)
            return;
        this.dispatchEvent(new CustomEvent('xe-segmented-button-segment-select', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }
    _handleClick(e) {
        if (e.detail > 0) {
            e.currentTarget.blur();
        }
        this._activate();
    }
    _handleKeyDown(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._activate();
        }
    }
    render() {
        return html `
      <div
        class="segment"
        role="radio"
        aria-checked=${this.selected}
        aria-disabled=${this.disabled ? 'true' : nothing}
        tabindex=${this.selected ? '0' : '-1'}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        ${this.selected ? html `
          <span class="segment-icon">
            <xe-icon icon="faCheck" size="xs"></xe-icon>
          </span>
        ` : nothing}
        ${this.label}
      </div>
    `;
    }
};
XESegmentedButtonSegment.styles = segmentedButtonSegment;
__decorate([
    property({ type: String })
], XESegmentedButtonSegment.prototype, "value", null);
__decorate([
    property({ type: String })
], XESegmentedButtonSegment.prototype, "label", void 0);
__decorate([
    property({ type: Boolean })
], XESegmentedButtonSegment.prototype, "selected", null);
__decorate([
    property({ type: Boolean })
], XESegmentedButtonSegment.prototype, "disabled", null);
XESegmentedButtonSegment = __decorate([
    customElement('xe-segmented-button-segment')
], XESegmentedButtonSegment);
export { XESegmentedButtonSegment };
