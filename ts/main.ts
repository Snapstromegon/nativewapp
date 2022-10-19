import "./components/wapp-search.ts";
import "./components/wapp-videos.ts";
import WappVideos from "./components/wapp-videos.js";

const wappVideos = document.querySelector("wapp-videos") as WappVideos;
document
  .querySelector("wapp-search")
  .addEventListener("search", (e: CustomEvent) => {
    wappVideos.search = e.detail;
  });

if ("serviceWorker" in navigator) {
  try {
    const registration = await navigator.serviceWorker.register(
      "./service-worker.js",
      {
        scope: ".",
      }
    );
    if (registration.installing) {
      console.log("Service worker installing");
    } else if (registration.waiting) {
      console.log("Service worker installed");
    } else if (registration.active) {
      console.log("Service worker active");
    }
  } catch (error) {
    console.error(`Registration failed with ${error}`);
  }
}
