const puppeteer = require('puppeteer');
const fs = require('fs');
const { clear } = require('console');

(async function main(){
    try{
        //const ext = 'I:/shared/creative/kissmanga/ublock.chromium';
        const browser = await puppeteer.launch({ 
            headless: false, 
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"],
            //args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`]
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if((req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') && !page.url().includes("AreYouHuman")){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        const pages = await browser.pages();
        await pages[0].close();
        const cookiesString = await fs.promises.readFile('cookies.json');
        if(cookiesString != ""){
            var cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        }
        mangabinary = await fs.promises.readFile('commentcor.json');
        mangalist = JSON.parse(mangabinary);
        for(data in mangalist.names){
            path = 'mangaliste/'+mangalist.names[data]+'.json';
            mangabinary = await fs.promises.readFile(path);
            anime = JSON.parse(mangabinary);
            await page.goto(anime.page);
            await page.waitForSelector('#footer',{
                timeout: 0
            });
            let content = await page.evaluate(() => {               
                total = document.querySelector("div[class='barContent']").innerHTML;
                total = total.split("<div>",2);
                total = total[1].split("</div>",1);
                total = total[0];
                manga = total.split(">",2);
                manga = manga[1].split("<",1);
                manga = manga[0];
                rest = total.split("<p");
                var others = [],authors = [],genres = [],summary = "",stat="",j=0;
                for (element of rest.slice(1)){
                    if(j == 1){
                        djibo = element.substr(element.indexOf('>')+1);
                        djibo = djibo.split('</p>');
                        summary+= djibo[0];
                        if(summary.length < 10 && document.querySelector("div[class='barContent'] > div > div").innerHTML.length > 10){
                            summary = document.querySelector("div[class='barContent'] > div > div").innerHTML;
                            break;
                        }
                    }
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
                            case "Summary":
                                type = element.split(':</span>');
                                if((type[1].length > 5 && !(type[1].includes('<script>'))) || type[1].includes('div id="div_desc_link">')){
                                    summary = type[1];
                                    if(summary.includes('div id="div_desc_link">')){
                                        summary = summary.split('<div id="div_desc_link">');
                                        summary = summary[1];
                                    }else if(summary.includes('justify;">')){
                                        summary = summary.split('justify;">');
                                        summary = summary[1];
                                    }else if(summary.includes('<td>')){
                                        summary = summary.split('<td>');
                                        summary = summary[1].split('</td>');
                                        summary = summary[0];
                                    }else if(summary.includes('</p>')){
                                        summary = summary.split('</p>');
                                        summary = summary[0];
                                    }else if(summary.includes(';">')){
                                        summary = summary.split(';">'); 
                                        summary = summary[1];
                                    }
                                    break;
                                }else{
                                    j = 1;
                                }    
                            break;
                        }
                    }
                   
                }
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
                    views,
                    others,
                    genres,
                    authors,
                    stat,
                    summary,
                    image,
                    Mpages
                }
            })
            /*anime.content.summary = content.summary;
            manga = JSON.stringify(anime,null,2);
            kharbel = anime.content.manga.split(".").join("%PP");
            kharbel = kharbel.split("*").join("%KK");
            kharbel = encodeURIComponent(kharbel);
            fs.unlinkSync(path);
            fs.writeFileSync('mangaliste/'+kharbel+'.json',manga);*/
            console.log(anime.content.manga);
            console.log(content.summary);
        }
        
        browser.close();
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();


