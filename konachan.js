const fs = require("fs").promises;
const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-infobars",
        "--start-fullscreen",
        "--enable-blink-feature",
      ],
      executablePath: "/opt/google/chrome/google-chrome",
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

    await page.exposeFunction("Change", () => {
      stopper = !stopper;
    });

    await page.evaluate(() => {
      window.addEventListener("keydown", (e) => {
        if (e.code == "KeyH") {
          Change();
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
