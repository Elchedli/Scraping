// user.json tag numberofelements
const puppeteer = require("puppeteer");
const fs = require("fs");


function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}


(async function main() {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: "/usr/bin/google-chrome",
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
        // const xpath1 = `//option[text()='${process.argv[1]} 23']`;
        // const xpath2 = `//option[text()='${process.argv[2]} 23']`;
        // const goDateOptionValue = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        // const returnDateOptionValue = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
        // await page.waitForSelector('#blocformsearch');
        
        // page.evaluate(() => {
        //     document.querySelector('select[name=B_LOCATION_1]').value = 'YUL';
        //     document.querySelector('select[name=E_LOCATION_1]').value = 'TUN';
        //     document.querySelector('select[name=ADTPAX]').value = '0';
        //     document.querySelector('select[name=YTHPAX]').value = '1';
        //     const dates = document.querySelectorAll('.champcal');
        //     dates[0].value = "13/10/2023";
        //     dates[1].value = "13/10/2023";
        // });
        // await delay(1000);
        // await page.click('#lignesearch1 > input');
        await page.waitForSelector('.cash-and-miles-placeholder-container', {timeout: 0});
        var cookies = await page.cookies();
        await fs.promises.writeFile(
            `cookies/tunisair.json`,
            JSON.stringify(cookies, null, 2)
        );
        // const tabMonths = document.querySelectorAll('.month')[0];               
        // (tabMonths.querySelector('select') as HTMLSelectElement).value = (goDateOptionValue.singleNodeValue as HTMLOptionElement).value;

        
        // const faresTable = document.querySelectorAll('tbody')[0].querySelectorAll('.calendarPerBound-fare');

        // faresTable.forEach(fareSection => {
        //     const dateFare = Array(fareSection.querySelector('.calendarPerBound-date-section')?.querySelectorAll('div')).map(dateDiv => dateDiv?['innerText']);
        // });
        // var iteration1 = 1
        // var iteration2 = 1
    } catch (e) {
        console.log("erreur est : " + e);
    }
})();