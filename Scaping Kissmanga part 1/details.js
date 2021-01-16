const puppeteer = require('puppeteer');
const fs = require('fs');
const { clear } = require('console');
(async function main(){
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null,ignoreDefaultArgs: ["--enable-automation"]});
    const page = await browser.newPage();
    try{
        const pages = await browser.pages();
        await pages[0].close();
        const cookiesString = await fs.promises.readFile('cookies.json');
        var cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        var data = fs.readFileSync('liste.txt', 'utf8');
        if(data == ""){
            data = 0;
        }
        mangabinary = await fs.promises.readFile('Mname.json');
        mangalist = JSON.parse(mangabinary);
        for (var i = data in mangalist){
            var Core = work(i);
            var shelf = {"content" : Core,"page" : mangalist[i].link};
            manga = JSON.stringify(shelf,null,2);
            fs.writeFileSync('mangaliste/'+shelf.content.manga+'.json',manga);
            fs.writeFileSync('liste.txt',i);
        }
        async function work(data){
            await page.goto(mangalist[data].link);
            await page.waitForSelector('#footer');
            let content = await page.evaluate(() => {
                total = document.querySelector("div[class='barContent']").innerHTML;
                total = total.split("<div>",2);
                total = total[1].split("</div>",1);
                total = total[0];
                manga = total.split(">",2);
                manga = manga[1].split("<",1);
                manga = manga[0];
    
                rest = total.split("<p>");
    
                othername = rest[1].split("<a");
                others = [];
                for (other of othername.slice(1)){
                    other = other.split(">");
                    other = other[1].split("<");
                    others.push(other[0]);
                }
    
                genre = rest[2].split("<a");
                genres = [];
                for (gen of genre.slice(1)){
                    gen = gen.split(">");
                    gen = gen[1].split("<");
                    genres.push(gen[0]);
                }
    
                author = rest[3].split("<a");
                authors = [];
                for (auth of author.slice(1)){
                    auth = auth.split(">");
                    auth = auth[1].split("<");
                    authors.push(auth[0]);
                }
                
                stat = rest[4].split("&nbsp;",2);
                stat = stat[1];
                summary = rest[6];
                total = document.querySelector("div[class='rightBox'] > div[class='barContent'] > div[style='text-align: center']").innerHTML;
                total = total.split('src="');
                total = total[1].split('">\n');
                image = total[0];
                total = document.querySelectorAll("table[class='listing'] > tbody > tr > td");
                Mpages = [];
                a = 1;
                for(element of total){
                    
                    if(a){
                        raw = element.innerHTML.split('<a href="');
                        link = raw[1].split('"',1);
                        gen = raw[1].split(">",2);
                        gen = gen[1].split("<",1);
                        gen = gen[0].split('\n');
                    }else{
                        date = element.innerHTML.split('\n');
                        obj = {"link" : "https://kissmanga.com"+link[0], "name" : gen[1],"date" : date[1], "Images" : []};
                        Mpages.push(obj);
                    }
                    a = !a;
                }
                return{
                    manga,
                    others,
                    genres,
                    authors,
                    stat,
                    summary,
                    image,
                    Mpages
                }
            })
            //console.log(content);
            for(var i = 0 in content.Mpages){
                //console.log(content.Mpages[i].link);
                await page.goto(content.Mpages[i].link);
                await page.waitForSelector('#divImage');
                let val = await page.evaluate(() => {
                    Images = [];
                    total = document.querySelectorAll("div[id='divImage'] > p");
                    for(element of total){
                        raw = element.innerHTML.split('src="');
                        image = raw[1].split('"',1);
                        Images.push(image[0]);
                    }        
                    return Images;
                })
                content.Mpages[i].Images.push(val);
            }
            return content;
        }
        
        //
        /*elements = await page.$$('tbody > tr > td');
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
                }
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
        await fs.promises.writeFile('cookies.json', JSON.stringify(cookies, null, 2));*/
    }catch(e){
        console.log('our error',e);
        close(fs);
    }
})();


