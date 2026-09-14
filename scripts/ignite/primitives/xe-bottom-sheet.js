var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, nothing } from 'lit';
import { html as staticHtml, literal } from 'lit/static-html.js';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { bottomSheet } from '@ignite/web/tokens/component';
import { getFocusableEls, handleFocusTrap } from '../../../utils/focus-trap.js';
import '@ignite/web/primitives/action/icon-button/xe-icon-button.js';
import '@ignite/web/primitives/media/icon/xe-icon.js';
/**
 * `xe-bottom-sheet` is a modal panel that slides up from the bottom of the
 * viewport. It traps focus, locks body scroll, and dismisses via the scrim
 * overlay, the Escape key, or programmatically.
 *
 * The element is always present in the DOM — only `open` controls whether
 * the sheet is visible. No side effects occur until `open` becomes true.
 *
 * @element xe-bottom-sheet
 *
 * @prop {boolean} open - Controls visibility. Reflects as an attribute.
 * @prop {'modal'|'persistent'} variant - `modal` (default) locks scroll and traps focus behind a scrim. `persistent` renders without a scrim and allows background interaction.
 * @prop {string} label - Accessible label for the dialog (required for screen readers).
 * @prop {string} title - Optional title rendered in the sheet header.
 * @prop {number} titleHeadingLevel - Heading level (1–6) for the title. Defaults to 2.
 * @prop {string} subtitle - Optional subtitle rendered below the title.
 * @prop {boolean} dismissible - Renders a close button in the header and allows Escape and overlay click to dismiss (default: true). Set to false when a selection is required to proceed.
 *
 * @slot - Main body content
 * @slot actions - Bottom action area (e.g. a text button)
 *
 * @fires xe-bottom-sheet-close - Fired when the sheet is dismissed. Cancelable.
 *   If `preventDefault()` is called the sheet stays open.
 *
 * @example
 * ```html
 * <xe-bottom-sheet open label="Choose a plan" title="Select your plan" subtitle="Pick the option that fits your home.">
 *   <xe-radio-tile-group name="plan">...</xe-radio-tile-group>
 *   <xe-button slot="actions" treatment="text" variant="primary">Continue</xe-button>
 * </xe-bottom-sheet>
 * ```
 */
let XEBottomSheet = class XEBottomSheet extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        /**
         * `modal` (default) — renders a scrim, locks body scroll, and traps focus.
         *   The user cannot interact with or scroll the page behind the sheet.
         * `persistent` — no scrim, no scroll lock, no focus trap.
         *   The sheet coexists with page content.
         */
        this.variant = 'modal';
        this.label = '';
        this.title = '';
        this.titleHeadingLevel = 2;
        this.subtitle = '';
        this.dismissible = true;
        this._closing = false;
        this._hasActions = false;
        this._triggerEl = null;
        this._listening = false;
        this._handleKeyDown = (e) => {
            if (e.key === 'Escape' && this.dismissible) {
                this._close();
                return;
            }
            if (this.variant !== 'persistent' && this.shadowRoot)
                handleFocusTrap(e, this.shadowRoot);
        };
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._detachListeners(true);
    }
    updated(changed) {
        if (!changed.has('open'))
            return;
        if (this.open && !this._listening) {
            this._attachListeners();
        }
        else if (!this.open && this._listening) {
            this._detachListeners(true);
        }
    }
    _attachListeners() {
        const isModal = this.variant !== 'persistent';
        document.addEventListener('keydown', this._handleKeyDown);
        if (isModal) {
            document.body.style.overflow = 'hidden';
        }
        let opener = document.activeElement;
        while (opener?.shadowRoot?.activeElement) {
            opener = opener.shadowRoot.activeElement;
        }
        this._triggerEl = opener;
        this._listening = true;
        this.updateComplete.then(() => {
            if (!this.open || !this.shadowRoot)
                return;
            if (isModal)
                getFocusableEls(this.shadowRoot)[0]?.focus({ preventScroll: true });
            const content = this.shadowRoot.querySelector('.content');
            if (content)
                content.scrollTop = 0;
        });
    }
    _detachListeners(restoreFocus = false) {
        if (!this._listening)
            return;
        document.removeEventListener('keydown', this._handleKeyDown);
        document.body.style.overflow = '';
        if (restoreFocus) {
            this._triggerEl?.focus();
            this._triggerEl = null;
        }
        this._listening = false;
    }
    _close() {
        if (this._closing)
            return;
        const event = new CustomEvent('xe-bottom-sheet-close', {
            bubbles: true, composed: true, cancelable: true,
        });
        this.dispatchEvent(event);
        if (event.defaultPrevented)
            return;
        this._closing = true;
        this._detachListeners(false);
        const sheetEl = this.shadowRoot?.querySelector('.sheet');
        const finish = () => {
            this._triggerEl?.focus();
            this._triggerEl = null;
            this.open = false;
            this._closing = false;
        };
        if (sheetEl) {
            sheetEl.addEventListener('animationend', finish, { once: true });
        }
        else {
            finish();
        }
    }
    get _titleTag() {
        const level = Math.min(Math.max(this.titleHeadingLevel, 1), 6);
        return level === 1 ? literal `h1`
            : level === 2 ? literal `h2`
                : level === 3 ? literal `h3`
                    : level === 4 ? literal `h4`
                        : level === 5 ? literal `h5`
                            : literal `h6`;
    }
    _onActionsSlotChange(e) {
        const slot = e.target;
        this._hasActions = slot.assignedNodes({ flatten: true }).length > 0;
    }
    render() {
        if (!this.open && !this._closing)
            return nothing;
        return html `
      ${this.variant !== 'persistent' ? html `<div class="overlay ${this._closing ? 'closing' : ''}" @pointerdown=${this.dismissible ? this._close : nothing}></div>` : nothing}
      <div
        class="sheet ${this._closing ? 'closing' : ''}"
        role="dialog"
        aria-modal="true"
        aria-label=${this.label || this.title || 'Dialog'}
      >
        ${this.title || this.subtitle ? staticHtml `
          <div class="header">
            <div class="header-content">
              ${this.title ? staticHtml `<${this._titleTag} class="title">${this.title}</${this._titleTag}>` : nothing}
              ${this.subtitle ? html `<p class="subtitle">${this.subtitle}</p>` : nothing}
            </div>
            ${this.dismissible ? html `
              <xe-icon-button class="close-button" aria-label="Close" @click=${this._close}>
                <xe-icon icon="faXmark"></xe-icon>
              </xe-icon-button>
            ` : nothing}
          </div>
        ` : nothing}

        <div class="content">
          <slot></slot>
          <div class="actions" ?hidden=${!this._hasActions}>
            <slot name="actions" @slotchange=${this._onActionsSlotChange}></slot>
          </div>
        </div>
      </div>
    `;
    }
};
XEBottomSheet.styles = bottomSheet;
__decorate([
    property({ type: Boolean, reflect: true })
], XEBottomSheet.prototype, "open", void 0);
__decorate([
    property({ type: String, reflect: true })
], XEBottomSheet.prototype, "variant", void 0);
__decorate([
    property({ type: String })
], XEBottomSheet.prototype, "label", void 0);
__decorate([
    property({ type: String })
], XEBottomSheet.prototype, "title", void 0);
__decorate([
    property({ type: Number, attribute: 'title-heading-level' })
], XEBottomSheet.prototype, "titleHeadingLevel", void 0);
__decorate([
    property({ type: String })
], XEBottomSheet.prototype, "subtitle", void 0);
__decorate([
    property({ type: Boolean })
], XEBottomSheet.prototype, "dismissible", void 0);
__decorate([
    state()
], XEBottomSheet.prototype, "_closing", void 0);
__decorate([
    state()
], XEBottomSheet.prototype, "_hasActions", void 0);
XEBottomSheet = __decorate([
    customElement('xe-bottom-sheet')
], XEBottomSheet);
export { XEBottomSheet };
