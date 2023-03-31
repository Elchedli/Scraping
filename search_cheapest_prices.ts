// user.json tag numberofelements
const puppeteer = require("puppeteer");
const fs = require("fs");

(async function main() {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"],
            args: ["--no-sandbox", "--disable-dev-shm-usage"],
        });
        const pages = await browser.pages();
        const page = await browser.newPage();
        await pages[0].close();
        await page.goto(
            `https://www.tunisair.com.tn/site/publish/content/`
        );
    } catch (e) {
        console.log("erreur est : " + e);
    }
})();