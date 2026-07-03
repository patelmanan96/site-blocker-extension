const quotes = [
  ["The successful warrior is the average man, with laser-like focus.", "Bruce Lee"],
  ["Wealth consists not in having great possessions, but in having few wants.", "Epictetus"],
  ["It's not whether you get knocked down, it's whether you get up.", "Vince Lombardi"],
  ["Someone's sitting in the shade today because someone planted a tree long ago.", "Warren Buffett"],
  ["The stock market is a device for transferring money from the impatient to the patient.", "Warren Buffett"],
  ["Discipline is the bridge between goals and accomplishment.", "Jim Rohn"],
  ["Fall seven times, stand up eight.", "Japanese Proverb"],
  ["Do not save what is left after spending, spend what is left after saving.", "Warren Buffett"],
  ["Success is stumbling from failure to failure with no loss of enthusiasm.", "Winston Churchill"],
  ["Rich people believe 'I create my life.' Poor people believe 'Life happens to me.'", "T. Harv Eker"],
  ["It's not about ideas. It's about making ideas happen.", "Scott Belsky"],
  ["The comeback is always stronger than the setback.", "Unknown"],
  ["An investment in knowledge pays the best interest.", "Benjamin Franklin"],
  ["Hard work beats talent when talent doesn't work hard.", "Tim Notke"],
  ["Focus on being productive instead of busy.", "Tim Ferriss"],
];

const params = new URLSearchParams(location.search);
document.getElementById("site").textContent = params.get("site") || "this site";

const [quote, author] = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById("quote").textContent = `"${quote}"`;
document.getElementById("author").textContent = `— ${author}`;

document.getElementById("back").addEventListener("click", () => {
  if (history.length > 1) {
    history.back();
  } else {
    chrome.tabs.getCurrent((tab) => {
      if (tab) chrome.tabs.remove(tab.id);
    });
  }
});
