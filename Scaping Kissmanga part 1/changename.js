const fs = require('fs');
fs.readdirSync("mangaliste/").forEach(file => {
    console.log(file);
    ret = file.replace('json','.json');
    fs.rename(
        __dirname + '/mangaliste/' + file,
        __dirname + '/mangaliste/' + ret,
        err => {
          console.log(err)
        }
      )
  });