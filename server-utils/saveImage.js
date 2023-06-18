const fs = require('fs');
const path = require('path');

module.exports = {
    saveImage: (directoryName) => {
        const dirPath = path.join(__dirname, '..', directoryName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    }
}