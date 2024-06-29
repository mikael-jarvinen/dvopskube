const fs = require('fs');
const path = require('path');

function logStringLoop() {
    const string = fs.readFileSync('/tmp/hash.txt', 'utf8');

    console.log(string);

    setTimeout(logStringLoop, 5000);
}

logStringLoop();
