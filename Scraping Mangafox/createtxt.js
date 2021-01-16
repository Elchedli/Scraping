const fs = require('fs');
(async function main(){
try{
    one = 0;
    fs.writeFileSync('first.txt',one);
    fs.writeFileSync('second.txt',one);
    fs.writeFileSync('third.txt',one);
    fs.writeFileSync('fourth.txt',one);
    fs.writeFileSync('fifth.txt',one);
    }catch(e){
        fs.writeFileSync('error.txt',e);
        console.log('our error',e);
        close(fs);
    }
})();