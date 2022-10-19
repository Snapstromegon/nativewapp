import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("wapp-video")
export default class WappVideo extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
    }

    a {
      text-decoration: none;
    }

    article {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      grid-template-rows: auto auto 1fr auto;
      grid-template-areas: "thumb thumb thumb thumb" "date . likes views" "title title title title" "desc desc desc desc";
      background: rgb(34 34 34);
      color: #fff;
      gap: 0.5rem;
      height: 100%;
    }

    .thumbnail {
      grid-area: thumb;
      place-content: cover;
      width: 100%;
      height: auto;
      aspect-ratio: 640/360;
      border-bottom: 3px solid rgb(221 0 153);
    }

    .date {
      grid-area: date;
      margin-left: 1rem;
    }

    .likes {
      grid-area: likes;
    }

    .views {
      grid-area: views;
      margin-right: 1rem;
    }

    .title {
      grid-area: title;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin: 0 1rem;
      font-family: Ubuntu, sans-serif;
      font-weight: 400;
      font-size: 1.25rem;
    }

    svg {
      width: 1rem;
      height: 1rem;
      display: inline-block;
      vertical-align: middle;
    }

    .description {
      grid-area: desc;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      margin: 1rem;
      margin-top: 0;
    }
    .likes,
    .date,
    .views,
    .description {
      color: rgb(153 153 153);
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  `;

  @property({ attribute: false }) video: {
    item: {
      thumbnailUrl: string;
      publishedAt: string;
      likeCount: number;
      viewCount: number;
      title: string;
      description: string;
      youTubeId: string;
    };
  };
  override render() {
    return html` <a
      href="https://app.thenativeweb.io/v2/api/redirect/${this.video.item
        .youTubeId}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label=${this.video.item.title}
      ><article>
        <img
          class="thumbnail"
          src=${"https://app.thenativeweb.io" + this.video.item.thumbnailUrl}
          loading="lazy"
          alt=${`Thumbnail image for video ${this.video.item.title}`}
          width="640"
          height="360"
        />
        <span class="date"
          >${getRelativeTime(new Date(this.video.item.publishedAt))}</span
        >
        <span class="likes"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline"
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
            ></path>
          </svg>
          ${this.video.item.likeCount}</span
        >
        <span class="views"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-3 h-4 w-4 inline"
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          ${this.video.item.viewCount}</span
        >
        <h1 class="title">${this.video.item.title}</h1>
        <p class="description">${this.video.item.description}</p>
      </article></a
    >`;
  }
}

// in miliseconds
var units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

var rtf = new Intl.RelativeTimeFormat("de", { numeric: "auto" });

var getRelativeTime = (d1: Date, d2: Date = new Date()) => {
  var elapsed = d1.getTime() - d2.getTime();

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (var u in units)
    if (Math.abs(elapsed) > units[u] || u == "second")
      return rtf.format(
        Math.round(elapsed / units[u]),
        u as Intl.RelativeTimeFormatUnit
      );
};
