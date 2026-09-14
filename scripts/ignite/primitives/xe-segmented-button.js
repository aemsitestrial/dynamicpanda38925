var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { segmentedButton } from '@ignite/web/tokens/component';
import './xe-segmented-button-segment.js';
/**
 * Xcel Energy Segmented Button Component
 *
 * Segmented buttons help people select options, switch views, or sort elements.
 * They contain two or more segments, with one selected at a time.
 *
 * Keyboard navigation follows the radiogroup pattern:
 * - Tab / Shift+Tab: move focus into/out of the group (single tab stop)
 * - ArrowRight / ArrowDown: focus next segment
 * - ArrowLeft / ArrowUp: focus previous segment
 * - Home: focus first segment
 * - End: focus last segment
 * - Space / Enter (manual activation): confirm focused segment as selected
 *
 * @element xe-segmented-button
 *
 * @prop {string} value - The value of the currently selected segment
 * @prop {string} label - Accessible label for the group (required for screen readers)
 * @prop {'manual' | 'auto'} activation - 'manual' requires Space/Enter to confirm after arrow navigation (default); 'auto' selects on arrow key press
 *
 * @slot - Segment content (use `xe-segmented-button-segment` elements)
 *
 * @fires xe-segmented-button-change - Fired when selection changes (detail: { value: string })
 *
 * @example
 * ```html
 * <xe-segmented-button value="residential" label="Account type">
 *   <xe-segmented-button-segment value="residential" label="Residential"></xe-segmented-button-segment>
 *   <xe-segmented-button-segment value="business" label="Business"></xe-segmented-button-segment>
 * </xe-segmented-button>
 * ```
 */
let XESegmentedButton = class XESegmentedButton extends LitElement {
    constructor() {
        super(...arguments);
        this._value = '';
        this.label = '';
        this.activation = 'manual';
        this._focusedIndex = -1;
        this._handleFocusOut = (e) => {
            if (!e.relatedTarget || !this.contains(e.relatedTarget)) {
                this._focusedIndex = -1;
                this._syncSegments();
            }
        };
        this._expand = false;
    }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        v ? this.setAttribute('value', v) : this.removeAttribute('value');
        this.requestUpdate('value');
    }
    get expand() { return this._expand; }
    set expand(v) {
        this._expand = v;
        v ? this.setAttribute('expand', '') : this.removeAttribute('expand');
        this.requestUpdate('expand');
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('xe-segmented-button-segment-select', this._onSegmentSelect);
        this.addEventListener('focusout', this._handleFocusOut);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('xe-segmented-button-segment-select', this._onSegmentSelect);
        this.removeEventListener('focusout', this._handleFocusOut);
    }
    _getSegments() {
        return Array.from(this.querySelectorAll('xe-segmented-button-segment'));
    }
    _onSegmentSelect(e) {
        const newValue = e.detail.value;
        if (newValue === this.value)
            return;
        this.value = newValue;
        this._syncSegments();
        this.dispatchEvent(new CustomEvent('xe-segmented-button-change', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }
    _syncSegments() {
        this._getSegments().forEach((seg) => {
            seg.selected = seg.value === this.value;
        });
    }
    _focusSegment(segments, index) {
        this._focusedIndex = index;
        const target = segments[index];
        const radio = target.shadowRoot?.querySelector('[role="radio"]');
        if (radio)
            radio.focus();
    }
    _handleKeyDown(e) {
        const segments = this._getSegments().filter((s) => !s.disabled);
        if (!segments.length)
            return;
        const currentFocused = this._focusedIndex >= 0
            ? this._focusedIndex
            : segments.findIndex((s) => s.selected);
        let next = currentFocused;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            next = (currentFocused + 1) % segments.length;
        }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            next = (currentFocused - 1 + segments.length) % segments.length;
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            next = 0;
        }
        else if (e.key === 'End') {
            e.preventDefault();
            next = segments.length - 1;
        }
        else if (e.key === ' ' || e.key === 'Enter') {
            if (this.activation === 'manual' && this._focusedIndex >= 0) {
                e.preventDefault();
                const target = segments[this._focusedIndex];
                target.dispatchEvent(new CustomEvent('xe-segmented-button-segment-select', {
                    bubbles: true,
                    composed: true,
                    detail: { value: target.value },
                }));
            }
            return;
        }
        else {
            return;
        }
        this._focusSegment(segments, next);
        if (this.activation === 'auto') {
            const target = segments[next];
            target.dispatchEvent(new CustomEvent('xe-segmented-button-segment-select', {
                bubbles: true,
                composed: true,
                detail: { value: target.value },
            }));
        }
    }
    updated(changed) {
        if (changed.has('value')) {
            this._syncSegments();
        }
    }
    render() {
        return html `
      <div
        class="segmented-button"
        role="radiogroup"
        aria-label=${this.label || 'Options'}
        @keydown=${this._handleKeyDown}
      >
        <slot @slotchange=${() => this._syncSegments()}></slot>
      </div>
    `;
    }
};
XESegmentedButton.styles = segmentedButton;
__decorate([
    property({ type: String })
], XESegmentedButton.prototype, "value", null);
__decorate([
    property({ type: String })
], XESegmentedButton.prototype, "label", void 0);
__decorate([
    property({ type: String })
], XESegmentedButton.prototype, "activation", void 0);
__decorate([
    property({ type: Boolean })
], XESegmentedButton.prototype, "expand", null);
XESegmentedButton = __decorate([
    customElement('xe-segmented-button')
], XESegmentedButton);
export { XESegmentedButton };
