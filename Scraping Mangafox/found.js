const puppeteer = require('puppeteer');
const fs = require('fs');
(async function main(){
    try{
        const browser = await puppeteer.launch({ 
            headless: false,
            executablePath: 'C:/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe',
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"]
            //args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        var data = fs.readFileSync('found.txt', 'utf8');
        if(data == ""){
            data = 0;
        }else{
            data = parseInt(data);
        }
        var lost = fs.readFileSync('problems/notfound.txt', 'utf8')
        lost = lost.split("\n");
        const pages = await browser.pages();
        await pages[0].close();
        for(i = data;i <= lost.length;i++){
            element = lost[i].split(":ESPACE: ");
            element = element[1];
            await page.goto(element);
            if (await page.$('.detail-main-list') !== null){
                await page.waitForSelector('.detail-main-list',{
                    timeout: 0
                })
                let wholesome =  await page.evaluate(() => {
                    var name = "",others = [],Mpages = [],Images = [],authors = [],genres = [],summary = "",stat="",views=0;
                    manga = document.querySelector("span[class='detail-info-right-title-font']").innerHTML;
                    image = document.querySelector("img[class='detail-info-cover-img']").outerHTML;
                    image = image.split('src="');
                    image = image[1].split('"');
                    image = image[0];
                    if(document.querySelector("p[class='detail-info-right-say'] > a") != undefined){
                        author = document.querySelector("p[class='detail-info-right-say'] > a").innerHTML;
                        authors.push(author);
                    }
                    stat = document.querySelector("span[class='detail-info-right-title-tip']").innerHTML;
                    summary = document.querySelector("p[class='fullcontent']").innerText;
                    total = document.querySelectorAll("p[class='detail-info-right-tag-list'] > a");
                    for(content of total){
                        genres.push(content.innerHTML);
                    }
                    sum = document.querySelectorAll("div[id='list-1'] > ul[class='detail-main-list'] > li");
                    if(sum.length == 0) sum = document.querySelectorAll("div[id='list-2'] > ul[class='detail-main-list'] > li");
                    for(division of sum){ 
                        link = division.innerHTML;
                        link = link.split('href="');
                        link = link[1].split('"');
                        link = "http://fanfox.net"+link[0];
                        name = division.querySelector("div[class='detail-main-list-main'] > p[class='title3']").innerText;
                        if(division.querySelector("div[class='detail-main-list-main'] > p[class='title2']") != undefined) date = division.querySelector("div[class='detail-main-list-main'] > p[class='title2']").innerText;
                        else{
                            date = division.querySelector("div[class='detail-main-list-main']").innerHTML;
                            date = date.split('<p class="title2">');
                            date = date[1].split('</p>');
                            date = date[0];
                        }
                        total = {"link" : link, "name" : name, "date" : date,"Images" : Images};
                        Mpages.push(total);
                    }
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
                shelf = {"page" : element,"content" : wholesome};
                kharbel = shelf.content.manga.split(".").join("%PP");
                kharbel = kharbel.split("*").join("%KK");
                kharbel = encodeURIComponent(kharbel);
                mangala = JSON.stringify(shelf,null,2);
                fs.writeFileSync('mangaliste4/'+kharbel+'.json',mangala);
                console.log(element+"\n"+shelf.content.manga);
            }
            fs.writeFileSync('found.txt',i+1);
            
        }
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
    }
})();


