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

const chooseFlightPage = async (page, datePlayer) => {
  await page.waitForSelector("#vol-reservation-form");

  const date = datePlayer + " / " + datePlayer;
  await page.evaluate((date) => {
    // const selectElement = document.querySelector(".destination");
    // const optionElements = selectElement.querySelectorAll("option");

    // for (let option of optionElements) {
    //   if (option.value === "YUL") {
    //     option.selected = true;
    //     break;
    //   }
    // }


    // const dates = document.querySelectorAll(".input-mini");
    // dates[0].value = date;
    // dates[1].value = date;
  }, date);

  // await page.click(".applyBtn");

  await page.evaluate(() => {
    document.querySelector(".calendar").click();
  })
  // await page.click('.calendar');
  // await page.waitForSelector(".input-mini");
  
  // await page.evaluate(() => {
   
  // })
  // const dates = await page.$$(".input-mini");
  // console.log("date player : ",datePlayer);
  // await dates[0].type(datePlayer);
  // await dates[1].type(datePlayer);

  // await page.evaluate((date) => {
  //   document.querySelector(".calendar").value = date;
  // }, date);
  // await page.click("#edit-actions-submit");
};

const checkAndBypass = async (page) => {
  await page.waitForSelector("#tpl3_calendarPerBound", { timeout: 0 });
  var cookies = await page.cookies();
  await fs.writeFile("cookies/tunisair.json", JSON.stringify(cookies, null, 2));
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
    const cookiesString = await fs.readFile("cookies/tunisair.json");
    if (cookiesString != "") {
      var cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
    }
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
      await page.goto(`https://www.tunisair.com.tn/site/publish/content/`);
      await chooseFlightPage(page, dateFormatted);
      await checkAndBypass(page);
      const data = await flightPage(page, dateFormatted);
      dataCollection = dataCollection.concat(data);
      date.addDays(7);
      console.log("date : ", dateFormatted);
    }

    dataCollection = dataCollection.filter((data) => data.price != null);
    const csv = await converter.json2csv(dataCollection);
    console.log(csv);

    const nameFile = `data/${month}_${day}_${year} to ${monthEnd}_${dayEnd}_${yearEnd}.csv`;
    fs.writeFile(nameFile, csv, (err) => {
      if (err) throw err;
      console.log("File written successfully");
    });
    browser.close();
  });
