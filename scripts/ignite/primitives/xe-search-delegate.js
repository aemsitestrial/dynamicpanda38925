var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { searchDelegate } from '@ignite/web/tokens/component';
import { handleFocusTrap } from '../../../utils/focus-trap.js';
import '../../media/icon/xe-icon.js';
import '../../action/icon-button/xe-icon-button.js';
/**
 * Highlights the first occurrence of `query` inside `text` by wrapping it in a
 * `<strong>` tag. Case-insensitive. Returns the original string if no match.
 * Exported so consumers rendering results into the `results` slot can use it.
 */
export function highlightMatch(text, query) {
    if (!query)
        return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1)
        return text;
    return (text.slice(0, idx) +
        `<strong>${text.slice(idx, idx + query.length)}</strong>` +
        text.slice(idx + query.length));
}
/**
 * Xcel Energy Search Delegate Component
 *
 * Full-screen search overlay, owned by `xe-search-bar`. Conditionally
 * rendered into the search bar's shadow DOM via `openDelegate()` — not intended
 * for direct use. Consumer imports `xe-search-bar` and gets responsive search
 * behavior automatically.
 *
 * @element xe-search-delegate
 *
 * @prop {string} placeholder - Placeholder text for the search input
 * @prop {string} value - Initial value for the search input
 * @prop {boolean} keyboard-open - Set by xe-search-bar to indicate keyboard-initiated open
 *
 * @slot results - Content area below the search input
 *
 * @fires xe-search-delegate-close - Fired when dismissed. Cancelable.
 * @fires search - Fired on Enter key
 * @fires clear - Fired when input is cleared
 * @fires input - Fired on every keystroke
 */
let XESearchDelegate = class XESearchDelegate extends LitElement {
    constructor() {
        super(...arguments);
        this.placeholder = 'Search...';
        this.value = '';
        this.keyboardOpen = false;
        this._value = '';
        this._closing = false;
        this._keyboardFocused = false;
        this._pointerDown = false;
        this._suppressFirstFocus = false;
        this._handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                this._close();
                return;
            }
            if (this.shadowRoot)
                handleFocusTrap(e, this.shadowRoot);
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this._value = this.value;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this._handleKeyDown);
    }
    firstUpdated() {
        // Runs after first render — input exists and all parent bindings (including
        // keyboardOpen) are applied. Safe to read keyboardOpen and focus the input.
        this._keyboardFocused = this.keyboardOpen;
        this._suppressFirstFocus = true;
        this._input?.focus();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this._handleKeyDown);
    }
    _close() {
        if (this._closing)
            return;
        this._closing = true;
        const panel = this.shadowRoot?.querySelector('.panel');
        const done = () => {
            this.dispatchEvent(new CustomEvent('xe-search-delegate-close', {
                bubbles: true, composed: true, cancelable: true,
            }));
        };
        if (panel) {
            panel.addEventListener('animationend', done, { once: true });
        }
        else {
            done();
        }
    }
    _handleMouseDown() {
        this._pointerDown = true;
    }
    _handleInputFocus() {
        if (this._suppressFirstFocus) {
            this._suppressFirstFocus = false;
            return;
        }
        this._keyboardFocused = !this._pointerDown;
        this._pointerDown = false;
    }
    _handleInputBlur() {
        this._keyboardFocused = false;
        this._pointerDown = false;
    }
    _handleInput(e) {
        this._value = e.target.value;
        this.dispatchEvent(new CustomEvent('input', {
            bubbles: true, composed: true, detail: { value: this._value },
        }));
    }
    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.dispatchEvent(new CustomEvent('search', {
                bubbles: true, composed: true, detail: { value: this._value },
            }));
        }
    }
    _handleClear(e) {
        this._value = '';
        if (this._input)
            this._input.value = '';
        // Keyboard-synthesized clicks have detail === 0; pointer clicks have detail >= 1.
        // Only suppress the focus ring when the clear was pointer-triggered.
        const originalEvent = e?.detail?.originalEvent;
        if (originalEvent && originalEvent.detail > 0)
            this._pointerDown = true;
        this._input?.focus();
        this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
    }
    render() {
        return html `
      <div class="overlay ${this._closing ? 'closing' : ''}" @click=${this._close} aria-hidden="true"></div>

      <div class="panel ${this._closing ? 'closing' : ''}" role="dialog" aria-modal="true" aria-label="Search">
        <div class="panel-header">
          <xe-icon-button aria-label="Back (close search)" @click=${this._close}>
            <xe-icon icon="faChevronLeft" size="md"></xe-icon>
          </xe-icon-button>
          <div class="search-input-row" @mousedown="${this._handleMouseDown}">
            <xe-icon class="search-icon" icon="faMagnifyingGlass" size="sm"></xe-icon>

            <input
              type="text"
              .value="${this._value}"
              placeholder="${this.placeholder}"
              @input="${this._handleInput}"
              @keydown="${this._handleKeyPress}"
              @focus="${this._handleInputFocus}"
              @blur="${this._handleInputBlur}"
              aria-label="${this.placeholder}"
            />

            ${this._value ? html `
              <xe-icon-button aria-label="Clear search" @click="${(e) => this._handleClear(e)}">
                <xe-icon icon="faXmark" size="sm"></xe-icon>
              </xe-icon-button>
            ` : ''}
          </div>
        </div>

        <div class="panel-divider"></div>

        ${this._value ? html `
          <div class="panel-results">
            <slot name="results"></slot>
          </div>
        ` : nothing}
      </div>
    `;
    }
};
XESearchDelegate.styles = [searchDelegate];
__decorate([
    property({ type: String })
], XESearchDelegate.prototype, "placeholder", void 0);
__decorate([
    property({ type: String })
], XESearchDelegate.prototype, "value", void 0);
__decorate([
    property({ type: Boolean, attribute: 'keyboard-open' })
], XESearchDelegate.prototype, "keyboardOpen", void 0);
__decorate([
    state()
], XESearchDelegate.prototype, "_value", void 0);
__decorate([
    state()
], XESearchDelegate.prototype, "_closing", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'keyboard-focused' })
], XESearchDelegate.prototype, "_keyboardFocused", void 0);
__decorate([
    query('input')
], XESearchDelegate.prototype, "_input", void 0);
XESearchDelegate = __decorate([
    customElement('xe-search-delegate')
], XESearchDelegate);
export { XESearchDelegate };
