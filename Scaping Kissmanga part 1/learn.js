/*var data = [];
test = { "ID": "1", "Status": "Valid" }
data.push(test);
console.log(data[0]["ID"]);
for(var i = 0 in data){
   console.log(data[i].ID);
}*/

/*const puppeteer = require('puppeteer');
const fs = require('fs');
(async function main(){
    try{
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null,ignoreDefaultArgs: ["--enable-automation"]});
        const page = await browser.newPage();
        const pages = await browser.pages();
        await pages[0].close();
        const cookiesString = await fs.promises.readFile('cookies.json');
        var cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        await page.goto('https://kissmanga.com/MangaList?page=400');
        await page.waitForSelector('#footer');
        let elements = await page.$$('tbody > tr > td');
        console.log(elements);
        if(elements == ""){
            console.log("zebi twill");
        }else{
            for (let element of elements){
                tweet = await (await element.getProperty('innerHTML')).jsonValue();
                console.log(tweet);
            }
        }
        
    }catch(e){
        console.log('our error',e);
    }
})();*/


const puppeteer = require('puppeteer');
const fs = require('fs');
const { clear } = require('console');
(async function main(){
    try{
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null,ignoreDefaultArgs: ["--enable-automation"]});
        const page = await browser.newPage();
        const pages = await browser.pages();
        await pages[0].close();
        const cookiesString = await fs.promises.readFile('cookies.json');
        var cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        /*for (var i = data in mangalist){
            var Core = work(i);
            var shelf = {"content" : Core,"page" : mangalist[i].link};
            manga = JSON.stringify(shelf,null,2);
            fs.writeFileSync('mangaliste/'+shelf.content.manga+'.json',manga);
            fs.writeFileSync('liste.txt',i);
        }*/
        
        
        async function work(){
            await page.goto("https://kissmanga.com/Manga/The-Devil-of-the-Gods");
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
            console.log(content);
            return content;
        }
        var shelf = {"content" : work(),"page" : "https://kissmanga.com/Manga/The-Devil-of-the-Gods"};
    }catch(e){
        console.log('our error',e);
        close(fs);
    }
})();


