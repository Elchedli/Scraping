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

        document.querySelector('select[name=B_LOCATION_1]').value = 'YUL'
        document.querySelector('select[name=E_LOCATION_1]').value = 'TUN'

        document.querySelector('select[name=ADTPAX]').value = 0
        document.querySelector('select[name=YTHPAX]').value = 1


        const tabMonths = document.querySelectorAll('.month');
     
        tabMonths[0].querySelector(`option[innerText=${process.argv[1]} 23`).value
        tabMonths[0].querySelector('select').value = 
        tabMonths[0].querySelector(`option[innerText=${process.argv[1]} 23`).value

        const xpath1 = `//option[text()='${process.argv[1]} 23']`;
        const xpath2 = `//option[text()='${process.argv[2]} 23']`;
        const optionValue = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var iteration1 = 1
        var iteration2 = 1
    } catch (e) {
        console.log("erreur est : " + e);
    }
})();