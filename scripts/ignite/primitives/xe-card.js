var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { card } from '@ignite/web/tokens/component';
/**
 * Xcel Energy Card Component
 *
 * A card container component following Material 3 design principles
 * with Xcel Energy's Ignite Design System tokens.
 *
 * @element xe-card
 *
 * @prop {string} variant - Card color variant: 'primary' | 'primary-variant' | 'surface' | 'neutral' | 'image' | 'video' | 'destructured' | 'static-light' | 'static-dark'
 * @prop {string} treatment - Visual style treatment: 'filled' | 'elevated' | 'outlined'
 * @prop {string} treatmentMobile - Override treatment on mobile (≤768px): 'filled' | 'elevated' | 'outlined' | undefined
 * @prop {string} decorativePosition - Named position for the decorative slot: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'top-center' | 'center'
 * @prop {string} interactive - Interactive state: 'false' (default) | 'true' (always interactive) | 'responsive' (interactive on mobile ≤768px)
 * @prop {string} contentTheme - Content theme (overrides system theme for card text and icons only, not buttons): 'light' | 'dark' | undefined
 * @prop {string} aspectRatio - Aspect ratio for the card: '16:9' | '9:16' | '4:3' | '4:5' | '1:1' | '3:2' | 'auto'
 * @prop {string} actionsPosition - Horizontal alignment of actions slot: 'left' | 'right'
 * @prop {string} actionsPlacement - Vertical placement of actions: 'bottom' | 'inline'
 * @prop {string} overlayColor - CSS color value for the overlay (e.g., '#000000', 'rgba(0,0,0,0.5)')
 * @prop {number} overlayOpacity - Opacity value for the overlay (0-1)
 * @prop {string} align - Content alignment: 'left' | 'center'
 * @prop {string} alignMobile - Override alignment on mobile (≤768px): 'left' | 'center' | undefined
 * @prop {string} headerJustify - Vertical alignment of header content: 'flex-start' | 'center' | 'flex-end'
 * @prop {string} headerJustifyMobile - Override header vertical alignment on mobile (≤768px): 'flex-start' | 'center' | 'flex-end' | undefined
 * @prop {boolean} hideActionsMobile - Hide actions slot on mobile (≤768px)
 * @prop {string} href - Optional href for link-style cards (renders as anchor when interactive)
 * @prop {string} target - Link target (when href is provided)
 *
 * @slot - Card content (main content area)
 * @slot title - Optional title section (rendered in header)
 * @slot icon - Optional icon (use xe-icon element)
 * @slot media - Optional media section at top (image, video, etc.)
 * @slot decorative - Optional decorative content between body and actions
 * @slot actions - Optional actions section (e.g., buttons)
 *
 * @fires xe-card-click - Fired when card is clicked (only if interactive=true; detail: { originalEvent: MouseEvent })
 *
 * @remarks
 * **Recommended Button Pairings:**
 * - `variant="primary"` → Use `xe-button variant="neutral"` to avoid competing with bold card background
 * - `variant="surface"` → Use `xe-button variant="primary"` (standard pairing)
 * - `variant="neutral"` → Use `xe-button variant="neutral"` (monochromatic)
 * - `variant="image"` → Use `xe-button` with matching `contentTheme` prop
 * - `variant="video"` → Use `xe-button` with matching `contentTheme` prop
 *
 * @example
 * ```html
 * <!-- Surface card with primary button -->
 * <xe-card variant="surface" treatment="filled">
 *   <h3 slot="title">Card Title</h3>
 *   <p>Card content goes here</p>
 *   <div slot="actions">
 *     <xe-button variant="primary">Action</xe-button>
 *   </div>
 * </xe-card>
 *
 * <!-- Destructured card with responsive features -->
 * <xe-card
 *   variant="destructured"
 *   align="left"
 *   align-mobile="center"
 *   interactive="responsive"
 *   treatment-mobile="elevated"
 *   header-justify-mobile="center"
 *   hide-actions-mobile
 * >
 *   <xe-icon slot="icon" icon="faBuilding" size="xl"></xe-icon>
 *   <h3 slot="title">Partner Name</h3>
 *   <p>Partnership description</p>
 *   <div slot="actions">
 *     <xe-button variant="primary" treatment="text">Learn More</xe-button>
 *   </div>
 * </xe-card>
 *
 * <!-- Image card with content theme and overlay -->
 * <xe-card variant="image" treatment="filled" contentTheme="light" overlayColor="#000000" overlayOpacity="0.4">
 *   <img slot="media" src="image.jpg" alt="Card media">
 *   <h3 slot="title">Card with Media</h3>
 *   <p>Content with media section and overlay</p>
 *   <div slot="actions">
 *     <xe-button variant="primary" contentTheme="light">Learn More</xe-button>
 *   </div>
 * </xe-card>
 *
 * <!-- Interactive card as link -->
 * <xe-card variant="image" treatment="filled" interactive="true" href="/learn-more">
 *   <img slot="media" src="image.jpg" alt="Card media">
 *   <h3 slot="title">Clickable Card</h3>
 *   <p>Entire card is a link when href is provided</p>
 * </xe-card>
 * ```
 */
let XECard = class XECard extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = 'surface';
        this.treatment = 'filled';
        this.interactive = 'false';
        // Private property to track mobile viewport state (for responsive features)
        this._isMobileViewport = false;
        this._hasActions = false;
        this._hasDecorative = false;
        this._hasBody = false;
        this.aspectRatio = 'auto';
        this.actionsPosition = 'left';
        this.actionsPlacement = 'bottom';
        this.align = 'left';
        this.headerJustify = 'flex-start';
        this.hideActionsMobile = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this._setupResponsiveTracking();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._cleanupMediaQuery();
    }
    firstUpdated() {
        this._hasActions = !!this.querySelector('[slot="actions"]');
        this._hasDecorative = !!this.querySelector('[slot="decorative"]');
        this._hasBody = Array.from(this.childNodes).some(n => (n.nodeType === Node.ELEMENT_NODE && !n.hasAttribute('slot')) ||
            (n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim()));
        if (this._hasActions)
            this._applyButtonThemes();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('interactive') ||
            changedProperties.has('hideActionsMobile') ||
            changedProperties.has('treatmentMobile') ||
            changedProperties.has('alignMobile') ||
            changedProperties.has('headerJustifyMobile')) {
            this._cleanupMediaQuery();
            this._setupResponsiveTracking();
            this.requestUpdate();
        }
        if (changedProperties.has('variant') || changedProperties.has('contentTheme')) {
            this._applyButtonThemes();
        }
    }
    _setupResponsiveTracking() {
        // Track mobile viewport (≤768px) for responsive features
        this._mediaQuery = window.matchMedia('(max-width: 768px)');
        this._isMobileViewport = this._mediaQuery.matches;
        const handler = (e) => {
            this._isMobileViewport = e.matches;
            this.requestUpdate();
        };
        this._mediaQuery.addEventListener('change', handler);
    }
    _cleanupMediaQuery() {
        if (this._mediaQuery) {
            // Remove all listeners
            this._mediaQuery = undefined;
        }
    }
    get _isInteractive() {
        if (this.interactive === 'responsive') {
            return this._isMobileViewport;
        }
        return this.interactive === 'true';
    }
    get _effectiveTreatment() {
        if (this._isMobileViewport && this.treatmentMobile) {
            return this.treatmentMobile;
        }
        return this.treatment;
    }
    _handleClick(e) {
        if (!this._isInteractive) {
            return;
        }
        this.dispatchEvent(new CustomEvent('xe-card-click', {
            bubbles: true,
            composed: true,
            detail: { originalEvent: e },
        }));
    }
    get _impliedButtonTheme() {
        if (this.contentTheme === 'light')
            return 'light';
        if (['primary', 'primary-variant', 'static-dark'].includes(this.variant))
            return 'light';
        return null;
    }
    _applyButtonThemes() {
        const actionsEl = this.querySelector('[slot="actions"]');
        if (!actionsEl)
            return;
        const theme = this._impliedButtonTheme;
        const buttons = actionsEl.tagName.toLowerCase() === 'xe-button'
            ? [actionsEl]
            : Array.from(actionsEl.querySelectorAll('xe-button'));
        for (const btn of buttons) {
            if (!btn.hasAttribute('content-theme') || btn.hasAttribute('data-auto-content-theme')) {
                if (theme) {
                    btn.setAttribute('content-theme', theme);
                    btn.setAttribute('data-auto-content-theme', '');
                }
                else {
                    btn.removeAttribute('content-theme');
                    btn.removeAttribute('data-auto-content-theme');
                }
            }
            if (!btn.hasAttribute('size')) {
                btn.setAttribute('size', 'sm');
            }
        }
    }
    render() {
        // Convert aspect ratio to class name (e.g., '16:9' -> 'aspect-16-9')
        const aspectRatioClass = this.aspectRatio !== 'auto'
            ? `aspect-${this.aspectRatio.replace(':', '-')}`
            : '';
        const classes = {
            card: true,
            [this.variant]: true,
            [this._effectiveTreatment]: true,
            interactive: this._isInteractive,
            ...(this.contentTheme && { [`content-theme-${this.contentTheme}`]: true }),
            [aspectRatioClass]: !!aspectRatioClass,
            'actions-left': this.actionsPosition === 'left',
            'actions-right': this.actionsPosition === 'right',
            'actions-inline': this.actionsPlacement === 'inline',
            [`align-${this.align}`]: true,
        };
        // Apply responsive properties
        const effectiveAlign = this._isMobileViewport && this.alignMobile ? this.alignMobile : this.align;
        const effectiveHeaderJustify = this._isMobileViewport && this.headerJustifyMobile ? this.headerJustifyMobile : this.headerJustify;
        // Convert alignment to flex align-items value
        const alignItems = effectiveAlign === 'center' ? 'center' : 'flex-start';
        // Set internal CSS custom properties (not user-overrideable)
        this.style.setProperty('--card-title-align', effectiveAlign);
        this.style.setProperty('--card-body-align', effectiveAlign);
        this.style.setProperty('--card-actions-align', effectiveAlign);
        this.style.setProperty('--card-header-align-items', alignItems);
        this.style.setProperty('--card-header-justify', effectiveHeaderJustify);
        // Enable vertical centering when headerJustifyMobile is set
        if (this._isMobileViewport && this.headerJustifyMobile) {
            this.style.setProperty('--card-header-flex-grow', '1');
            this.style.setProperty('--card-content-align-items', alignItems);
        }
        else {
            this.style.setProperty('--card-header-flex-grow', '0');
            this.style.removeProperty('--card-content-align-items');
        }
        // Hide actions on mobile
        this.style.setProperty('--card-actions-display', this.hideActionsMobile && this._isMobileViewport ? 'none' : 'block');
        // Common card content
        const cardContent = html `
      <slot name="media"></slot>
      ${this.overlayColor ? html `
        <div
          class="overlay"
          style="background-color: ${this.overlayColor}; opacity: ${this.overlayOpacity ?? 1};">
        </div>
      ` : ''}
      <div class="card-content">
        <div class="header">
          <slot name="icon"></slot>
          <slot name="title"></slot>
        </div>
        ${this._hasBody ? html `<slot></slot>` : nothing}
      </div>
      ${this._hasActions ? html `
        <div class="card-actions">
          <slot name="actions"></slot>
        </div>
      ` : nothing}
      ${this._hasDecorative ? html `<slot name="decorative"></slot>` : nothing}
    `;
        // Render as link if href is provided and interactive
        if (this.href && this._isInteractive) {
            return html `
        <a
          href=${this.href}
          target=${this.target || nothing}
          class=${classMap(classes)}
          role="button"
          @click=${this._handleClick}>
          ${cardContent}
        </a>
      `;
        }
        // Render as div
        return html `
      <div class=${classMap(classes)} @click=${this._handleClick}>
        ${cardContent}
      </div>
    `;
    }
};
XECard.styles = card;
__decorate([
    property({ type: String })
], XECard.prototype, "variant", void 0);
__decorate([
    property({ type: String })
], XECard.prototype, "treatment", void 0);
__decorate([
    property({ type: String })
], XECard.prototype, "interactive", void 0);
__decorate([
    property({ type: String, attribute: 'content-theme' })
], XECard.prototype, "contentTheme", void 0);
__decorate([
    state()
], XECard.prototype, "_hasActions", void 0);
__decorate([
    state()
], XECard.prototype, "_hasDecorative", void 0);
__decorate([
    state()
], XECard.prototype, "_hasBody", void 0);
__decorate([
    property({ type: String, attribute: 'aspect-ratio' })
], XECard.prototype, "aspectRatio", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'decorative-position' })
], XECard.prototype, "decorativePosition", void 0);
__decorate([
    property({ type: String, attribute: 'actions-position' })
], XECard.prototype, "actionsPosition", void 0);
__decorate([
    property({ type: String, attribute: 'actions-placement' })
], XECard.prototype, "actionsPlacement", void 0);
__decorate([
    property({ type: String, attribute: 'overlay-color' })
], XECard.prototype, "overlayColor", void 0);
__decorate([
    property({ type: Number, attribute: 'overlay-opacity' })
], XECard.prototype, "overlayOpacity", void 0);
__decorate([
    property({ type: String })
], XECard.prototype, "align", void 0);
__decorate([
    property({ type: String, attribute: 'align-mobile' })
], XECard.prototype, "alignMobile", void 0);
__decorate([
    property({ type: String, attribute: 'header-justify' })
], XECard.prototype, "headerJustify", void 0);
__decorate([
    property({ type: String, attribute: 'header-justify-mobile' })
], XECard.prototype, "headerJustifyMobile", void 0);
__decorate([
    property({ type: Boolean, attribute: 'hide-actions-mobile' })
], XECard.prototype, "hideActionsMobile", void 0);
__decorate([
    property({ type: String, attribute: 'treatment-mobile' })
], XECard.prototype, "treatmentMobile", void 0);
__decorate([
    property({ type: String })
], XECard.prototype, "href", void 0);
__decorate([
    property({ type: String })
], XECard.prototype, "target", void 0);
XECard = __decorate([
    customElement('xe-card')
], XECard);
export { XECard };
