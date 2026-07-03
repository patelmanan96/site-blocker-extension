const sitesEl = document.getElementById("sites");
const listLabel = document.getElementById("list-label");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("save");
const confirmPanel = document.getElementById("confirm-panel");
const countdownEl = document.getElementById("countdown");
const confirmInput = document.getElementById("confirm-input");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");
const confirmPhraseLabel = document.getElementById("confirm-phrase-label");

const WAIT_SECONDS = 30;
const CONFIRM_PHRASE = "TURN OFF";
confirmPhraseLabel.textContent = CONFIRM_PHRASE;

let storedMode = "block";
let storedSites = [];
let pending = null;
let countdownInterval = null;

function updateLabel(mode) {
  listLabel.textContent =
    mode === "block"
      ? "Sites to block (one per line, e.g. facebook.com)"
      : "Only these sites will be allowed (one per line)";
}

saveBtn.disabled = true;
chrome.storage.sync.get({ mode: "block", sites: [] }, (d) => {
  storedMode = d.mode;
  storedSites = d.sites;
  document.getElementById(d.mode === "whitelist" ? "mode-whitelist" : "mode-block").checked = true;
  sitesEl.value = d.sites.join("\n");
  updateLabel(d.mode);
  saveBtn.disabled = false;
});

document.querySelectorAll('input[name="mode"]').forEach((el) => {
  el.addEventListener("change", (e) => updateLabel(e.target.value));
});

// A change "loosens" blocking if it drops a previously-blocked site, or
// switches mode while there's an active list in place.
function isLoosening(newMode, newSites) {
  const removedSite = storedSites.some((s) => !newSites.includes(s));
  const modeChanged = newMode !== storedMode;
  const hadActiveBlocking = storedSites.length > 0;
  return removedSite || (modeChanged && hadActiveBlocking);
}

function persist(mode, sites) {
  chrome.storage.sync.set({ mode, sites }, () => {
    storedMode = mode;
    storedSites = sites;
    statusEl.textContent = "Saved ✓";
    setTimeout(() => (statusEl.textContent = ""), 1500);
  });
}

function resetConfirmUI() {
  clearInterval(countdownInterval);
  confirmPanel.classList.add("hidden");
  confirmInput.value = "";
  confirmInput.disabled = true;
  confirmBtn.disabled = true;
  saveBtn.disabled = false;
  pending = null;
}

function startConfirmFlow(mode, sites) {
  pending = { mode, sites };
  saveBtn.disabled = true;
  confirmPanel.classList.remove("hidden");
  confirmInput.disabled = true;
  confirmInput.value = "";
  confirmBtn.disabled = true;

  let remaining = WAIT_SECONDS;
  countdownEl.textContent = remaining;
  countdownInterval = setInterval(() => {
    remaining--;
    countdownEl.textContent = Math.max(remaining, 0);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      confirmInput.disabled = false;
    }
  }, 1000);
}

confirmInput.addEventListener("input", () => {
  confirmBtn.disabled = confirmInput.value.trim().toUpperCase() !== CONFIRM_PHRASE;
});

confirmBtn.addEventListener("click", () => {
  if (!pending) return;
  persist(pending.mode, pending.sites);
  resetConfirmUI();
});

cancelBtn.addEventListener("click", () => {
  resetConfirmUI();
  document.getElementById(storedMode === "whitelist" ? "mode-whitelist" : "mode-block").checked = true;
  sitesEl.value = storedSites.join("\n");
  updateLabel(storedMode);
});

saveBtn.addEventListener("click", () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const sites = sitesEl.value
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (isLoosening(mode, sites)) {
    startConfirmFlow(mode, sites);
  } else {
    persist(mode, sites);
  }
});
