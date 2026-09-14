var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { navDrawer } from '@ignite/web/tokens/component';
import { getFocusableEls, handleFocusTrap } from '@ignite/web/utils/focus-trap.js';
import '@ignite/web/primitives/media/logo/xe-logo.js';
import '@ignite/web/primitives/media/icon/xe-icon.js';
import '@ignite/web/primitives/action/icon-button/xe-icon-button.js';
import './xe-nav-drawer-item.js';
/**
 * Xcel Energy Nav Drawer Component
 *
 * Mobile navigation drawer with slide-panel drill-down navigation.
 * `xe-nav-drawer-item` elements with `slot="children"` push a new panel when
 * tapped — children slide in from the right. The back button slides back.
 * Closing the drawer resets to the root level.
 *
 * @element xe-nav-drawer
 *
 * @prop {boolean} open - Controls whether the drawer is visible
 * @prop {boolean} show-back - Shows a back chevron at root level (for external sub-nav contexts)
 *
 * @slot logo - Logo shown in the drawer header
 * @slot nav-items - Root-level navigation items (use `xe-nav-drawer-item`)
 * @slot actions - Supporting header row (space-between layout)
 * @slot selector - Optional full-width row below actions (e.g. segmented button)
 *
 * @fires xe-nav-drawer-close - Fired when the drawer is dismissed. Cancelable.
 * @fires xe-nav-drawer-back - Fired when back is tapped at root level
 */
let XENavDrawer = class XENavDrawer extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.showBack = false;
        this._hasActions = false;
        this._hasSelector = false;
        this._depth = 0;
        this._sectionLabel = null;
        this._closing = false;
        this._stack = [];
        this._track = null;
        this._triggerEl = null;
        this._backInFlight = false;
        this._handleDocPointerDown = (e) => {
            if (!this.open)
                return;
            // Close if the click is outside the drawer — don't preventDefault so the
            // action under the pointer still fires.
            if (!e.composedPath().includes(this))
                this._close();
        };
        this._handleKeyDown = (e) => {
            if (!this.open)
                return;
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
        document.addEventListener('keydown', this._handleKeyDown);
        document.addEventListener('pointerdown', this._handleDocPointerDown);
        // Walk into shadow roots to capture the actual focused element, not the
        // shadow host. Without this, .focus() on a host without delegatesFocus won't
        // reach its inner <button>.
        let opener = document.activeElement;
        while (opener?.shadowRoot?.activeElement) {
            opener = opener.shadowRoot.activeElement;
        }
        this._triggerEl = opener;
        this.updateComplete.then(() => {
            if (this.shadowRoot)
                getFocusableEls(this.shadowRoot)[0]?.focus();
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._handleKeyDown);
        document.removeEventListener('pointerdown', this._handleDocPointerDown);
        this._triggerEl?.focus();
        this._triggerEl = null;
    }
    updated(changed) {
        if (changed.has('open') && !this.open) {
            this._resetToRoot();
        }
    }
    async firstUpdated() {
        await this.updateComplete;
        this._track = this.shadowRoot.querySelector('.nav-track');
    }
    _onActionsSlotChange(e) {
        const slot = e.target;
        this._hasActions = slot.assignedNodes({ flatten: true }).length > 0;
    }
    _onSelectorSlotChange(e) {
        const slot = e.target;
        this._hasSelector = slot.assignedNodes({ flatten: true }).length > 0;
    }
    _handleExpand(e) {
        const { label, children: detailChildren } = e.detail;
        const sourceItem = e.target;
        let children;
        if (detailChildren?.length) {
            // Synthetic expand — children provided directly in event detail
            children = detailChildren;
        }
        else {
            const childrenSlot = sourceItem.shadowRoot?.querySelector('slot[name="children"]');
            children = childrenSlot ? childrenSlot.assignedElements() : [];
        }
        if (!children.length || !this._track)
            return;
        const panel = document.createElement('div');
        panel.className = 'nav-panel';
        children.forEach(child => panel.appendChild(child));
        // Mark all existing panels inert so their items leave the tab order
        Array.from(this._track.querySelectorAll('.nav-panel')).forEach(p => {
            p.inert = true;
        });
        this._track.appendChild(panel);
        // sourceItem is null for synthetic panels — back will just remove the panel
        this._stack.push({ label, sourceItem: detailChildren?.length ? null : sourceItem, panel });
        this._depth = this._stack.length;
        this._sectionLabel = label;
        this._track.style.transform = `translateX(-${this._depth * 100}%)`;
        this.updateComplete.then(() => {
            const firstItem = panel.querySelector('xe-nav-drawer-item');
            firstItem?.shadowRoot?.querySelector('button')?.focus();
        });
    }
    _back(_e) {
        if (this._backInFlight)
            return;
        this._backInFlight = true;
        requestAnimationFrame(() => { this._backInFlight = false; });
        if (this._depth > 0 && this._track) {
            const { sourceItem, panel } = this._stack[this._stack.length - 1];
            // For synthetic panels (e.g. actions-slot drill-down), sourceItem is null —
            // just discard the panel elements rather than returning them to an owner.
            if (sourceItem) {
                Array.from(panel.children).forEach(child => sourceItem.appendChild(child));
            }
            this._track.removeChild(panel);
            this._stack.pop();
            this._depth = this._stack.length;
            this._sectionLabel = this._stack.length > 0
                ? this._stack[this._stack.length - 1].label
                : null;
            this._track.style.transform = `translateX(-${this._depth * 100}%)`;
            // Restore the now-visible panel to the tab order — last panel in track, not first
            const panels = Array.from(this._track.querySelectorAll('.nav-panel'));
            const visiblePanel = panels[panels.length - 1];
            if (visiblePanel)
                visiblePanel.inert = false;
            const poppedSourceItem = sourceItem;
            this.updateComplete.then(() => {
                if (this._depth > 0) {
                    // Still nested — keep focus on the back button
                    const backBtn = this.shadowRoot?.querySelector('xe-icon-button[aria-label="Back"]');
                    backBtn?.shadowRoot?.querySelector('button')?.focus();
                }
                else {
                    // Back at root — focus the item that opened the submenu
                    poppedSourceItem?.shadowRoot?.querySelector('button')?.focus();
                }
            });
        }
        else {
            this.dispatchEvent(new CustomEvent('xe-nav-drawer-back', { bubbles: true, composed: true }));
        }
    }
    _resetToRoot() {
        if (!this._track)
            return;
        while (this._stack.length > 0) {
            const { sourceItem, panel } = this._stack[this._stack.length - 1];
            Array.from(panel.children).forEach(child => sourceItem.appendChild(child));
            this._track.removeChild(panel);
            this._stack.pop();
        }
        this._depth = 0;
        this._sectionLabel = null;
        Array.from(this._track.querySelectorAll('.nav-panel')).forEach(p => {
            p.inert = false;
        });
        this._track.style.transition = 'none';
        this._track.style.transform = 'translateX(0)';
        requestAnimationFrame(() => {
            if (this._track)
                this._track.style.transition = '';
        });
    }
    _close() {
        if (this._closing)
            return;
        this._closing = true;
        const drawer = this.shadowRoot?.querySelector('.drawer');
        const dispatch = () => {
            const event = new CustomEvent('xe-nav-drawer-close', {
                bubbles: true, composed: true, cancelable: true,
            });
            this.dispatchEvent(event);
            if (!event.defaultPrevented) {
                this.open = false;
                this._closing = false;
            }
            else {
                this._closing = false;
            }
        };
        if (drawer) {
            drawer.addEventListener('animationend', dispatch, { once: true });
        }
        else {
            dispatch();
        }
    }
    render() {
        const showBack = this.showBack || this._depth > 0;
        const isNested = this._depth > 0;
        return html `

      <div
        class="drawer ${this._closing ? 'closing' : ''}"
        ?inert="${!this.open}"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        @xe-nav-drawer-item-expand=${this._handleExpand}
      >
        <div class="drawer-header">
          ${showBack ? html `
            <xe-icon-button size="md" aria-label="Back" @click=${this._back}>
              <xe-icon icon="faChevronLeft" size="md"></xe-icon>
            </xe-icon-button>
          ` : nothing}

          <div class="drawer-header-content">
            ${this._sectionLabel
            ? html `<span class="drawer-header-title">${this._sectionLabel}</span>`
            : html `<slot name="logo"></slot>`}
          </div>

          <xe-icon-button size="md" aria-label="Close navigation" @click=${this._close}>
            <xe-icon icon="faXmark" size="md"></xe-icon>
          </xe-icon-button>
        </div>

        <div class="drawer-actions" ?hidden=${!this._hasActions} ?inert=${isNested}>
          <slot name="actions" @slotchange=${this._onActionsSlotChange}></slot>
        </div>

        <div class="drawer-selector" ?hidden=${!this._hasSelector} ?inert=${isNested}>
          <slot name="selector" @slotchange=${this._onSelectorSlotChange}></slot>
        </div>

        <div class="drawer-divider"></div>

        <div class="nav-viewport">
          <div class="nav-track">
            <div class="nav-panel">
              <slot name="nav-items"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
    }
};
XENavDrawer.styles = navDrawer;
__decorate([
    property({ type: Boolean, reflect: true })
], XENavDrawer.prototype, "open", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'show-back' })
], XENavDrawer.prototype, "showBack", void 0);
__decorate([
    state()
], XENavDrawer.prototype, "_hasActions", void 0);
__decorate([
    state()
], XENavDrawer.prototype, "_hasSelector", void 0);
__decorate([
    state()
], XENavDrawer.prototype, "_depth", void 0);
__decorate([
    state()
], XENavDrawer.prototype, "_sectionLabel", void 0);
__decorate([
    state()
], XENavDrawer.prototype, "_closing", void 0);
XENavDrawer = __decorate([
    customElement('xe-nav-drawer')
], XENavDrawer);
export { XENavDrawer };
