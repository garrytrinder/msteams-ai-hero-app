// copy all files and folders from app/pages/dist to lib/app/pages/dist
const fs = require('fs-extra');
const path = require('path');

const src = path.resolve(__dirname, '../app/pages/dist');
const dest = path.resolve(__dirname, '../lib/app/pages/dist');

console.log('copying files from ' + src + ' to ' + dest);

// remove the destination folder
fs.removeSync(dest);

fs.copy(src, dest, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('success!');
    }
}
);
