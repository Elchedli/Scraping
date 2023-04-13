const fs = require("fs").promises;
const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const patform = process.platform;
  console.log("Scraper running on platform: ", patform);
  let executablePath;
  if (/^win/i.test(patform)) {
    executablePath = path.join(
      process.env.LocalAppData,
      "Google/Chrome/Application/chrome.exe"
    );
  } else if (/^linux/i.test(patform)) {
    executablePath = "/usr/bin/google-chrome";
  }

  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-infobars",
        "--start-fullscreen",
        "--enable-blink-feature",
      ],
      executablePath: executablePath,
      headless: false,
      defaultViewport: null,
    });
    const pages = await browser.pages();
    const page = pages[0];
    let stopper = false;
    try {
      await fs.access("cookies/history.txt");
    } catch (error) {
      await fs.mkdir("cookies", { recursive: true });
      await fs.writeFile("cookies/history.txt", "");
    }
    const data = await fs.readFile("cookies/history.txt", "utf8");
    data
      ? await page.goto(data)
      : await page.goto("https://konachan.com/post/browse#/sex");

    const saveImage = async () => {
      console.log("registred file");
      const imageElement = await page.$("img[class=main-image]");
      console.log(imageElement.src);
      await imageElement.screenshot({
        path: `images/lola.png`,
      });
    };
    await page.exposeFunction("Change", async (value) => {
      switch (value) {
        case 1:
          stopper = !stopper;
          break;
        case 2:
          await saveImage();
          break;
      }
    });

    await page.evaluate(() => {
      window.addEventListener("keydown", (e) => {
        switch (e.code) {
          case "KeyH":
            Change(1);
            break;
          case "KeyB":
            Change(2);
            break;
          default:
            break;
        }
        if (e.code == "KeyH") {
        }
      });
    });

    setTimeout(() => {
      page.keyboard.press(" ");
    }, 3000);
    setInterval(async () => {
      if (stopper) {
        await page.keyboard.press("s");
        await fs.writeFile("cookies/history.txt", page.url());
      }
    }, 3000);

    console.log("works fine!");
  } catch (error) {
    console.error(error);
  }
})();
