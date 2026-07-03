let mode = "block";
let userSites = [];
let adultSet = new Set();

async function loadAdultList() {
  try {
    const res = await fetch(chrome.runtime.getURL("adult-sites.json"));
    adultSet = new Set(await res.json());
  } catch (e) {
    console.error("Focus Blocker: failed to load adult site list", e);
  }
}

// MV3 service workers are killed after ~30s idle and respawn on the next
// navigation event. Without awaiting this, a request that arrives right at
// wake-up would race the fetch/parse of the (large) adult list and get
// silently let through. Every listener below awaits this same promise.
let adultListReady = loadAdultList();

function loadSettings() {
  chrome.storage.sync.get({ mode: "block", sites: [] }, (d) => {
    mode = d.mode;
    userSites = d.sites;
  });
}
loadSettings();
chrome.storage.onChanged.addListener(loadSettings);

// Walks hostname labels (e.g. a.b.example.com -> b.example.com -> example.com)
// so subdomains of a listed domain are matched, and Set lookups stay O(1)
// regardless of list size.
function hostInList(hostname, set) {
  const parts = hostname.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    if (set.has(parts.slice(i).join("."))) return true;
  }
  return false;
}

function hostInArray(hostname, arr) {
  return arr.some((s) => hostname === s || hostname.endsWith("." + s));
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading" || !tab.url) return;
  let url;
  try {
    url = new URL(tab.url);
  } catch (e) {
    return;
  }
  if (!/^https?:$/.test(url.protocol)) return;

  await adultListReady;

  // Adult content is always blocked, in every mode, and cannot be overridden.
  if (hostInList(url.hostname, adultSet)) {
    chrome.tabs.update(tabId, {
      url:
        chrome.runtime.getURL("block.html") +
        "?site=" + encodeURIComponent(url.hostname) +
        "&reason=adult",
    });
    return;
  }

  const isBlocked =
    mode === "block"
      ? hostInArray(url.hostname, userSites)
      : userSites.length > 0 && !hostInArray(url.hostname, userSites);

  if (isBlocked) {
    chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL("block.html") + "?site=" + encodeURIComponent(url.hostname),
    });
  }
});
