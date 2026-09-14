var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { youtubeEmbed } from '@ignite/web/tokens/component';
/**
 * `<xe-youtube-embed>` is a lightweight YouTube embed with thumbnail-first loading
 * and GA4 video event tracking.
 *
 * On mobile (≤768px) a native iframe is rendered directly; on desktop a thumbnail
 * is shown first and the YouTube IFrame API player loads on click.
 *
 * @element xe-youtube-embed
 *
 * @prop {string} videoid - YouTube video ID
 * @prop {string} title - Accessible title for the video (used as aria-label and GA4 event label)
 * @prop {string} poster - Optional custom thumbnail URL. Falls back to YouTube's auto-generated thumbnail.
 * @prop {string} params - YouTube player parameters (default: 'rel=0&cc_load_policy=1&hl=en')
 */
let XEYoutubeEmbed = class XEYoutubeEmbed extends LitElement {
    constructor() {
        super(...arguments);
        this.videoid = '';
        this.videoTitle = '';
        this.poster = '';
        this.params = 'rel=0&cc_load_policy=1&hl=en';
        this._activated = false;
        this._thumbnailSrc = '';
        this._isMobile = window.innerWidth <= 768;
        this._player = null;
        this._progressInterval = null;
        this._progressTracked = { 25: false, 50: false, 75: false };
        this._duration = 0;
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this._isMobile) {
            this._addPrefetch('preconnect', 'https://www.youtube-nocookie.com');
            this._addPrefetch('preconnect', 'https://www.google.com');
            this._loadYouTubeAPI();
            if (this.poster) {
                this._thumbnailSrc = this.poster;
            }
            else {
                this._loadThumbnail();
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._progressInterval)
            clearInterval(this._progressInterval);
        if (this._player?.destroy)
            this._player.destroy();
    }
    updated(changed) {
        if (changed.has('_activated') && this._activated) {
            this._initPlayer();
        }
    }
    async _loadThumbnail() {
        const qualities = ['maxresdefault', 'sddefault', 'hqdefault'];
        for (const quality of qualities) {
            const url = `https://i.ytimg.com/vi/${this.videoid}/${quality}.jpg`;
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    this._thumbnailSrc = url;
                    return;
                }
            }
            catch {
                // Try next quality
            }
        }
        this._thumbnailSrc = `https://i.ytimg.com/vi/${this.videoid}/hqdefault.jpg`;
    }
    _addPrefetch(kind, url) {
        const link = document.createElement('link');
        link.rel = kind;
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.append(link);
    }
    _loadYouTubeAPI() {
        if (!window.YT && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    }
    _initPlayer() {
        const playerEl = this.renderRoot.querySelector('.xeyt-player');
        if (!playerEl)
            return;
        const playerVars = Object.fromEntries(new URLSearchParams(this.params));
        playerVars['autoplay'] = '1';
        const create = () => {
            this._player = new window.YT.Player(playerEl, {
                videoId: this.videoid,
                width: '100%',
                height: '100%',
                playerVars,
                events: {
                    onReady: this._onPlayerReady.bind(this),
                    onStateChange: this._onPlayerStateChange.bind(this),
                },
            });
        };
        if (window.YT?.Player) {
            create();
        }
        else {
            const prev = window.onYouTubeIframeAPIReady ?? (() => { });
            window.onYouTubeIframeAPIReady = () => { prev(); create(); };
        }
    }
    _onPlayerReady(event) {
        this._duration = event.target.getDuration();
        this._trackEvent('video_start', {
            video_title: this.videoTitle,
            video_id: this.videoid,
            video_duration: Math.round(this._duration),
            video_provider: 'youtube',
        });
        this._startProgressTracking();
    }
    _onPlayerStateChange(event) {
        if (event.data === window.YT.PlayerState.ENDED) {
            this._trackEvent('video_complete', {
                video_title: this.videoTitle,
                video_id: this.videoid,
                video_provider: 'youtube',
            });
            if (this._progressInterval)
                clearInterval(this._progressInterval);
        }
        else if (event.data === window.YT.PlayerState.PAUSED) {
            const currentTime = this._player.getCurrentTime();
            this._trackEvent('video_pause', {
                video_title: this.videoTitle,
                video_id: this.videoid,
                video_percent: Math.round((currentTime / this._duration) * 100),
                video_current_time: Math.round(currentTime),
                video_provider: 'youtube',
            });
        }
    }
    _startProgressTracking() {
        this._progressInterval = setInterval(() => {
            if (!this._player?.getCurrentTime)
                return;
            const currentTime = this._player.getCurrentTime();
            const percent = (currentTime / this._duration) * 100;
            [25, 50, 75].forEach(milestone => {
                if (percent >= milestone && !this._progressTracked[milestone]) {
                    this._progressTracked[milestone] = true;
                    this._trackEvent('video_progress', {
                        video_title: this.videoTitle,
                        video_id: this.videoid,
                        video_percent: milestone,
                        video_current_time: Math.round(currentTime),
                        video_provider: 'youtube',
                    });
                }
            });
            if (this._progressTracked[75])
                clearInterval(this._progressInterval);
        }, 1000);
    }
    _trackEvent(eventName, params) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
        else {
            console.warn('[xe-youtube-embed] gtag not found — GA4 tracking unavailable');
        }
    }
    render() {
        if (this._isMobile) {
            return html `
        <div class="xeyt-container">
          <iframe
            src="https://www.youtube.com/embed/${this.videoid}?${this.params}"
            title=${this.videoTitle}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>
      `;
        }
        if (this._activated) {
            return html `
        <div class="xeyt-container">
          <div class="xeyt-player"></div>
        </div>
      `;
        }
        return html `
      <div class="xeyt-container" @click=${() => { this._activated = true; }}>
        <img
          class="xeyt-thumbnail"
          src=${this._thumbnailSrc}
          alt=${this.videoTitle}
          loading="lazy">
        <button type="button" class="xeyt-playbtn" aria-label=${'Play: ' + this.videoTitle}>
          <svg class="xeyt-playicon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="currentColor"/>
            <path d="M9 7.5L17 12L9 16.5V7.5Z" fill="white"/>
          </svg>
        </button>
      </div>
    `;
    }
};
XEYoutubeEmbed.styles = youtubeEmbed;
__decorate([
    property({ type: String })
], XEYoutubeEmbed.prototype, "videoid", void 0);
__decorate([
    property({ type: String, attribute: 'title' })
], XEYoutubeEmbed.prototype, "videoTitle", void 0);
__decorate([
    property({ type: String })
], XEYoutubeEmbed.prototype, "poster", void 0);
__decorate([
    property({ type: String })
], XEYoutubeEmbed.prototype, "params", void 0);
__decorate([
    state()
], XEYoutubeEmbed.prototype, "_activated", void 0);
__decorate([
    state()
], XEYoutubeEmbed.prototype, "_thumbnailSrc", void 0);
XEYoutubeEmbed = __decorate([
    customElement('xe-youtube-embed')
], XEYoutubeEmbed);
export { XEYoutubeEmbed };
