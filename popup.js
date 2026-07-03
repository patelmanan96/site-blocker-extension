const sitesEl = document.getElementById("sites");
const listLabel = document.getElementById("list-label");
const statusEl = document.getElementById("status");

function updateLabel(mode) {
  listLabel.textContent =
    mode === "block"
      ? "Sites to block (one per line, e.g. facebook.com)"
      : "Only these sites will be allowed (one per line)";
}

chrome.storage.sync.get({ mode: "block", sites: [] }, (d) => {
  document.getElementById(d.mode === "whitelist" ? "mode-whitelist" : "mode-block").checked = true;
  sitesEl.value = d.sites.join("\n");
  updateLabel(d.mode);
});

document.querySelectorAll('input[name="mode"]').forEach((el) => {
  el.addEventListener("change", (e) => updateLabel(e.target.value));
});

document.getElementById("save").addEventListener("click", () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const sites = sitesEl.value
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  chrome.storage.sync.set({ mode, sites }, () => {
    statusEl.textContent = "Saved ✓";
    setTimeout(() => (statusEl.textContent = ""), 1500);
  });
});
