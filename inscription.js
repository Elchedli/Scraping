const puppeteer = require('puppeteer');
const fs = require('fs');
(async function main(){
    try{
        const browser = await puppeteer.launch({   
            headless: false,
            executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"],
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        const pages = await browser.pages();
        const page2 = await browser.newPage();
        await pages[0].close();
        await page.goto('https://2captcha.com/auth/login');
        await page.waitForSelector('.login_form');
        h=4200;
        for(let i=0;i<3000;i++){
            h++;
            let content = await page.evaluate(() =>  document.querySelector("div[class='wrap_google_captcha'] > img").src );
            let melody = await page2.goto(content);
            fs.writeFile(`captcha/inscription/alla-${h}.png`, await melody.buffer(), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            // await download(content,`captcha/inscription/alla-${i}.png`);
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
            await page.waitForSelector('.login_form');
        }
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();