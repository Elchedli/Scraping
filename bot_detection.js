const puppeteer = require("puppeteer-extra");
const stealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(stealthPlugin());
puppeteer.launch({
    headless: false,
    executablePath: "/opt/google/chrome/google-chrome",
    userDataDir: "/home/shidono/.config/google-chrome/Default",
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
}).then(async browser => {
    const pages = await browser.pages();
    const page = await browser.newPage();
    await pages[0].close();
    await page.goto('https://bot.sannysoft.com/');
})