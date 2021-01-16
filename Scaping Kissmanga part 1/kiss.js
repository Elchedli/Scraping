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
        var data = fs.readFileSync('manga.txt', 'utf8');
        if(data == ""){
            await page.goto('https://kissmanga.com/MangaList?page=1');
        }else{
            await page.goto(data);
        }
        var raw,tweet,mangalist;
        await page.waitForSelector('#footer');
        //let content = await page.content();
        /*let content = await page.evaluate(() => {
            let title = document.querySelectorAll('tbody > tr > td').innerHTML;
            return{
                title
            }
        })*/
        elements = await page.$$('tbody > tr > td');
        while(elements != ""){
            let a = 1;
            mangabinary = await fs.promises.readFile('Mname.json');
            if(mangabinary == "") mangalist = [];
            else mangalist = JSON.parse(mangabinary);
            for (let element of elements){
                //let title = await element.$eval((''),node => node.innerHTML.trim());
                tweet = await (await element.getProperty('innerHTML')).jsonValue();
                if(a){
                    raw = tweet.split('<a href="');
                    raw = raw[1].split('"');
                    console.log(raw[0]);
                    manga = {"link" : "https://kissmanga.com/"+raw[0]};
                    mangalist.push(manga);
                }/*else{
                    if(tweet.trim() == "Completed"){
                        //console.log("Completed");
                    }else{
                        raw = tweet.split('>');
                        raw = raw[1].split('</a');
                        //console.log(raw[0]);
                    }
                } */
                a = !a;
            }
            nextpage = page.url().split('=');
            nextpage = nextpage[0] + "=" +((parseInt(nextpage[1])+1).toString());
            await page.goto(nextpage);
            fs.writeFileSync('manga.txt',nextpage);
            await page.waitForSelector('#footer');
            manga = JSON.stringify(mangalist,null,2);
            fs.writeFileSync('Mname.json',manga);
            elements = await page.$$('tbody > tr > td');
        }
        var cookies = await page.cookies();
        await fs.promises.writeFile('cookies.json', JSON.stringify(cookies, null, 2));
    }catch(e){
        console.log('our error',e);
    }
})();


