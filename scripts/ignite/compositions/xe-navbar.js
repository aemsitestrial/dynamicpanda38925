var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { navbar } from '@ignite/web/tokens/component';
import { shouldOpenDelegate, shouldTransferWhileOpen, shouldTransferToInline, getSearchBar } from './utils/search-routing.js';
import '@ignite/web/primitives/media/logo/xe-logo.js';
import './xe-nav-item.js';
import '@ignite/web/compositions/nav-drawer/xe-nav-drawer.js';
import '@ignite/web/compositions/nav-drawer/xe-nav-drawer-item.js';
import '@ignite/web/primitives/action/icon-button/xe-icon-button.js';
import '@ignite/web/primitives/media/icon/xe-icon.js';
import '@ignite/web/primitives/input-control/search-bar/xe-search-bar.js';
/**
 * XE Navbar Component
 *
 * A self-contained navigation bar.
 *
 * ## Slots
 * - `toolbar-selector` Segmented button (e.g. Residential/Business). Desktop: toolbar left. Mobile: drawer selector.
 * - `toolbar-links`    Toolbar utility links (e.g. Pay Bill, Outages). Rendered left of toolbar-actions in the toolbar end.
 * - `toolbar-actions`  Toolbar actions (e.g. Search, Sign In). Use `data-navbar-only` to prevent forwarding to drawer; `data-drawer-only` to hide in navbar but show in drawer.
 * - `logo`             Brand/logo. Always visible. Consumer decides what to render.
 * - `nav-items`        Desktop nav links. Auto-converted to drawer items on mobile.
 * - `search`           xe-search-bar[collapsed]. Navbar handles inline vs delegate routing.
 * - `actions`          Right-aligned icon buttons etc. Forwarded to drawer on mobile. Same `data-navbar-only` / `data-drawer-only` attributes apply.
 *
 * ## Reflected attributes
 * - `[nav-collapsed]`  Nav items no longer fit; hamburger layout active.
 * - `[no-search]`      No search slot content present; search container hidden.
 * - `[has-toolbar]`    One or more toolbar slots have content.
 * - `[scrolled]`       Page has been scrolled (hero-overlay variant only).
 *
 * @element xe-navbar
 * @fires xe-navbar-menu-open - Hamburger button clicked
 */
let XENavbar = class XENavbar extends LitElement {
    constructor() {
        super(...arguments);
        // ─── Public properties ───────────────────────────────────────────────────────
        this.sticky = false;
        this.heroOverlay = false;
        /**
         * Controls how the search bar routes user interaction.
         *
         * - `auto` (default) — navbar decides based on available free space at click time.
         *   If >= 232px free (280px expanded − 48px already occupied), expands inline.
         *   Otherwise opens the full-screen delegate.
         * - `delegate` — always opens the full-screen delegate, regardless of space.
         * - `inline` — always expands inline, regardless of space. No transfer on resize.
         */
        this.searchMode = 'auto';
        // ─── Reflected state attributes ─────────────────────────────────────────────
        /** True when nav items no longer fit and the hamburger layout is active. */
        this._navCollapsed = false;
        /**
         * True when no search slot content is present. When nav is collapsed and this
         * is set, actions gets flex-grow:1 as a fallback to fill the space left by nav items.
         */
        this._noSearch = true;
        /** True when no actions slot content is present. Hides the actions container to avoid spurious gap. */
        this._noActions = true;
        /** True when at least one toolbar slot has content. Controls toolbar visibility. */
        this._hasToolbar = false;
        /** True when the page has been scrolled. Used by the hero-overlay variant. */
        this._scrolled = false;
        /** True when the hero-overlay navbar background has crossed the opaque threshold. */
        this._navbarOpaque = false;
        // ─── Private state ───────────────────────────────────────────────────────────
        /**
         * The recorded sum of all flex children's offsetWidths plus fixed padding and
         * gaps, measured while the layout is in its full natural state (nav items present,
         * search at 48px collapsed width, flex-grow inactive on all children).
         *
         * This value is used to compare against the navbar's available width on every
         * resize tick. It is NOT updated after nav items are removed or search expands,
         * because in those states flex-grow activates and re-measuring would return a
         * value equal to the navbar's full width — incorrectly suggesting everything fits.
         */
        this._naturalWidth = 0;
        /**
         * True when the search bar is currently expanded inline. Tracked so the resize
         * handler knows whether to check shouldTransferWhileOpen on each tick.
         */
        this._searchOpen = false;
        this._delegateOpen = false;
        this._drawerOpen = false;
        this._drawerContentBuilt = false;
        this._logoCompact = false;
        this._lockupLogoWidth = 0;
        this._currentOpacity = 0;
        this._scrollListener = this._handleScroll.bind(this);
        this._drawerCloseListener = this._handleDrawerClose.bind(this);
        /**
         * Capture-phase click listener attached to the xe-search-bar element.
         * Fires before the search bar's own click handler, letting the navbar intercept
         * and decide inline vs delegate before the search bar opens itself.
         */
        this._searchClickListener = this._handleSearchClick.bind(this);
        /**
         * Tracks whether the search bar is currently open inline.
         * xe-search-bar fires xe-search-bar-resize on every open/close transition.
         */
        this._handleSearchResize = () => {
            if (!this.shadowRoot)
                return;
            const searchBar = getSearchBar(this.shadowRoot);
            this._searchOpen = !!searchBar?._open;
            this._delegateOpen = !!searchBar?._delegateOpen;
        };
    }
    // ─── Lifecycle ───────────────────────────────────────────────────────────────
    connectedCallback() {
        super.connectedCallback();
        if (this.heroOverlay) {
            this._updateOverlayBackground();
            window.addEventListener('scroll', this._scrollListener);
            setTimeout(() => this._updateLogoVariant(), 0);
            this._themeObserver = new MutationObserver(() => {
                this._updateOverlayBackground();
                this._updateLogoVariant();
            });
            this._themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-theme'],
            });
        }
        this._resizeObserver = new ResizeObserver(() => this._checkOverflow());
        this._resizeObserver.observe(this);
        document.addEventListener('xe-nav-drawer-close', this._drawerCloseListener);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('scroll', this._scrollListener);
        this._themeObserver?.disconnect();
        this._resizeObserver?.disconnect();
        document.removeEventListener('xe-nav-drawer-close', this._drawerCloseListener);
    }
    async firstUpdated() {
        await this.updateComplete;
        this._hasToolbar = ['toolbar-selector', 'toolbar-mobile-selector', 'toolbar-links', 'toolbar-actions'].some(name => {
            const slot = this.shadowRoot?.querySelector(`slot[name="${name}"]`);
            return (slot?.assignedElements().length ?? 0) > 0;
        });
        this._updateSearchSlotPresence(); // also calls _attachSearchListener
        this._updateActionsSlotPresence();
        this._checkOverflow();
    }
    updated(changedProperties) {
        if (changedProperties.has('heroOverlay')) {
            if (this.heroOverlay) {
                this._updateOverlayBackground();
                window.addEventListener('scroll', this._scrollListener);
            }
            else {
                window.removeEventListener('scroll', this._scrollListener);
            }
        }
        if (changedProperties.has('_drawerOpen') && this._drawerOpen && !this._drawerContentBuilt) {
            this._buildDrawerContent();
            this._drawerContentBuilt = true;
        }
        if (changedProperties.has('_navCollapsed')) {
            // Re-evaluate logo type after Lit finishes re-rendering (nav items added/removed).
            // _updateLogoType called from _checkOverflow fires before the re-render, so
            // siblingWidth incorrectly includes nav items when transitioning to collapsed.
            this._updateLogoType();
        }
    }
    // ─── Overflow / collapse detection ──────────────────────────────────────────
    /**
     * Measures the natural width of all flex children and compares it to the
     * navbar's available width to determine whether nav items should be collapsed.
     *
     * Natural width = sum of each flex child's offsetWidth + fixed padding + gaps.
     * This is measured from the actual rendered DOM — not assumed from slot configuration.
     *
     * The recorded value (_naturalWidth) is only updated when the layout is fully
     * stable: nav items in DOM and flex-grow not active. Once nav items are removed,
     * the auto margin fills the gap, and re-measuring would return the navbar's full
     * width — incorrectly suggesting everything fits.
     *
     * If search is currently open inline and the navbar shrinks below the threshold
     * for inline expansion, the search bar is transferred to the delegate (auto mode only).
     */
    _checkOverflow() {
        const navbarEl = this._getNavbarEl();
        if (!navbarEl)
            return;
        if (!this._navCollapsed) {
            this._naturalWidth = this._measureNaturalWidth(navbarEl);
        }
        // Hysteresis: collapse when content is tight, but require 32px of clearance
        // before uncollapsing. Prevents oscillation when the viewport sits exactly
        // on the threshold.
        const UNCOLLAPSE_MARGIN = 32;
        const shouldCollapse = this._naturalWidth > navbarEl.offsetWidth;
        const shouldUncollapse = this._naturalWidth + UNCOLLAPSE_MARGIN <= navbarEl.offsetWidth;
        const newCollapsed = this._navCollapsed ? !shouldUncollapse : shouldCollapse;
        if (newCollapsed !== this._navCollapsed) {
            this._navCollapsed = newCollapsed;
            this._applyCollapseToDrawerVisibility(newCollapsed);
            this._updateActionsSlotPresence();
            if (!newCollapsed && this._drawerOpen) {
                this._drawerOpen = false;
                this._drawerContentBuilt = false;
            }
        }
        if (this.searchMode === 'auto' && this.shadowRoot) {
            const searchBar = getSearchBar(this.shadowRoot);
            if (this._searchOpen && shouldTransferWhileOpen(this.shadowRoot)) {
                searchBar?.transferToDelegate?.();
                this._searchOpen = false;
            }
            else if (this._delegateOpen && !this._navCollapsed && shouldTransferToInline(this.shadowRoot)) {
                const value = searchBar?.value ?? '';
                searchBar?.transferToInline?.(value);
                this._delegateOpen = false;
            }
        }
        this._updateLogoType();
    }
    /**
     * Measures the total natural width of all flex children currently in the DOM,
     * plus the navbar's fixed horizontal padding and inter-child gaps.
     *
     * - Padding: 32px each side = 64px total (content-inset.spacious = space-4xl)
     * - Gap: 32px between each flex child (inline-gap-xl = space-4xl)
     * - Gap count: number of gaps = number of visible children − 1
     */
    _measureNaturalWidth(navbarEl) {
        const PADDING = 64; // 32px left + 32px right
        const GAP = 32; // --xe-spacing-inline-gap-xl
        const children = Array.from(navbarEl.children);
        const visibleChildren = children.filter(el => el.offsetWidth > 0);
        const childrenWidth = visibleChildren.reduce((sum, el) => sum + el.offsetWidth, 0);
        const gapWidth = Math.max(0, visibleChildren.length - 1) * GAP;
        return PADDING + childrenWidth + gapWidth;
    }
    // ─── Search routing ──────────────────────────────────────────────────────────
    /**
     * Attaches a capture-phase click listener to xe-search-bar and a bubbling
     * xe-search-bar-resize listener to track open/closed state.
     * Called after first render and again whenever the search slot changes.
     */
    _attachSearchListener() {
        if (!this.shadowRoot)
            return;
        const searchBar = getSearchBar(this.shadowRoot);
        if (!searchBar)
            return;
        searchBar.removeEventListener('click', this._searchClickListener, true);
        searchBar.removeEventListener('xe-search-bar-resize', this._handleSearchResize);
        searchBar.addEventListener('click', this._searchClickListener, true);
        searchBar.addEventListener('xe-search-bar-resize', this._handleSearchResize);
    }
    /**
     * Capture-phase click handler. Fires before the search bar's own handler so the
     * navbar can intercept and route the interaction before the bar opens itself.
     *
     * - `delegate`: always open delegate; stop propagation so bar doesn't expand inline.
     * - `inline`: always expand inline; let the event through.
     * - `auto`: measure free space and decide.
     */
    _handleSearchClick(e) {
        if (!this.shadowRoot)
            return;
        const searchBar = getSearchBar(this.shadowRoot);
        if (!searchBar)
            return;
        // If inline or delegate is already open, let the search bar handle the event normally
        if (searchBar._open || searchBar._delegateOpen)
            return;
        // A synthetic MouseEvent dispatched from a keyboard handler has detail === 0
        const keyboardOpen = e.detail === 0;
        if (this.searchMode === 'delegate') {
            e.stopPropagation();
            searchBar.openDelegate?.(keyboardOpen);
            return;
        }
        if (this.searchMode === 'inline') {
            e.stopPropagation();
            searchBar.openInline?.();
            return;
        }
        // auto: measure available space and decide
        e.stopPropagation();
        if (shouldOpenDelegate(this.shadowRoot)) {
            searchBar.openDelegate?.(keyboardOpen);
        }
        else {
            searchBar.openInline?.();
        }
    }
    // ─── Slot presence detection ─────────────────────────────────────────────────
    /**
     * Checks whether the search slot has content and sets [no-search] accordingly.
     * Controls whether actions gets flex-grow:1 as a fallback when nav is collapsed.
     */
    _applyCollapseToDrawerVisibility(collapsed) {
        Array.from(this.querySelectorAll('[data-collapse-to-drawer]')).forEach(el => {
            el.style.display = collapsed ? 'none' : '';
        });
    }
    _markDrawerDirty() {
        this._drawerContentBuilt = false;
    }
    _onLogoSlotChange() {
        this._drawerContentBuilt = false;
        // Reset cached lockup width so it re-measures with new logo content.
        this._lockupLogoWidth = 0;
    }
    _updateSearchSlotPresence() {
        const searchSlot = this.shadowRoot?.querySelector('slot[name="search"]');
        const hasSearch = (searchSlot?.assignedElements().length ?? 0) > 0;
        this._noSearch = !hasSearch;
        this._attachSearchListener();
    }
    _updateActionsSlotPresence() {
        const actionsSlot = this.shadowRoot?.querySelector('slot[name="actions"]');
        const assigned = actionsSlot?.assignedElements() ?? [];
        const hasVisible = assigned.some(el => {
            const children = Array.from(el.children);
            const candidates = children.length > 0 ? children : [el];
            return candidates.some(candidate => {
                if (candidate.hasAttribute('data-drawer-only'))
                    return false;
                if (this._navCollapsed && candidate.hasAttribute('data-collapse-to-drawer'))
                    return false;
                return true;
            });
        });
        this._noActions = !hasVisible;
    }
    /**
  
    // ─── Logo type switching ─────────────────────────────────────────────────────
  
    /**
     * Switches the slotted xe-logo between lockup (full wordmark) and mark (swirl)
     * depending on whether there is enough horizontal room in the navbar for the
     * full logo without squeezing the container padding.
     *
     * The lockup width is captured the first time the logo is measured in its
     * natural state (before any compaction), then reused on every resize tick.
     * The mark is never wider than the lockup, so it never triggers another measurement.
     */
    _updateLogoType() {
        const logoSlot = this.shadowRoot?.querySelector('slot[name="logo"]');
        if (!logoSlot)
            return;
        const logos = logoSlot.assignedElements().filter(el => el.tagName.toLowerCase() === 'xe-logo');
        if (!logos.length)
            return;
        const logoEl = logos[0];
        // Capture the lockup width whenever the logo is in lockup form and has rendered width.
        // Re-capture if it was previously measured as 0 (e.g. logo not yet painted on first tick).
        if (!this._logoCompact && logoEl.offsetWidth > 0) {
            this._lockupLogoWidth = logoEl.offsetWidth;
        }
        if (this._lockupLogoWidth === 0)
            return;
        const logoContainer = this.shadowRoot?.querySelector('.navbar-logo');
        if (!logoContainer)
            return;
        // Available room = total navbar width minus everything except the logo container.
        // offsetWidth of the logo container itself tells us how much space is currently
        // allocated — but we need to know how much would be needed for the lockup.
        const navbarEl = this._getNavbarEl();
        if (!navbarEl)
            return;
        // Sum widths of all sibling flex children (hamburger, nav-items, navbar-right)
        const siblingWidth = Array.from(navbarEl.children)
            .filter(el => !el.classList.contains('navbar-logo') && el.offsetWidth > 0)
            .reduce((sum, el) => sum + el.offsetWidth, 0);
        const PADDING = 64; // 32px each side
        const GAP = 32; // --navbar-gap between each flex child
        const visibleChildCount = Array.from(navbarEl.children)
            .filter(el => el.offsetWidth > 0).length;
        const gaps = Math.max(0, visibleChildCount - 1) * GAP;
        const available = navbarEl.offsetWidth - PADDING - siblingWidth - gaps;
        const needsMark = available < this._lockupLogoWidth;
        if (needsMark === this._logoCompact)
            return;
        this._logoCompact = needsMark;
        logos.forEach(logo => logo.setAttribute('type', needsMark ? 'mark' : 'lockup'));
    }
    // ─── DOM helpers ─────────────────────────────────────────────────────────────
    _getNavbarEl() {
        return this.shadowRoot?.querySelector('.navbar');
    }
    // ─── Overlay / scroll ────────────────────────────────────────────────────────
    _handleScroll() {
        if (this.heroOverlay)
            this._updateOverlayBackground();
    }
    _updateOverlayBackground() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const rgb = theme === 'dark' ? '0, 0, 0' : '255, 255, 255';
        const scrollY = window.scrollY;
        const opacity = Math.min(scrollY / 150, 1);
        this.style.setProperty('--navbar-overlay-bg', `rgba(${rgb}, ${opacity})`);
        const previousOpacity = this._currentOpacity;
        this._currentOpacity = opacity;
        const wasScrolled = this._scrolled;
        this._scrolled = scrollY > 0;
        const threshold = 0.7;
        const crossedThreshold = (previousOpacity < threshold && this._currentOpacity >= threshold) ||
            (previousOpacity >= threshold && this._currentOpacity < threshold);
        this._navbarOpaque = this._currentOpacity >= threshold;
        if (crossedThreshold || wasScrolled !== this._scrolled) {
            this._updateLogoVariant();
        }
    }
    _updateLogoVariant() {
        const logoSlot = this.shadowRoot?.querySelector('slot[name="logo"]');
        if (!logoSlot)
            return;
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        logoSlot.assignedElements()
            .filter(el => el.tagName.toLowerCase() === 'xe-logo')
            .forEach(logo => {
            const variant = theme === 'dark' ? 'inverse' : (this._currentOpacity >= 0.7 ? 'primary' : 'inverse');
            logo.setAttribute('variant', variant);
        });
    }
    // ─── Drawer content builder ──────────────────────────────────────────────────
    _buildDrawerContent() {
        const drawer = this.shadowRoot?.querySelector('xe-nav-drawer');
        if (!drawer)
            return;
        Array.from(drawer.children)
            .filter(el => el.hasAttribute('data-generated'))
            .forEach(el => el.remove());
        Array.from(this.children)
            .filter(el => el.getAttribute('slot') === 'logo')
            .forEach(el => {
            const clone = el.cloneNode(true);
            clone.setAttribute('slot', 'logo');
            clone.setAttribute('data-generated', '');
            // Drawer always shows the full lockup in primary variant regardless of navbar state.
            if (clone.tagName.toLowerCase() === 'xe-logo') {
                clone.setAttribute('type', 'lockup');
                clone.setAttribute('variant', 'primary');
            }
            drawer.appendChild(clone);
        });
        const navItemsContainer = Array.from(this.children).find(el => el.getAttribute('slot') === 'nav-items');
        if (navItemsContainer) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('slot', 'nav-items');
            wrapper.setAttribute('data-generated', '');
            Array.from(navItemsContainer.children)
                .filter(el => el.tagName.toLowerCase() === 'xe-nav-item')
                .forEach(navItem => wrapper.appendChild(this._convertNavItemToDrawerItem(navItem)));
            if (wrapper.children.length)
                drawer.appendChild(wrapper);
        }
        const lightChildren = Array.from(this.children);
        const actionEls = lightChildren.filter(el => el.getAttribute('slot') === 'actions' || el.getAttribute('slot') === 'toolbar-actions' || el.getAttribute('slot') === 'toolbar-links');
        // Collect forwarded actions — look inside each wrapper for individual data-* overrides.
        // An element with data-navbar-only is skipped; data-drawer-only or no attribute is forwarded.
        const forwardedActions = [];
        actionEls.forEach(wrapper => {
            if (wrapper.hasAttribute('data-navbar-only'))
                return;
            const children = Array.from(wrapper.children);
            if (children.length === 0) {
                // Wrapper has no children — clone it as-is
                forwardedActions.push(wrapper.cloneNode(true));
            }
            else {
                // Clone only children not marked data-navbar-only
                const kept = children.filter(el => !el.hasAttribute('data-navbar-only'));
                if (kept.length) {
                    const clone = wrapper.cloneNode(false);
                    kept.forEach(el => {
                        // xe-menu-button in the drawer: replace with an icon button that
                        // pushes a nav-drawer panel instead of opening a floating menu.
                        if (el.tagName.toLowerCase() === 'xe-menu-button') {
                            clone.appendChild(this._menuButtonToDrawerAction(el));
                            return;
                        }
                        const elClone = el.cloneNode(true);
                        // Strip inline display:none added by visibility helpers
                        if (el.hasAttribute('data-collapse-to-drawer') || el.hasAttribute('data-drawer-only')) {
                            elClone.style.display = '';
                        }
                        // Apply drawer-specific attribute overrides
                        if (el.hasAttribute('data-drawer-treatment')) {
                            elClone.setAttribute('treatment', el.getAttribute('data-drawer-treatment'));
                        }
                        clone.appendChild(elClone);
                    });
                    forwardedActions.push(clone);
                }
            }
        });
        if (forwardedActions.length) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('slot', 'actions');
            wrapper.setAttribute('data-generated', '');
            forwardedActions.forEach(el => wrapper.appendChild(el));
            drawer.appendChild(wrapper);
        }
        const selectorEls = lightChildren.filter(el => el.getAttribute('slot') === 'toolbar-selector');
        if (selectorEls.length) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('slot', 'selector');
            wrapper.setAttribute('data-generated', '');
            wrapper.style.width = '100%';
            selectorEls.forEach(el => wrapper.appendChild(el.cloneNode(true)));
            drawer.appendChild(wrapper);
        }
    }
    /**
     * Converts a xe-menu-button to an xe-icon-button that pushes a drawer panel
     * instead of opening a floating menu.
     */
    _menuButtonToDrawerAction(menuButton) {
        const btn = document.createElement('xe-icon-button');
        const ariaLabel = menuButton.getAttribute('label') ?? 'Open menu';
        btn.setAttribute('aria-label', ariaLabel);
        const icon = document.createElement('xe-icon');
        const iconName = menuButton.getAttribute('icon') ?? 'faEllipsis';
        icon.setAttribute('icon', iconName);
        icon.setAttribute('size', 'sm');
        btn.appendChild(icon);
        btn.addEventListener('click', () => {
            const menuItems = Array.from(menuButton.querySelectorAll('xe-menu-item'));
            const children = menuItems.map(item => {
                const drawerItem = document.createElement('xe-nav-drawer-item');
                drawerItem.setAttribute('label', item.getAttribute('label') ?? '');
                const href = item.getAttribute('href');
                if (href && href !== 'javascript:void(0)')
                    drawerItem.setAttribute('href', href);
                if (item.hasAttribute('selected'))
                    drawerItem.setAttribute('selected', '');
                return drawerItem;
            });
            btn.dispatchEvent(new CustomEvent('xe-nav-drawer-item-expand', {
                bubbles: true,
                composed: true,
                detail: { label: ariaLabel, children },
            }));
        });
        return btn;
    }
    _convertNavItemToDrawerItem(navItem) {
        const item = document.createElement('xe-nav-drawer-item');
        const label = Array.from(navItem.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent?.trim() ?? '')
            .join('').trim();
        item.setAttribute('label', label);
        const href = navItem.getAttribute('href');
        if (href && href !== 'javascript:void(0)')
            item.setAttribute('href', href);
        const submenu = navItem.querySelector(':scope > xe-menu[slot="submenu"]');
        if (submenu) {
            Array.from(submenu.children)
                .filter(el => el.tagName.toLowerCase() === 'xe-menu-item')
                .forEach(menuItem => {
                const child = this._convertMenuItemToDrawerItem(menuItem);
                child.setAttribute('slot', 'children');
                item.appendChild(child);
            });
        }
        return item;
    }
    _convertMenuItemToDrawerItem(menuItem) {
        const item = document.createElement('xe-nav-drawer-item');
        item.setAttribute('label', menuItem.getAttribute('label') ?? '');
        const href = menuItem.getAttribute('href');
        if (href && href !== 'javascript:void(0)')
            item.setAttribute('href', href);
        const submenu = menuItem.querySelector(':scope > xe-menu[slot="submenu"]');
        if (submenu) {
            Array.from(submenu.children)
                .filter(el => el.tagName.toLowerCase() === 'xe-menu-item')
                .forEach(nested => {
                const child = this._convertMenuItemToDrawerItem(nested);
                child.setAttribute('slot', 'children');
                item.appendChild(child);
            });
        }
        return item;
    }
    // ─── Hamburger / drawer ──────────────────────────────────────────────────────
    _onMenuOpen() {
        this._drawerOpen = true;
        this.dispatchEvent(new CustomEvent('xe-navbar-menu-open', { bubbles: true, composed: true }));
    }
    _handleDrawerClose() {
        this._drawerOpen = false;
        this._drawerContentBuilt = false;
    }
    // ─── Render ──────────────────────────────────────────────────────────────────
    render() {
        return html `
      ${this._drawerOpen ? html `
        <xe-nav-drawer
          id="xe-nav-drawer"
          .open="${this._drawerOpen}"
          @xe-nav-drawer-close="${this._handleDrawerClose}">
        </xe-nav-drawer>
      ` : nothing}

      <div class="toolbar ${this._hasToolbar ? 'has-toolbar' : ''}">
        <div class="toolbar-start">
          ${this._navCollapsed
            ? html `<slot name="toolbar-mobile-selector"></slot>`
            : html `<slot name="toolbar-selector" @slotchange="${this._markDrawerDirty}"></slot>`}
        </div>
        <div class="toolbar-end">
          <div class="toolbar-end-links">
            <slot name="toolbar-links"></slot>
          </div>
          <div class="toolbar-end-actions">
            <slot name="toolbar-actions"></slot>
          </div>
        </div>
      </div>

      <nav class="navbar" aria-label="Main">
        ${this._navCollapsed ? html `
          <xe-icon-button
            class="navbar-hamburger"
            aria-label="Open navigation menu"
            aria-expanded="${this._drawerOpen}"
            aria-controls="xe-nav-drawer"
            @click="${this._onMenuOpen}">
            <xe-icon icon="faBars" size="sm"></xe-icon>
          </xe-icon-button>
        ` : nothing}

        <div class="navbar-logo">
          <slot name="logo" @slotchange="${this._onLogoSlotChange}"></slot>
        </div>

        ${!this._navCollapsed ? html `
          <div class="navbar-nav-items">
            <slot name="nav-items" @slotchange="${this._markDrawerDirty}"></slot>
          </div>
        ` : ''}

        <div class="navbar-right">
          <div class="navbar-search ${this._noSearch ? 'no-search' : ''}">
            <slot name="search" @slotchange="${this._updateSearchSlotPresence}"></slot>
          </div>

          ${!this._noActions ? html `
            <div class="navbar-actions">
              <slot name="actions" @slotchange="${() => { this._markDrawerDirty(); this._updateActionsSlotPresence(); }}"></slot>
            </div>
          ` : nothing}
        </div>

        ${this._noActions ? html `<slot name="actions" style="display:none" @slotchange="${() => { this._markDrawerDirty(); this._updateActionsSlotPresence(); }}"></slot>` : nothing}
      </nav>
    `;
    }
};
XENavbar.styles = [navbar];
__decorate([
    property({ type: Boolean, reflect: true })
], XENavbar.prototype, "sticky", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'hero-overlay' })
], XENavbar.prototype, "heroOverlay", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'toolbar-variant' })
], XENavbar.prototype, "toolbarVariant", void 0);
__decorate([
    property({ type: String, attribute: 'search-mode' })
], XENavbar.prototype, "searchMode", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'nav-collapsed' })
], XENavbar.prototype, "_navCollapsed", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-search' })
], XENavbar.prototype, "_noSearch", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-actions' })
], XENavbar.prototype, "_noActions", void 0);
__decorate([
    property({ type: Boolean, attribute: 'has-toolbar' })
], XENavbar.prototype, "_hasToolbar", void 0);
__decorate([
    property({ type: Boolean, attribute: 'scrolled' })
], XENavbar.prototype, "_scrolled", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'navbar-opaque' })
], XENavbar.prototype, "_navbarOpaque", void 0);
__decorate([
    state()
], XENavbar.prototype, "_drawerOpen", void 0);
XENavbar = __decorate([
    customElement('xe-navbar')
], XENavbar);
export { XENavbar };
