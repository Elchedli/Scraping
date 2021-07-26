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
        const pages = await browser.pages();
        const page2 = await browser.newPage();
        const page = await browser.newPage();
        await pages[0].close();
        await page.evaluateOnNewDocument(() => {
            enterPressed = false;
            document.addEventListener("keydown", e => {
              if (e.code === "Enter") {
                // let tester = document.querySelector("li[class='reputation'] > span").innerText;
                let image = document.querySelector("td[id='mainCaptchaImg'] > img").src;
                let name = document.querySelector("div[class='container-middle'] > input").value;
                // let image = "haha";
                // let name = "mibnoun";
                Change(image,name);
                enterPressed = true;
              }
            });
        });
        await page.exposeFunction("Change", async function(image,name){
            // console.log("pp")
            // console.log(`image: ${image} and name: ${name}`);
            let melody = await page2.goto(image);
            fs.writeFile(`captcha/work/${name}.png`, await melody.buffer(), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });
        
        const cookiesString = await fs.promises.readFile('shidonocaptcha.json');
        if(cookiesString != ""){
            var cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        }
        await page.goto('https://2captcha.com/cabinet');
        await page.waitForSelector('.bottom_footer');
        await page.select('#captcha_type', '1');
        // const element = await frame.$('a[class="btn-edit"]');
        // await page.click('#captcha_type > option');
        await page.click('div.text-center > a');
        // await page.goto("about:blank");
        try {
                await page.waitForFunction("enterPressed",{ timeout: 0 });
            }catch (err) {
            console.error("[node/puppeteer] enter was not pressed within the specified timeout");
            }
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();