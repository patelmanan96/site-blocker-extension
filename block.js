const quotes = [
  // Youth, time & your 20s / 30s
  ["The best time to plant a tree was 20 years ago. The second best time is now.", "Chinese Proverb"],
  ["In your 20s you build the skills; in your 30s you build the wealth; in your 40s you build the legacy.", "Unknown"],
  ["Your twenties are the perfect time to fail forward — you have nothing to lose and everything to learn.", "Unknown"],
  ["The two most important days in your life are the day you are born and the day you find out why.", "Mark Twain"],
  ["Youth is not a time of life; it is a state of mind.", "Samuel Ullman"],
  ["The days are long, but the decades are short.", "Sam Altman"],
  ["Time is the most valuable thing a man can spend.", "Theophrastus"],
  ["Don't wait. The time will never be just right.", "Napoleon Hill"],
  ["The trouble is, you think you have time.", "Buddha"],
  ["By the time you're 30, discipline should have already replaced motivation.", "Unknown"],
  ["What you do in your 20s and 30s determines the options you have in your 50s and 60s.", "Unknown"],
  ["Compound interest applies to skills, relationships, and reputation — not just money. Start early.", "Unknown"],
  ["The person who starts simply with the intention to start, but with no intention to finish, will never finish.", "Bruce Lee"],
  ["Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did.", "Mark Twain"],
  ["Your time is limited, so don't waste it living someone else's life.", "Steve Jobs"],
  ["You don't need more time, you just need to decide.", "Seth Godin"],
  ["Someday is not a day of the week.", "Denise Brennan-Nelson"],
  ["In 20 years you'll wish you had started today.", "Unknown"],
  ["The earlier you start compounding — money, skills, relationships — the more unfair the advantage becomes.", "Naval Ravikant"],
  ["Your 20s are not a dress rehearsal. They are the opening act.", "Unknown"],
  ["Most people overestimate what they can do in a year, and underestimate what they can do in a decade.", "Bill Gates"],
  ["The best investment you can make is in yourself, especially in your 20s and 30s.", "Warren Buffett"],
  ["By 25 you should know your craft; by 30 you should be dangerous at it.", "Unknown"],
  ["The advantage of youth is you can take risks nobody with a mortgage can.", "Unknown"],
  ["Your network in your 20s becomes your net worth in your 40s.", "Unknown"],
  ["Skills compound faster than money — build them in your 20s and cash out for the rest of your life.", "Unknown"],
  ["Nobody cares how hard you worked in your 20s until you're the only one still standing in your 40s.", "Unknown"],
  ["The 30-year-olds who look like overnight successes were unknown and grinding at 22.", "Unknown"],
  ["Every year you delay starting is a year of compounding you never get back.", "Unknown"],
  ["Youth ends when egotism does; maturity begins when one lives for others.", "Hermann Hesse"],
  ["Take the risk or lose the chance.", "Unknown"],
  ["Now is the worst time to start; and also the best. Start now.", "Unknown"],
  ["You are the average of the five people you spend the most time with.", "Jim Rohn"],
  ["Your income is determined by your habits of thought.", "Napoleon Hill"],
  ["Build your empire in your 20s; enjoy it in your 30s; multiply it in your 40s.", "Unknown"],
  ["The best revenge for a rough childhood is a rich adulthood.", "Unknown"],
  ["Small daily improvements over time lead to stunning results.", "Robin Sharma"],
  ["Motivation is what gets you started. Habit is what keeps you going.", "Jim Ryun"],
  ["Setting goals is the first step in turning the invisible into the visible.", "Tony Robbins"],
  ["The person who starts simply with the intention to start, but with no intention to finish, will never finish.", "Bruce Lee"],
];

const params = new URLSearchParams(location.search);
document.getElementById("site").textContent = params.get("site") || "this site";

if (params.get("reason") === "adult") {
  document.querySelector(".sub").textContent =
    "This category is permanently blocked and can't be changed from settings.";
}

let lastIndex = -1;
function showRandomQuote() {
  let index = Math.floor(Math.random() * quotes.length);
  if (quotes.length > 1) {
    while (index === lastIndex) index = Math.floor(Math.random() * quotes.length);
  }
  lastIndex = index;
  const [quote, author] = quotes[index];
  document.getElementById("quote").textContent = `"${quote}"`;
  document.getElementById("author").textContent = `— ${author}`;
}
showRandomQuote();

document.getElementById("next").addEventListener("click", showRandomQuote);

document.getElementById("back").addEventListener("click", () => {
  if (history.length > 1) {
    history.back();
  } else {
    chrome.tabs.getCurrent((tab) => {
      if (tab) chrome.tabs.remove(tab.id);
    });
  }
});
