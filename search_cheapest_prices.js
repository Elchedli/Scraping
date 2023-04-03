const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs").promises;
puppeteer.use(stealthPlugin());

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

// const lastday = (y, m) => {
//   return new Date(y, m + 1, 0).getDate();
// };

Date.prototype.addDays = (days) => {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const chooseFlightPage = async (page, datePlayer) => {
  console.log("date : ", datePlayer);
  await page.waitForSelector("#blocformsearch");
  const destination1 = await page.$("select[name=B_LOCATION_1]");
  await destination1.type("mont");
  await delay(1000);
  const destination2 = await page.$("select[name=E_LOCATION_1]");
  await destination2.type("TUN");
  await delay(1000);
  const ageChild = await page.$("select[name=ADTPAX]");
  await ageChild.type("0");
  await delay(1000);
  const ageAdult = await page.$("select[name=YTHPAX]");
  await ageAdult.type("1");
  await delay(1000);
  const dates = await page.$$(".champcal");
  //there is start and end date for destination
  await dates[0].type(datePlayer);
  await dates[1].type(datePlayer);
  // dates.forEach(async (date) => {
  //   await date.type(datePlayer);
  // });
  await delay(1000);
  await page.click(".calendarOKButton");
  await delay(1000);
  await page.click("#lignesearch1 > input");
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
    return Array.from(faresTables).map((fareSection) => {
      const dateFare = Array.from(
        fareSection.querySelectorAll(".calendarPerBound-date-section > div")
      ).map((div) => div.innerText);
      const price = fareSection.querySelector(".price-amount");
      return { date: dateFare, price: price ? price.innerText : null };
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

puppeteer
  .launch({
    headless: false,
    executablePath: "/opt/google/chrome/google-chrome",
    userDataDir: "/home/shidono/.config/google-chrome/Default",
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  .then(async (browser) => {
    const pages = await browser.pages();
    const page = await browser.newPage();
    await pages[0].close();
    const cookiesString = await fs.readFile("cookies/tunisair.json");
    if (cookiesString != "") {
      var cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
    }
    await fs.mkdir("cookies", { recursive: true });
    // await page.goto(`https://www.tunisair.com.tn/site/publish/content/`);
    var date = new Date(year, month, day);
    const dateEndTime = new Date(yearEnd, monthEnd, dayEnd).getTime();
    // console.log([day,month,year].join('/'))
    var dataCollection = [];
    while (date.getTime() < dateEndTime) {
      const dateFormatted = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      await page.goto(`https://www.tunisair.com.tn/site/publish/content/`);
      await chooseFlightPage(page, dateFormatted);
      await checkAndBypass(page);
      const data = await flightPage(page, dateFormatted);
      concat(dataCollection, data);
      date.addDays(6);
    }
    // console.log(process.argv[2], process.argv[3]);
    // console.log(day, month, year, "  and ", typeof day, typeof month);
    // var formattedDate = ;
    // console.log(formattedDate);
    console.log(dataCollection);
    //browser.close();
  });
