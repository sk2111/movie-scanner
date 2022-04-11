const puppeteer = require("puppeteer");

const beastMovieUrl = [
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220413", //13 April
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220414", //14 April
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220415", //15 April
];

const theatreNameMatch = "prozone";

const response = {
  lastUpdated: new Date(),
  error: null,
  theatreInfo: {
    20220413: {
      names: [],
      isMatchFound: false,
    },
    20220414: {
      names: [],
      isMatchFound: false,
    },
    20220415: {
      names: [],
      isMatchFound: false,
    },
  },
};

async function checkMovie(url, theatreNameMatch) {
  const browser = await puppeteer.launch();
  try {
    const key = url.split("/").pop();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });
    const names = await page.$$eval(".__venue-name", (theatreNames) => {
      return theatreNames.map((tag) => tag.textContent);
    });
    const isMatchFound = names.find((name) =>
      name.toLowerCase().includes(theatreNameMatch),
    );
    response.theatreInfo[key].names = names;
    response.theatreInfo[key].isMatchFound = !!isMatchFound;
    console.log(response);
    await browser.close();
  } catch (e) {
    response.error = e.message;
    console.log("oops error", e.message);
  }
}

setInterval(() => {
  try {
    response.lastUpdated = new Date();
    response.error = null;
    beastMovieUrl.forEach(async (url) => {
      checkMovie(url, "kg");
    });
  } catch (e) {
    console.log("oops error", e.message);
  }
}, 5000);
