const puppeteer = require('puppeteer');
const fs = require('fs');
(async function main(){
    try{
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-fullscreen'],ignoreDefaultArgs: ["--enable-automation"]});
        const page = await browser.newPage();
        const pages = await browser.pages();
        await pages[0].close();
        var stopper = false;
        var data = fs.readFileSync('file.txt', 'utf8');
        if(data == ""){
            await page.goto("https://konachan.com/post/browse#/sex");
        }else{
            await page.goto(data);
        } 
        await page.exposeFunction("Change", function(){
            stopper = !stopper
        });
        await page.evaluate(()=>{
            window.addEventListener("keydown", e => {
                if(e.code == "KeyH"){
                    Change();
                };
            });
        });
        setTimeout(() => {
            page.keyboard.press(' ');
          },3000);
        setInterval(() => {
            if(stopper){
                page.keyboard.press('s');
                fs.writeFileSync('file.txt',page.url());
            }
          },3000);
    }catch(e){
        console.log('our error',e);
    }finally{
        console.log('Works fine');
    }
})();
