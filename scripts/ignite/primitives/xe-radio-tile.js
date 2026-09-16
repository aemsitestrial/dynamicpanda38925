var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, svg, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { radioTile } from '@ignite/web/tokens/component';
/**
 * An individual radio tile within `xe-radio-tile-group`. Renders a selectable
 * card with an image slot, label, and optional sublabel.
 *
 * @element xe-radio-tile
 *
 * @prop {string} value - The value this tile represents (required)
 * @prop {string} label - Primary label text (required)
 * @prop {string} sublabel - Optional secondary label text below the label
 * @prop {boolean} selected - Whether this tile is currently selected (managed by parent)
 * @prop {boolean} disabled - Whether this tile is disabled
 *
 * @slot - Image content displayed in the tile body
 *
 * @fires xe-radio-tile-select - Fired when this tile is activated (detail: { value: string })
 */
let XERadioTile = class XERadioTile extends LitElement {
    constructor() {
        super(...arguments);
        this._value = '';
        this.label = '';
        this.sublabel = '';
        this._selected = false;
        this._disabled = false;
        /** Managed by xe-radio-tile-group — makes this tile the tab entry point when nothing is selected. */
        this._tabbable = false;
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
    get tabbable() { return this._tabbable; }
    set tabbable(v) {
        this._tabbable = v;
        this.requestUpdate('tabbable');
    }
    _activate() {
        if (this.disabled)
            return;
        this.dispatchEvent(new CustomEvent('xe-radio-tile-select', {
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
        class="tile"
        role="radio"
        aria-checked=${this.selected}
        aria-disabled=${this.disabled ? 'true' : nothing}
        tabindex=${this.tabbable ? '0' : '-1'}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        <div class="state-layer">
          <div class="radio-indicator">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="10" cy="10" r="9" fill="transparent" stroke="currentColor" stroke-width="2"/>
              ${this.selected ? svg `<circle cx="10" cy="10" r="4.5" fill="currentColor"/>` : nothing}
            </svg>
          </div>
          <div class="image-slot">
            <slot></slot>
          </div>
          <div class="content">
            <span class="label">${this.label}</span>
            ${this.sublabel ? html `<span class="sublabel">${this.sublabel}</span>` : nothing}
          </div>
        </div>
      </div>
    `;
    }
};
XERadioTile.styles = radioTile;
XERadioTile.formAssociated = true;
__decorate([
    property({ type: String })
], XERadioTile.prototype, "value", null);
__decorate([
    property({ type: String })
], XERadioTile.prototype, "label", void 0);
__decorate([
    property({ type: String })
], XERadioTile.prototype, "sublabel", void 0);
__decorate([
    property({ type: Boolean })
], XERadioTile.prototype, "selected", null);
__decorate([
    property({ type: Boolean })
], XERadioTile.prototype, "disabled", null);
__decorate([
    property({ type: Boolean })
], XERadioTile.prototype, "tabbable", null);
XERadioTile = __decorate([
    customElement('xe-radio-tile')
], XERadioTile);
export { XERadioTile };
