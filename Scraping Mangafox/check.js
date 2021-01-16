const fs = require('fs');
(async function main(){
    try{
        //mangabinary = await fs.promises.readFile('problems/filtre2.json');
        //mangas = JSON.parse(mangabinary);
        var lost = fs.readFileSync('problems/notfound.txt', 'utf8')
        lost = lost.split("\n");
        //mangas[4544].name = "Saikyo Shoku Kara Shokyu Shoku Ni Nattano Ni, Naze Ka Yushatachi Kara Tayoraretemasu";
        //for(i = 26654; i < 27186;i++){
            //console.log(mangas[310].name);
            //console.log(mangas[310].link);
        //}
        console.log(lost.length);
        /*mangala = JSON.stringify(mangas,null,2);
        fs.writeFileSync('Mangafoxoriginal.json',mangala);
        console.log("fait");*/
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
    }
})();