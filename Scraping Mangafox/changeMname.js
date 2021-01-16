
const puppeteer = require('puppeteer');
const fs = require('fs');
//const { clear } = require('console');
(async function main(){
    try{
        const ext = 'C:/Users/shidono/AppData/Local/Google/Chrome/User Data/Profile 2/Extensions/mpbjkejclgfgadiemmefgebjfooflfhl/1.0.1_0/';
        const browser = await puppeteer.launch({ 
            headless: false,
            executablePath: 'C:/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe',
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"],
            //args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if((req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font')){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        const pages = await browser.pages();
        await pages[0].close();
        data = "http://fanfox.net/directory/1/1.html";
        await page.goto(data);
        await page.waitForSelector('.manga-list-1',{
            timeout: 50000
        });
        i = 1;
        mangas = [];
        sortie = true;
        while(sortie){
            let manga = await page.evaluate(() => {
                total = document.querySelectorAll("div[class='manga-list-1'] > ul[class='manga-list-1-list line'] > li");
                details = [];
                for (element of total){
                    element = element.querySelector("p[class='manga-list-1-item-title']").innerHTML;
                    link = element.split('href="');
                    link = link[1].split('"');
                    manganame = element.split('title="');
                    manganame = manganame[1].split('"');
                    test = {"name" : manganame[0],"link": "http://fanfox.net"+link[0]};
                    details.push(test);
                }
                return details;
            })
            console.log(manga[0].name);
            console.log(manga[0].link);
            mangas = mangas.concat(manga); 
            i++;
            data = data.split("directory/1/");
            data = data[0]+"directory/1/"+i+".html";
            await page.goto(data);
            await page.waitForSelector('.manga-list-1',{
                timeout: 50000
            });
            sortie = await page.evaluate(() => { 
                total = document.querySelector("div[class='manga-list-1'] > ul[class='manga-list-1-list line'] > li");
                if(total == undefined) return false;
                else return true;
            })
        }
        manga = JSON.stringify(mangas,null,2);
        fs.writeFileSync('Mangafoxoriginal.json',manga);
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        //close(fs);
    }
})();
/*details = [];
total = document.querySelectorAll("div[class='content_grid'] > ul > li");
for (element of total){
    element = element.querySelector("div[class='content_grid_item_name']").innerHTML;
    link = element.split('href="');
    link = link[1].split('"');
    manganame = element.split('">');
    manganame = manganame[1].split('<');
    test = {"name" : manganame[0],"link": link[0]};
    details.push(test);
}
console.log(details);*/


