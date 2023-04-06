const testFolder = '../images/cards/';
const fs = require('fs');
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(`"<img src='${testFolder}${file}'/>",`);
  });
})