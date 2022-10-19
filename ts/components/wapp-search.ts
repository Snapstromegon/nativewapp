import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("wapp-search")
export default class WappSearch extends LitElement {
  static styles = css`
    form {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
      flex-shrink: 0;
    }
    input {
      border: none;
      width: 100%;
      color: rgb(55 65 81);
      padding: 0.5rem 1rem;
      max-width: auto;
      line-height: inherit;
      font-family: inherit;
      font-size: 1rem;
      font-weight: inherit;
      line-height: inherit;
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  `;

  override render() {
    return html`<form role="search">
      <label for="global-video-search"
        >Videos suchen - die Suche wird automatisch nach dem Tippen
        ausgelöst</label
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-3 cursor-pointer"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <input
        id="global-video-search"
        type="search"
        placeholder="Videos suchen"
        @input=${this.#onChange}
      />
    </form>`;
  }

  #onChange(e) {
    this.dispatchEvent(new CustomEvent("search", { detail: e.target.value }));
  }
}
