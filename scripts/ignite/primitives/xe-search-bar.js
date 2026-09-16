var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { searchBar } from '@ignite/web/tokens/component';
import '../../media/icon/xe-icon.js';
export { highlightMatch } from '../search-delegate/xe-search-delegate.js';
/**
 * XE Search Bar Component
 *
 * A search input component for finding assets in an application and navigating
 * through search queries.
 *
 * @element xe-search-bar
 *
 * @prop {string} placeholder - Placeholder text displayed when input is empty
 * @prop {string} value - Current search value
 * @prop {boolean} disabled - Whether the search bar is disabled
 *
 * @fires xe-search-bar-search - Emitted when search is triggered (Enter key or search icon click; detail: { value: string })
 * @fires xe-search-bar-clear - Emitted when clear button is clicked
 * @fires xe-search-bar-input - Emitted on input value change (detail: { value: string })
 *
 * @example
 * ```typescript
 * // Required: Register icons before using this component
 * import { registerIcons } from '@ignite/web';
 * import { faMagnifyingGlass, faXmark } from '@fortawesome/pro-solid-svg-icons';
 *
 * registerIcons({ faMagnifyingGlass, faXmark });
 * ```
 *
 * @example
 * ```html
 * <xe-search-bar
 *   placeholder="Search..."
 *   @xe-search-bar-search="${(e) => console.log('Search:', e.detail.value)}"
 *   @xe-search-bar-clear="${() => console.log('Cleared')}">
 * </xe-search-bar>
 * ```
 */
let XESearchBar = class XESearchBar extends LitElement {
    constructor() {
        super(...arguments);
        this.placeholder = 'Search...';
        this.value = '';
        this.disabled = false;
        this.collapsed = false;
        this._open = false;
        this._isSearching = false;
        this._delegateOpen = false;
        this._delegateKeyboardOpen = false;
        this._opening = false;
        this._pointerDown = false;
        this._suppressNextFocus = false;
        this._keyboardFocused = false;
    }
    openInline() {
        if (this._open)
            return;
        this._opening = true;
        this._open = true;
        this.updateComplete.then(() => {
            this._input?.focus();
            this._opening = false;
        });
    }
    openDelegate(keyboardOpen = false) {
        this._delegateKeyboardOpen = keyboardOpen;
        this._delegateOpen = true;
    }
    transferToDelegate() {
        this._open = false;
        this._delegateKeyboardOpen = false;
        this._delegateOpen = true;
    }
    transferToInline(value) {
        this._delegateOpen = false;
        this.value = value;
        this._isSearching = value.length > 0;
        this._opening = true;
        this._open = true;
        this.updateComplete.then(() => {
            this._suppressNextFocus = true;
            this._input?.focus();
            this._opening = false;
        });
    }
    updated(changedProperties) {
        if (changedProperties.has('value')) {
            this._isSearching = this.value.length > 0;
        }
        if (changedProperties.has('_open') || changedProperties.has('_delegateOpen')) {
            this.dispatchEvent(new CustomEvent('xe-search-bar-resize', { bubbles: true, composed: true }));
        }
    }
    _handleMouseDown(e) {
        this._pointerDown = true;
        if (this._open) {
            // Prevent blur so clicks (e.g. clear icon) don't dismiss the expanded bar.
            // Since we're suppressing the blur/refocus cycle, manually clear the ring —
            // _handleInputFocus won't fire if the input stays focused.
            e.preventDefault();
            this._keyboardFocused = false;
        }
    }
    _handleInputFocus() {
        if (this._suppressNextFocus) {
            this._suppressNextFocus = false;
            this._pointerDown = false;
            return;
        }
        this._keyboardFocused = !this._pointerDown;
        this._pointerDown = false;
    }
    _handleIconFocus() {
        this._keyboardFocused = !this._pointerDown;
        // _pointerDown is intentionally not cleared here — if a click triggered this
        // focus, _handleInputFocus will consume the flag when focus moves to the input.
    }
    _handleIconBlur() {
        this._keyboardFocused = false;
    }
    _handleContainerKeyDown(e) {
        if ((e.key === 'Enter' || e.key === ' ') && this.collapsed && !this._open) {
            e.preventDefault();
            // Dispatch a synthetic click so capture-phase listeners (e.g. xe-navbar's
            // search routing) can intercept and redirect to the delegate if needed.
            this.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
        }
    }
    _handleExpandClick(e) {
        if (this.collapsed) {
            if (!this._open) {
                this._opening = true;
                this._open = true;
                this.updateComplete.then(() => {
                    this._input?.focus();
                    this._opening = false;
                });
            }
            return;
        }
        const target = e.target;
        if (target.closest('input') || target.closest('.clear-icon'))
            return;
        this._handleSearch();
    }
    _handleBlur() {
        this._keyboardFocused = false;
        if (this._opening)
            return;
        if (this.collapsed && !this.value) {
            this._open = false;
        }
    }
    _handleInput(e) {
        const input = e.target;
        this.value = input.value;
        this._isSearching = this.value.length > 0;
        this.dispatchEvent(new CustomEvent('xe-search-bar-input', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }
    _handleKeyDown(e) {
        if (e.key === 'Enter') {
            this._handleSearch();
        }
        else if (e.key === 'Escape') {
            if (this.collapsed) {
                this.value = '';
                this._isSearching = false;
                this._open = false;
                this._input?.blur();
            }
            else {
                this._handleClear();
            }
        }
    }
    _handleSearch() {
        this.dispatchEvent(new CustomEvent('xe-search-bar-search', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }
    _handleClear() {
        this.value = '';
        this._isSearching = false;
        this.dispatchEvent(new CustomEvent('xe-search-bar-clear', {
            bubbles: true,
            composed: true,
        }));
        // Focus the input after clearing
        this._input?.focus();
    }
    render() {
        return html `
      <div class="search-container" @mousedown="${this._handleMouseDown}" @click="${this._handleExpandClick}" @keydown="${this._handleContainerKeyDown}">
        <button
          class="search-icon"
          type="button"
          aria-label="Search"
          aria-expanded="${this.collapsed ? String(this._open) : nothing}"
          tabindex="${this.collapsed && this._open ? '-1' : '0'}"
          @focus="${this._handleIconFocus}"
          @blur="${this._handleIconBlur}"
        >
          <xe-icon icon="faMagnifyingGlass" size="sm" aria-hidden="true"></xe-icon>
        </button>
        <input
          type="text"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          @input="${this._handleInput}"
          @keydown="${this._handleKeyDown}"
          @focus="${this._handleInputFocus}"
          @blur="${this._handleBlur}"
          aria-label="Search"
          tabindex="${this.collapsed && !this._open ? '-1' : '0'}"
        />
        <button
          class="clear-icon ${this._isSearching ? 'visible' : ''}"
          type="button"
          aria-label="Clear search"
          ?inert="${!this._isSearching}"
          tabindex="${this._isSearching ? '0' : '-1'}"
          @click="${this._handleClear}">
          <xe-icon icon="faXmark" size="sm" aria-hidden="true"></xe-icon>
        </button>
      </div>

      ${this._delegateOpen ? html `
        <xe-search-delegate
          placeholder="${this.placeholder}"
          value="${this.value}"
          ?keyboard-open="${this._delegateKeyboardOpen}"
          @xe-search-delegate-close="${() => { this._delegateOpen = false; }}"
          @search="${(e) => this.dispatchEvent(new CustomEvent('xe-search-bar-search', { bubbles: true, composed: true, detail: e.detail }))}"
          @clear="${() => this.dispatchEvent(new CustomEvent('xe-search-bar-clear', { bubbles: true, composed: true }))}"
          @input="${(e) => this.dispatchEvent(new CustomEvent('xe-search-bar-input', { bubbles: true, composed: true, detail: e.detail }))}"
        >
          <slot slot="results" name="delegate-results"></slot>
        </xe-search-delegate>
      ` : ''}
    `;
    }
};
XESearchBar.styles = searchBar;
__decorate([
    property({ type: String })
], XESearchBar.prototype, "placeholder", void 0);
__decorate([
    property({ type: String })
], XESearchBar.prototype, "value", void 0);
__decorate([
    property({ type: Boolean })
], XESearchBar.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], XESearchBar.prototype, "collapsed", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'open' })
], XESearchBar.prototype, "_open", void 0);
__decorate([
    state()
], XESearchBar.prototype, "_isSearching", void 0);
__decorate([
    state()
], XESearchBar.prototype, "_delegateOpen", void 0);
__decorate([
    state()
], XESearchBar.prototype, "_delegateKeyboardOpen", void 0);
__decorate([
    query('input')
], XESearchBar.prototype, "_input", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'keyboard-focused' })
], XESearchBar.prototype, "_keyboardFocused", void 0);
XESearchBar = __decorate([
    customElement('xe-search-bar')
], XESearchBar);
export { XESearchBar };
