const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs").promises;
const path = require("path");
const converter = require("json-2-csv");

puppeteer.use(stealthPlugin());

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + days);
  return this;
};

const flightPage = async (page) => {
  const result = await page.evaluate(() => {
    const faresTables = document.querySelectorAll(
      "tbody:nth-of-type(1) .calendarPerBound-fare"
    );
    return Array.from(faresTables).map((fareSection, index) => {
      const dateFare = Array.from(
        fareSection.querySelectorAll(".calendarPerBound-date-section > div")
      ).map((div) => div.innerText);
      const price = fareSection.querySelector(".price-amount");
      return {
        type: index < 7 ? "aller" : "retour",
        date: dateFare.toString().replaceAll(",", ""),
        price: price ? price.innerText : null,
      };
    });
  });
  return result;
};

const [day, month, year] = process.argv[2]
  .split("/")
  .map((component) => parseInt(component));
const [dayEnd, monthEnd, yearEnd] = process.argv[3]
  .split("/")
  .map((component) => parseInt(component));

const patform = process.platform;
console.log("Scraper running on platform: ", patform);
let executablePath;
let userDataDir;
if (/^win/i.test(patform)) {
  executablePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
  userDataDir = path.join(
    process.env.LocalAppData,
    "Google/Chrome/User Data/Default"
  );
} else if (/^linux/i.test(patform)) {
  executablePath = "/opt/google/chrome/google-chrome";
  userDataDir = "/home/msiubuntu/.config/google-chrome/Default";
}

puppeteer
  .launch({
    headless: false,
    executablePath,
    userDataDir,
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  .then(async (browser) => {
    const [page] = await browser.pages();
    try {
      await fs.access("cookies/history.txt");
      await fs.access("data");
    } catch (error) {
      await fs.mkdir("cookies", { recursive: true });
      await fs.mkdir("data", { recursive: true });
      await fs.writeFile("cookies/history.txt", "");
    }
    await fs.mkdir("cookies", { recursive: true });
    var date = new Date(year, month - 1, day);
    const dateEndTime = new Date(yearEnd, monthEnd - 1, dayEnd).getTime();
    var dataCollection = [];
    while (date.getTime() < dateEndTime) {
      const dateFormatted = `${("0" + date.getDate()).slice(-2)}-${(
        "0" +
        (parseInt(date.getMonth()) + 1)
      ).slice(-2)}-${date.getFullYear()}`;
      $url = `https://www.tunisair.com/fr/vol_reservation/send-reservation?from_destination=TUN&to_destination=YUL&vol_type=R&start_date=${dateFormatted}&end_date=${dateFormatted}&adults=1&teenagers=0&kids=0&babies=0&promotion_code=&source=DESKTOP&currency=&ibe_configuration=booking`;
      await page.goto($url, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector("#tpl3_calendarPerBound", { timeout: 0 });
      const data = await flightPage(page, dateFormatted);
      dataCollection = dataCollection.concat(data);
      date.addDays(7);
      console.log("date : ", dateFormatted);
    }

    await delay(4000);
    dataCollection = dataCollection.filter((data) => data.price != null);
    const csv = await converter.json2csv(dataCollection);
    console.log(csv);

    const nameFile = `data/${day}_${month}_${year} to ${dayEnd}_${monthEnd}_${yearEnd}.csv`;
    fs.writeFile(nameFile, csv, (err) => {
      if (err) throw err;
      console.log("File written successfully");
    });
    browser.close();
  });