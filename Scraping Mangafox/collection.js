const fs = require('fs');
(async function main(){
    try{
        //mangabinary = await fs.promises.readFile('mangafox.json');
        //allmangas = JSON.parse(mangabinary);
        missedmangas = fs.readFileSync('problems/notfound.txt', 'utf8');
        differentmangas = fs.readFileSync('problems/differentname.txt', 'utf8');
        weirdmangas = fs.readFileSync('problems/weird.txt', 'utf8');
        blocks = [];
        i = 0;
        fs.readdirSync("mangaliste3/").forEach(file => {
            //console.log(file);
            blocks.push(file);
            i++;
          });  
          console.log(i);
          j = 0;
          for(element of blocks){
            //console.log(element);
            data = await fs.promises.readFile("mangaliste3/"+element);
            manga = JSON.parse(data);
            //console.log(manga.page);
            fs.appendFileSync('problems/check.txt',manga.page+"\n",function (err) {
                j++;
                if (err) throw err;
            });
            //console.log(element);
          }
          console.log(j);
        fs.appendFileSync('problems/check.txt',"\n MISSED NAMES : \n\n"+missedmangas+"\n DIFFERENT NAMES : \n\n"+differentmangas+"\n WEIRD NAMES : \n\n"+weirdmangas,function (err) {
            if (err) throw err;
        });
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();
