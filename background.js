let mode = "block";
let sites = [];

function load() {
  chrome.storage.sync.get({ mode: "block", sites: [] }, (d) => {
    mode = d.mode;
    sites = d.sites;
  });
}
load();
chrome.storage.onChanged.addListener(load);

function hostMatches(hostname) {
  return sites.some((s) => hostname === s || hostname.endsWith("." + s));
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading" || !tab.url) return;
  let url;
  try {
    url = new URL(tab.url);
  } catch (e) {
    return;
  }
  if (!/^https?:$/.test(url.protocol)) return;

  const isBlocked =
    mode === "block"
      ? hostMatches(url.hostname)
      : sites.length > 0 && !hostMatches(url.hostname);

  if (isBlocked) {
    chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL("block.html") + "?site=" + encodeURIComponent(url.hostname),
    });
  }
});
