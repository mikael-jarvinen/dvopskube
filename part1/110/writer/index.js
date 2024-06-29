const crypto = require('crypto');
const fs = require('fs');

let randomString = (new Date()).toISOString();
randomString = crypto.createHash('md5').update(randomString).digest('hex');

function writeStringToFileLoop() {
    const file = 

    fs.writeFileSync(
        '/tmp/hash.txt',
        `${(new Date()).toISOString()}: ${randomString}`,
        { flag: 'w+' }
    );

    setTimeout(writeStringToFileLoop, 5000);
}

writeStringToFileLoop();
