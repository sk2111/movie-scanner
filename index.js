const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

let browser;
let page;
(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
})();

const beastMovieUrl = [
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220413", //13 April
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220414", //14 April
  "https://in.bookmyshow.com/buytickets/beast-coimbatore/movie-coim-ET00311733-MT/20220415", //15 April
];

const theatreNameMatch = "prozone";

const template = {
  lastUpdated: null,
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

const response = JSON.parse(JSON.stringify(template));

async function checkMovie(url, theatreNameMatch) {
  try {
    const key = url.split("/").pop();
    await page.goto(url, { waitUntil: "load" });
    const names = await page.$$eval(".__venue-name", (theatreNames) => {
      return theatreNames.map((tag) => tag.textContent);
    });
    //console.log("Check names", names);
    const isMatchFound = names.find((name) =>
      name.toLowerCase().includes(theatreNameMatch),
    );
    response.theatreInfo[key].names = names;
    response.theatreInfo[key].isMatchFound = !!isMatchFound;
  } catch (e) {
    response.error = e.message;
    console.log("OOPS ERROR:", e.message);
  }
}

setInterval(async () => {
  response.lastUpdated = new Date().toLocaleString();
  response.error = null;
  await checkMovie(beastMovieUrl[0], theatreNameMatch);
  await checkMovie(beastMovieUrl[1], theatreNameMatch);
  await checkMovie(beastMovieUrl[2], theatreNameMatch);
}, 10000);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/movieInfo", (req, res) => {
  try {
    console.log("Last API Hit time", new Date().toLocaleString());
    res.json(response);
  } catch (e) {
    response.error = e.message;
    console.log("OOPS ERROR TOP:", e.message);
    res.json(response);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
