const fs = require('fs');
(async function main(){
try{
    mangabinary = await fs.promises.readFile('Mname.json');
    mangalist = JSON.parse(mangabinary);
    var one = mangalist.splice(0,3742);
    var two = mangalist.splice(0,3738);
    var three = mangalist.splice(0,3738);
    var four = mangalist.splice(0,3738);
    var five = mangalist.splice(0,3738);
    manga = JSON.stringify(one,null,2);
    fs.writeFileSync('first.json',manga);
    manga = JSON.stringify(two,null,2);
    fs.writeFileSync('second.json',manga);
    manga = JSON.stringify(three,null,2);
    fs.writeFileSync('third.json',manga);
    manga = JSON.stringify(four,null,2);
    fs.writeFileSync('fourth.json',manga);
    manga = JSON.stringify(five,null,2);
    fs.writeFileSync('fifth.json',manga);
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();