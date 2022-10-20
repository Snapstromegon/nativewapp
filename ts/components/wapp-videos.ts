import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { state } from "lit/decorators/state.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import "./wapp-video.js";

const CHUNK_SIZE = 12;

@customElement("wapp-videos")
export default class WappVideos extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    #videos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
      justify-content: center;
      gap: clamp(1rem, max(3vw, 3vh), 2rem);
      max-width: 80rem;
      width: 100%;
      min-width: 0;
      margin: auto;
    }

    wapp-video {
      will-change: transform;
      transition: transform 0.5s;
      transform-origin: 50% 50%;
      box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    wapp-video:hover {
      transform: scale(1.02);
    }

    #loaderMessage {
      text-align: center;
    }
  `;

  _search = "";

  set search(val: string) {
    let oldVal = this._search;
    this._search = val;
    this.cursor = undefined;
    this.hasNext = true;
    this.videos = [];
    this.fetchAbortController?.abort();
    this.loadVideosData();
    this.requestUpdate("query", oldVal);
  }

  @property({ type: String })
  get search() {
    return this._search;
  }

  videos = [];
  @state() error: string = undefined;
  @state() cursor = undefined;
  @state() allVideosCount = undefined;
  hasNext = true;
  totalCount = 0;
  fetchAbortController: AbortController;
  @query("#intersectionMarker") intersectionMarker: HTMLDivElement;
  observer: IntersectionObserver;
  override render() {
    return html` <div id="videos">
        ${repeat(
          this.videos,
          (video) => video.item.youTubeId,
          (video) => html`<wapp-video .video=${video}></wapp-video>`
        )}
      </div>
      <div id="intersectionMarker"></div>
      <div id="loaderMessage">
        ${when(
          this.videos.length === this.totalCount,
          () =>
            html`<p>
              ${this.totalCount} von ${this.totalCount} gefundenen Videos
            </p>`,
          () =>
            html`${when(
              this.error,
              () => html`<p id="error">${this.error}</p>`,
              () =>
                html`<p>Lade Videos...</p>
                  <p>${this.videos.length} von ${this.totalCount}</p>`
            )}`
        )}
        ${when(
          this.allVideosCount,
          () => html`<p>${this.allVideosCount} Videos insgesamt</p>`
        )}
      </div>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadVideosData();
  }

  constructor() {
    super();
    this.observer = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        this.loadNext();
      }
    });
  }

  protected firstUpdated(): void {
    this.observer.observe(this.intersectionMarker);
  }

  async loadVideosData() {
    this.fetchAbortController?.abort();
    this.fetchAbortController = new AbortController();
    const data = await this.abortableVideoLoad(
      this.search,
      CHUNK_SIZE,
      this.cursor,
      this.fetchAbortController.signal
    ).catch((e) => console.log("Fetch Aborted"));
    if (data) {
      this.cursor = data.items.at(-1).cursor;
      this.hasNext = data.pageInfo.hasNextPage;
      this.totalCount = data.pageInfo.totalCount;
      this.videos.push(...data.items);
      this.allVideosCount = Math.max(
        data.pageInfo.totalCount,
        this.allVideosCount || 0
      );
    }
  }

  async loadNext() {
    if (!this.hasNext) {
      return;
    }
    console.log("Loading next");
    await this.loadVideosData();
  }

  async abortableVideoLoad(
    search,
    limit,
    cursor = undefined,
    signal = undefined
  ) {
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://app.thenativeweb.io/v2/api/search?first=${limit}&query=${search}${
          cursor ? `&after=${cursor}` : ""
        }`
      )}`,
      {
        mode: "cors",
        signal: signal,
      }
    );
    if (response.ok) {
      this.error = undefined;
    } else {
      this.error = response.statusText;
      return;
    }
    const wrappedData = await response.json();
    const data = JSON.parse(wrappedData.contents);
    if (
      wrappedData.status.http_code >= 200 &&
      wrappedData.status.http_code < 300
    ) {
      this.error = undefined;
    } else {
      this.error = data.message;
      return;
    }
    return data;
  }
}
