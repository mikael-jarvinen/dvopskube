const crypto = require('crypto');

let randomString = (new Date()).toISOString();

function logStringLoop() {
    console.log(`${(new Date()).toISOString()}: ${randomString}`);
    setTimeout(logStringLoop, 5000);
}

randomString = crypto.createHash('md5').update(randomString).digest('hex');

logStringLoop();