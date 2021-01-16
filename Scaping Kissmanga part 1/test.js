const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main(){
    try{
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null,ignoreDefaultArgs: ["--enable-automation"]});
        const page = await browser.newPage();
        const pages = await browser.pages();
        await pages[0].close();
        const cookiesString = await fs.promises.readFile('cookies.json');
        if(cookiesString != ""){
            var cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        }
        var data = fs.readFileSync('liste.txt', 'utf8');
        if(data == ""){
            data = 0;
        }
        mangabinary = await fs.promises.readFile('Mname.json');
        mangalist = JSON.parse(mangabinary);
        console.log(data < 1);
        for (data in mangalist){ 
            console.log(data);
            console.log(mangalist[data]);
            if(data == 5) break;
        }
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();