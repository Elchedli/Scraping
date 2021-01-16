const puppeteer = require('puppeteer');
const fs = require('fs');
(async function main(){
    try{
        //mangabinary = await fs.promises.readFile('mangafox.json');
        //allmangas = JSON.parse(mangabinary);
        mangas = fs.readFileSync('problems/check.txt', 'utf8');
        mangabinary = await fs.promises.readFile('Mangafoxoriginal.json');
        mangalist = JSON.parse(mangabinary);
        tab = [];
        for(element of mangalist){
            //console.log(mangas.includes(element.link));
            if(mangas.includes(element.link) == false){
                console.log(element.link);
                manga = {"link" : element.link};
                tab.push(manga);
                fs.appendFileSync('problems/filtre.txt',element.link+"\n",function (err) {
                    if (err) throw err;
                });
            }        
        }
        manga = JSON.stringify(tab,null,2);
        fs.writeFileSync('problems/filtre.json',manga);
        /*const browser = await puppeteer.launch({ 
            headless: false,
            executablePath: 'C:/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe',
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"]
            //args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        mangabinary = await fs.promises.readFile('problems/filtre.json');
        mangalist = JSON.parse(mangabinary);
        for(i in mangalist){
            page.goto(mangalist[i].link);
            await page.waitForSelector('.detail-info-right-title-font',{
                timeout: 0
            })
            let name = await page.evaluate(() => {
                nom = document.querySelector("span[class='detail-info-right-title-font']").innerText;
                return nom;
            })
            mangalist[i].name = name;
            console.log(mangalist[i].name);
        }
        mangala = JSON.stringify(mangalist,null,2);
        fs.writeFileSync('problems/filtre2.json',mangala);*/
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();
