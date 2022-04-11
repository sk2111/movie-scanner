const puppeteer = require("puppeteer");

const beastMovieUrl = [
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220413", //13 April
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220414", //14 April
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220415", //15 April
];

const theatreNameMatch = "prozone";

async function checkMovie(movieUrl, theatreNameMatch) {
  const browser = await puppeteer.launch();
  movieUrl.forEach(async (url, idx) => {
    const page = await browser.newPage();
    await page.goto(url);
    const names = await page.$$eval(".__venue-name", (theatreNames) => {
      return theatreNames.map((tag) => tag.textContent);
    });
    const isMatchFound = names.find((name) =>
      name.toLowerCase().includes(theatreNameMatch),
    );
    console.log(names);
    console.log("Match found", isMatchFound);
    if (idx === movieUrl.length - 1) {
      // await browser.close();
    }
  });
}

checkMovie(beastMovieUrl, theatreNameMatch);
