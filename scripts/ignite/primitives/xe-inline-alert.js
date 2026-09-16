var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
/**
 * Xcel Energy Inline Alert Component
 *
 * Displays contextual messages and notifications within content flow.
 * For page-level banners, use xe-banner instead.
 *
 * @element xe-inline-alert
 *
 * @prop {string} variant - Alert variant: 'info' | 'success' | 'warning' | 'error'
 * @prop {string} heading - Alert heading text
 * @prop {boolean} dismissible - Whether the alert can be dismissed
 *
 * @slot - Alert content
 * @slot icon - Custom icon slot
 *
 * @fires xe-inline-alert-dismiss - Fired when alert is dismissed
 *
 * @example
 * ```html
 * <xe-inline-alert variant="success" heading="Success!">
 *   Your changes have been saved.
 * </xe-inline-alert>
 * ```
 */
let XEInlineAlert = class XEInlineAlert extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = 'info';
        this.heading = '';
        this.dismissible = false;
    }
    _handleDismiss() {
        this.dispatchEvent(new CustomEvent('xe-inline-alert-dismiss', {
            bubbles: true,
            composed: true,
        }));
        // Dispatch event but let parent handle removal for better control
    }
    render() {
        return html `
      <div class="alert ${this.variant}">
        <slot name="icon"></slot>
        <div class="content">
          ${this.heading ? html `<div class="heading">${this.heading}</div>` : ''}
          <slot></slot>
        </div>
        ${this.dismissible ? html `<button class="dismiss" @click=${this._handleDismiss}>×</button>` : ''}
      </div>
    `;
    }
};
XEInlineAlert.styles = css `
    :host {
      display: block;
    }

    .alert {
      padding: var(--xe-spacing-space-md);
      border-radius: var(--xe-border-radius-md);
      border-left: 4px solid;
      display: flex;
      align-items: start;
      gap: var(--xe-spacing-space-sm);
    }

    .alert.info {
      background-color: var(--xe-color-surface-info);
      border-color: var(--xe-color-border-info);
    }

    .alert.success {
      background-color: var(--xe-color-surface-success);
      border-color: var(--xe-color-border-success);
    }

    .alert.warning {
      background-color: var(--xe-color-surface-warning);
      border-color: var(--xe-color-border-warning);
    }

    .alert.error {
      background-color: var(--xe-color-surface-error);
      border-color: var(--xe-color-border-error);
    }

    .content {
      flex: 1;
    }

    .heading {
      font-weight: var(--xe-font-weight-bold);
      margin-bottom: var(--xe-spacing-space-xs);
    }

    .dismiss {
      cursor: pointer;
      padding: var(--xe-spacing-space-xs);
    }
  `;
__decorate([
    property({ type: String })
], XEInlineAlert.prototype, "variant", void 0);
__decorate([
    property({ type: String })
], XEInlineAlert.prototype, "heading", void 0);
__decorate([
    property({ type: Boolean })
], XEInlineAlert.prototype, "dismissible", void 0);
XEInlineAlert = __decorate([
    customElement('xe-inline-alert')
], XEInlineAlert);
export { XEInlineAlert };
