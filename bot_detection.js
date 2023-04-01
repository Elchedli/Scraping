

// user.json tag numberofelements
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(stealthPlugin());
puppeteer.launch({
    headless: false,
    executablePath: "/usr/bin/google-chrome",
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
}).then(async browser => {
    const pages = await browser.pages();
    const page = await browser.newPage();
    await pages[0].close();
    await page.goto('https://bot.sannysoft.com/');
})


// (async function main() {
//     try {
//         const browser = await puppeteer.launch({
//             headless: false,
//             executablePath: "/usr/bin/google-chrome",
//             defaultViewport: null,
//             ignoreDefaultArgs: ["--enable-automation"],
//             args: ["--no-sandbox", "--disable-dev-shm-usage"],
//         });
       
//     } catch (e) {
//         console.log("erreur est : " + e);
//     }
// })();