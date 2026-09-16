var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { radioTileGroup } from '@ignite/web/tokens/component';
import './xe-radio-tile.js';
/**
 * `xe-radio-tile-group` manages a set of `xe-radio-tile` elements as a single
 * radio group — one tab stop, arrow-key navigation, and form participation via
 * `ElementInternals`.
 *
 * @element xe-radio-tile-group
 *
 * @prop {string} value - The value of the currently selected tile
 * @prop {string} label - Accessible label for the group (required for screen readers)
 * @prop {string} name - Form field name
 * @prop {string} columns - CSS `grid-template-columns` value applied at all widths.
 *   Sets `--xe-radio-tile-group-columns` on the host. Defaults to `repeat(auto-fill, minmax(160px, 1fr))`.
 * @prop {string} columns-mobile - CSS `grid-template-columns` value applied below 600px (container query).
 *   Sets `--xe-radio-tile-group-columns-mobile` on the host. Falls back to `columns` when not set.
 *
 * @cssprop --xe-radio-tile-group-columns - Grid column template. Override directly when `columns` prop isn't enough.
 * @cssprop --xe-radio-tile-group-columns-mobile - Grid column template below 600px container width.
 * @cssprop --xe-radio-tile-group-align-items - CSS `align-items` for grid cells (default: `stretch`).
 * @cssprop --xe-radio-tile-group-justify-items - CSS `justify-items` for grid cells (default: `stretch`).
 *
 * @slot - `xe-radio-tile` children
 *
 * @fires xe-radio-tile-group-change - Fired when selection changes (detail: { value: string })
 *
 * @example
 * ```html
 * <xe-radio-tile-group name="plan" label="Choose a plan" value="solar" columns="repeat(4, 1fr)">
 *   <xe-radio-tile value="solar" label="Solar">
 *     <img src="/solar.png" alt="" />
 *   </xe-radio-tile>
 *   <xe-radio-tile value="wind" label="Wind">
 *     <img src="/wind.png" alt="" />
 *   </xe-radio-tile>
 * </xe-radio-tile-group>
 * ```
 */
let XERadioTileGroup = class XERadioTileGroup extends LitElement {
    constructor() {
        super();
        this._value = '';
        this.label = '';
        this._name = '';
        this._columns = '';
        this._columnsMobile = '';
        this._handleFocusOut = (e) => {
            if (!e.relatedTarget || !this.contains(e.relatedTarget)) {
                this._syncTiles();
            }
        };
        this._internals = this.attachInternals();
    }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        v ? this.setAttribute('value', v) : this.removeAttribute('value');
        this.requestUpdate('value');
    }
    get name() { return this._name; }
    set name(v) {
        this._name = v;
        v ? this.setAttribute('name', v) : this.removeAttribute('name');
        this.requestUpdate('name');
    }
    get columns() { return this._columns; }
    set columns(v) {
        this._columns = v;
        v ? this.setAttribute('columns', v) : this.removeAttribute('columns');
        this.requestUpdate('columns');
    }
    get columnsMobile() { return this._columnsMobile; }
    set columnsMobile(v) {
        this._columnsMobile = v;
        v ? this.setAttribute('columns-mobile', v) : this.removeAttribute('columns-mobile');
        this.requestUpdate('columnsMobile');
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('xe-radio-tile-select', this._onTileSelect);
        this.addEventListener('keydown', this._handleKeyDown);
        this.addEventListener('focusout', this._handleFocusOut);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('xe-radio-tile-select', this._onTileSelect);
        this.removeEventListener('keydown', this._handleKeyDown);
        this.removeEventListener('focusout', this._handleFocusOut);
    }
    _getTiles() {
        return Array.from(this.querySelectorAll('xe-radio-tile'));
    }
    _onTileSelect(e) {
        const newValue = e.detail.value;
        if (newValue !== this.value) {
            this.value = newValue;
            this._syncTiles();
            this._internals.setFormValue(this.value);
            this.dispatchEvent(new CustomEvent('xe-radio-tile-group-change', {
                bubbles: true,
                composed: true,
                detail: { value: this.value },
            }));
        }
    }
    _syncTiles() {
        const tiles = this._getTiles();
        const selected = tiles.find(t => t.value === this.value);
        const firstEnabled = tiles.find(t => !t.disabled);
        const tabbableTarget = selected ?? firstEnabled;
        tiles.forEach(tile => {
            tile.selected = tile.value === this.value;
            tile.tabbable = tile === tabbableTarget;
        });
    }
    _setTabbable(target) {
        this._getTiles().forEach(tile => {
            tile.tabbable = tile === target;
        });
    }
    _handleKeyDown(e) {
        const tiles = this._getTiles().filter((t) => !t.disabled);
        if (!tiles.length)
            return;
        const path = e.composedPath();
        const focused = tiles.findIndex(t => path.includes(t));
        const current = focused >= 0 ? focused : tiles.findIndex((t) => t.selected);
        let next = current;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            next = (current + 1) % tiles.length;
        }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            next = (current - 1 + tiles.length) % tiles.length;
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            next = 0;
        }
        else if (e.key === 'End') {
            e.preventDefault();
            next = tiles.length - 1;
        }
        else {
            return;
        }
        const target = tiles[next];
        this._setTabbable(target);
        const radio = target.shadowRoot?.querySelector('[role="radio"]');
        if (radio)
            radio.focus({ preventScroll: false });
        if (target.value !== this.value) {
            this.value = target.value;
            this._syncTiles();
            this._internals.setFormValue(this.value);
            this.dispatchEvent(new CustomEvent('xe-radio-tile-group-change', {
                bubbles: true, composed: true, detail: { value: this.value },
            }));
        }
    }
    updated(changed) {
        if (changed.has('value')) {
            this._syncTiles();
            this._internals.setFormValue(this.value);
        }
    }
    render() {
        return html `
      ${this.columns || this.columnsMobile ? html `<style>
        :host {
          ${this.columns ? `--xe-radio-tile-group-columns: ${this.columns};` : ''}
          ${this.columnsMobile ? `--xe-radio-tile-group-columns-mobile: ${this.columnsMobile};` : ''}
        }
      </style>` : ''}
      <div
        class="group"
        role="radiogroup"
        aria-label=${this.label || 'Options'}
      >
        <slot @slotchange=${() => this._syncTiles()}></slot>
      </div>
    `;
    }
};
XERadioTileGroup.styles = radioTileGroup;
XERadioTileGroup.formAssociated = true;
__decorate([
    property({ type: String })
], XERadioTileGroup.prototype, "value", null);
__decorate([
    property({ type: String })
], XERadioTileGroup.prototype, "label", void 0);
__decorate([
    property({ type: String })
], XERadioTileGroup.prototype, "name", null);
__decorate([
    property({ type: String })
], XERadioTileGroup.prototype, "columns", null);
__decorate([
    property({ type: String, attribute: 'columns-mobile' })
], XERadioTileGroup.prototype, "columnsMobile", null);
XERadioTileGroup = __decorate([
    customElement('xe-radio-tile-group')
], XERadioTileGroup);
export { XERadioTileGroup };
