var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { carousel } from '@ignite/web/tokens/component';
import '../../action/icon-button/xe-icon-button.js';
import '../../media/icon/xe-icon.js';
/**
 * Xcel Energy Carousel Component
 *
 * A horizontally scrollable, scroll-snapping carousel for cards or images.
 * Includes prev/next arrow buttons and dot pagination indicators.
 *
 * Bilateral peek: when the user is on any card other than the first, the
 * previous card's trailing edge is visible to the left (scroll-padding-inline-start
 * offsets the snap point so the peek zone is symmetric on both sides).
 *
 * @element xe-carousel
 *
 * @prop {boolean} hideControls - Hide prev/next arrow buttons (default: false)
 * @prop {boolean} hideIndicators - Hide dot pagination indicators (default: false)
 * @prop {string} label - Accessible label for the carousel region (default: 'Carousel')
 *
 * @slot - Carousel items (typically xe-card elements or images)
 *
 * @example
 * ```html
 * <xe-carousel>
 *   <xe-card variant="surface" treatment="filled"><h3 slot="title">Card 1</h3></xe-card>
 *   <xe-card variant="surface" treatment="filled"><h3 slot="title">Card 2</h3></xe-card>
 *   <xe-card variant="surface" treatment="filled"><h3 slot="title">Card 3</h3></xe-card>
 * </xe-carousel>
 * ```
 */
let XECarousel = class XECarousel extends LitElement {
    constructor() {
        super(...arguments);
        this.hideControls = false;
        this.hideIndicators = false;
        this.label = 'Carousel';
        this._itemCount = 0;
        this._currentIndex = 0;
        this._canScrollLeft = false;
        this._canScrollRight = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this._setupFocusManagement();
    }
    firstUpdated() {
        this._setupScrollListener();
        // Defer until after first browser paint so inherited CSS custom properties
        // (e.g. --xe-carousel-item-width from a parent component) have resolved into layout.
        requestAnimationFrame(() => this._updateScrollBoundaries());
    }
    _setupScrollListener() {
        if (!this._track)
            return;
        this._track.addEventListener('scroll', () => {
            clearTimeout(this._scrollTimeout);
            this._scrollTimeout = window.setTimeout(() => {
                this._updateCurrentIndex();
            }, 100);
        });
    }
    _setupFocusManagement() {
        this.addEventListener('focusin', (e) => {
            if (!this._track)
                return;
            const target = e.target;
            const items = this._getSlottedElements();
            const focusedCard = items.find(item => item.contains(target));
            if (focusedCard) {
                focusedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start',
                });
            }
        });
    }
    _getSlottedElements() {
        if (!this._slot)
            return [];
        return this._slot.assignedElements({ flatten: true });
    }
    _updateCurrentIndex() {
        if (!this._track)
            return;
        const items = this._getSlottedElements();
        if (items.length === 0)
            return;
        const scrollLeft = this._track.scrollLeft;
        const itemWidth = items[0].offsetWidth || 0;
        const gap = parseInt(getComputedStyle(this._track).gap) || 0;
        this._currentIndex = Math.round(scrollLeft / (itemWidth + gap));
        this._updateScrollBoundaries();
    }
    _updateScrollBoundaries() {
        if (!this._track)
            return;
        const { scrollLeft, scrollWidth, clientWidth } = this._track;
        this._canScrollLeft = scrollLeft > 1;
        this._canScrollRight = scrollLeft + clientWidth < scrollWidth - 1;
    }
    _scrollToItem(index) {
        if (!this._track)
            return;
        const items = this._getSlottedElements();
        if (items.length === 0)
            return;
        const itemWidth = items[0].offsetWidth || 0;
        const gap = parseInt(getComputedStyle(this._track).gap) || 0;
        this._track.scrollTo({ left: index * (itemWidth + gap), behavior: 'smooth' });
    }
    _handlePrev() {
        const prev = Math.max(0, this._currentIndex - 1);
        this._currentIndex = prev;
        this._scrollToItem(prev);
    }
    _handleNext() {
        const next = Math.min(this._itemCount - 1, this._currentIndex + 1);
        this._currentIndex = next;
        this._scrollToItem(next);
    }
    _handleDotClick(index) {
        this._currentIndex = index;
        this._scrollToItem(index);
    }
    _handleSlotChange() {
        const items = this._getSlottedElements();
        this._itemCount = items.length;
        this.updateComplete.then(() => requestAnimationFrame(() => this._updateScrollBoundaries()));
    }
    _handleKeydown(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this._handlePrev();
        }
        else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this._handleNext();
        }
    }
    render() {
        return html `
      <div
        class="reel"
        role="region"
        aria-label=${this.label}>
        <div
          class="reel-track"
          @keydown=${this._handleKeydown}>
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>

      ${!this.hideControls || !this.hideIndicators ? html `
        <div class="paginator">
          ${!this.hideControls ? html `
            <xe-icon-button
              aria-label="Previous"
              ?disabled=${!this._canScrollLeft}
              @click=${this._handlePrev}>
              <xe-icon icon="faChevronLeft" size="sm"></xe-icon>
            </xe-icon-button>
          ` : nothing}

          ${!this.hideIndicators ? html `
            <div class="dots" role="tablist" aria-label="Carousel position">
              ${Array.from({ length: this._itemCount }, (_, i) => html `
                <button
                  class="dot ${i === this._currentIndex ? 'active' : ''}"
                  role="tab"
                  aria-selected=${i === this._currentIndex ? 'true' : 'false'}
                  aria-label="Go to item ${i + 1}"
                  @click=${() => this._handleDotClick(i)}>
                </button>
              `)}
            </div>
          ` : nothing}

          ${!this.hideControls ? html `
            <xe-icon-button
              aria-label="Next"
              ?disabled=${!this._canScrollRight}
              @click=${this._handleNext}>
              <xe-icon icon="faChevronRight" size="sm"></xe-icon>
            </xe-icon-button>
          ` : nothing}
        </div>
      ` : nothing}
    `;
    }
};
XECarousel.styles = carousel;
__decorate([
    property({ type: Boolean, attribute: 'hide-controls' })
], XECarousel.prototype, "hideControls", void 0);
__decorate([
    property({ type: Boolean, attribute: 'hide-indicators' })
], XECarousel.prototype, "hideIndicators", void 0);
__decorate([
    property({ type: String })
], XECarousel.prototype, "label", void 0);
__decorate([
    state()
], XECarousel.prototype, "_itemCount", void 0);
__decorate([
    state()
], XECarousel.prototype, "_currentIndex", void 0);
__decorate([
    state()
], XECarousel.prototype, "_canScrollLeft", void 0);
__decorate([
    state()
], XECarousel.prototype, "_canScrollRight", void 0);
__decorate([
    query('.reel-track')
], XECarousel.prototype, "_track", void 0);
__decorate([
    query('slot')
], XECarousel.prototype, "_slot", void 0);
XECarousel = __decorate([
    customElement('xe-carousel')
], XECarousel);
export { XECarousel };
