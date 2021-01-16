const puppeteer = require('puppeteer');
const fs = require('fs');
const { clear } = require('console');
(async function main(){
    try{
        const ext = 'C:/Users/shidono/AppData/Local/Google/Chrome/User Data/Profile 2/Extensions/mpbjkejclgfgadiemmefgebjfooflfhl/1.0.1_0/';
        const browser = await puppeteer.launch({ 
            headless: false,
            executablePath: 'C:/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe',
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"]
            //args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        const page2 = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page2.setDefaultNavigationTimeout(0);
        //await page.setRequestInterception(true);
        /*page.on('request', (req) => {
            if((req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || !page.url().includes("AreYouHuman"))){
                req.abort();
            }
            else {
                req.continue();
            }
        });*/
        const cookiesString = await fs.promises.readFile('cookies.json');
        if(cookiesString != ""){
            var cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        }
        var data = fs.readFileSync('extract.txt', 'utf8');
        if(data == ""){
            data = 0;
        }else{
            data = parseInt(data);
        }
        mangabinary = await fs.promises.readFile('problems/filtre2.json');
        mangas = JSON.parse(mangabinary);
        const pages = await browser.pages();
        await pages[0].close();
        await page.goto("https://kissmanga.com");
        await page.waitForSelector('#footer',{
            timeout: 0
        });
        var cookies = await page.cookies();
        await fs.promises.writeFile('cookies.json', JSON.stringify(cookies, null, 2));
        var j = 0;
        for (var i = data, len = mangas.length; i < len; i++){
            var manganame = mangas[i].name;
            await page.type("#formSearch > p > #keyword", manganame);
            await page.keyboard.press('Enter');
            /*await page.waitForSelector('#rightside',{
                timeout: 0
            });*/
            await page.waitForSelector('#footer',{
                timeout: 0
            })
            //await page.waitFor(4000);
            let exist =  await page.evaluate(() => { 
                total = document.querySelector("table[class='listing']");
                if(total == null) return false;
                return true;
            })
            //console.log(exist);
            //
            /*let verif =  await page.evaluate(() => {  
                total = document.querySelector("div[class='barContent']").innerHTML;
                if(total.includes("Not found")) return false;
                return true;
            })*/
            //console.log(verif);
            if(exist){
                //await page.click('#result_box > a');
                var calamity = true;
                if(page.url().includes("Search")){
                    //console.log(manganame);
                    let dispo =  await page.evaluate((manganame) => { 
                        var total = document.querySelectorAll("table[class='listing'] > tbody > tr");
                        var Arr = Array.prototype.slice.call(total);
                        total = Arr.slice(2);
                        for(element of total){
                            ism = element.querySelector("td > a").innerText;
                            if(ism.localeCompare(manganame) == 0){
                                link = element.querySelector("td").innerHTML.split('href="');
                                link = link[1].split('"');
                                return link[0];
                            }
                        }
                        return "nope";
                    },manganame);
                    //console.log(dispo);
                    if(dispo != "nope"){
                        await page.goto("https://kissmanga.com"+dispo);
                    }else{
                        fs.appendFile('problems/differentname.txt', mangas[i].name+" :ESPACE: "+mangas[i].link+'\n', function (err) {
                            if (err) throw err;
                        });
                        console.log("\x1b[34m","not similar : "+mangas[i].name);
                        calamity = false;
                    }
                }
                //console.log(calamity);
                if(calamity){
                    await page.waitForSelector('.bigBarContainer',{
                        timeout: 0
                    });
                    var content = {};
                    content = await page.evaluate(() => {               
                        total = document.querySelector("div[class='barContent']").innerHTML;
                        total = total.split("<div>",2);
                        total = total[1].split("</div>",1);
                        total = total[0];
                        manga = total.split(">",2);
                        manga = manga[1].split("<",1);
                        manga = manga[0];
                        rest = total.split("<p");
                        var others = [],authors = [],genres = [],summary = "",stat="";
                        for (element of rest.slice(1)){
                            if(element.includes('class="info">')){
                                type = element.split('class="info">');
                                type = type[1].split(":<");
                                switch(type[0]){
                                    case "Other name":
                                        othername = element.split("<a");
                                        for (other of othername.slice(1)){
                                            other = other.split(">");
                                            other = other[1].split("<");
                                            others.push(other[0]);
                                        }
                                    break;
                                    case "Author":
                                        author = element.split("<a");
                                        for (auth of author.slice(1)){
                                            auth = auth.split(">");
                                            auth = auth[1].split("<");
                                            authors.push(auth[0]);
                                        }
                                    break;
                                    case "Genres":
                                        genre = element.split("<a");
                                        for (gen of genre.slice(1)){
                                            gen = gen.split(">");
                                            gen = gen[1].split("<");
                                            genres.push(gen[0]);
                                        }
                                    break;
                                    case "Status":
                                        double = element.split("</span>&nbsp;");
                                        stat = double[1].split("&nbsp",1);
                                        stat = stat[0].split('\n');
                                        stat = stat[0];
                                        views = double[2].split("&nbsp",1);
                                        views = views[0];
                                    break;
                                }
                            }
                           
                        }
                        total = document.querySelector("div[class='rightBox'] > div[class='barContent'] > div[style='text-align: center']").innerHTML;
                        total = total.split('src="');
                        total = total[1].split('">\n');
                        image = total[0];
                        Mpages = [];
                        summary = "";
                        return{
                            manga,
                            views,
                            summary,
                            others,
                            genres,
                            authors,
                            stat,
                            image,
                            Mpages
                        }
                    })
                    if(j > 0){
                        console.log(content.manga+"  :DAMN:  "+shelf.content.manga);
                        if(content.manga == shelf.content.manga){
                            await page2.waitForSelector('.blacknigga');
                        }
                    }
                    console.log(content.manga);
                    await page2.goto(mangas[i].link);
                    await page2.waitForSelector('.detail-main-list',{
                        timeout: 0
                    })
                    let summary = await page2.evaluate(() => {
                        sum = document.querySelector("p[class='fullcontent']").innerText;
                        return sum;
                    })
                    content.summary = summary;
                    //console.log("summary : "+content.summary);
                    var Mpages = await page2.evaluate(() => {
                        tab = [];
                        Images = [];
                        sum = document.querySelectorAll("div[id='list-1'] > ul[class='detail-main-list'] > li");
                        if(sum.length == 0) sum = document.querySelectorAll("div[id='list-2'] > ul[class='detail-main-list'] > li");
                        for(element of sum){ 
                            link = element.innerHTML.split('href="');
                            link = link[1].split('"');
                            link = "http://fanfox.net"+link[0];
                            var name = element.querySelector("div[class='detail-main-list-main'] > p[class='title3']").innerText;
                            if(element.querySelector("div[class='detail-main-list-main'] > p[class='title2']") != undefined) date = element.querySelector("div[class='detail-main-list-main'] > p[class='title2']").innerText;
                            else{
                                date = element.querySelector("div[class='detail-main-list-main']").innerHTML;
                                date = date.split('<p class="title2">');
                                date = date[1].split('</p>');
                                date = date[0];
                            }
                            total = {"link" : link, "name" : name, "date" : date,"Images" : Images};
                            tab.push(total);
                        }
                        return tab;
                    })
                    content.Mpages = Mpages;
                    shelf = {"page" : mangas[i].link,"content" : content};
                    kharbel = shelf.content.manga.split(".").join("%PP");
                    kharbel = kharbel.split("*").join("%KK");
                    kharbel = encodeURIComponent(kharbel);
                    mangala = JSON.stringify(shelf,null,2);
                    fs.writeFileSync('mangaliste3/'+kharbel+'.json',mangala);
                    console.log(shelf.content.manga+" : Boucle : "+mangas[i].name);
                }
            }else{
                shelf = {"page" : mangas[i].link,"content" : content};
                fs.appendFile('problems/notfound.txt', mangas[i].name+" :ESPACE: "+mangas[i].link+'\n', function (err) {
                    if (err) throw err;
                });
                console.log("\x1b[31m","not found :  "+mangas[i].name);
            }
            fs.writeFileSync('extract.txt',i+1);
            j++;
        }

    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
    }
})();


