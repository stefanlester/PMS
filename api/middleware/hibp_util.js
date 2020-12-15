const https = require('https');
const crypto = require('crypto');

let hashedPassword = crypto.createHash('sha1')
    .update(process.argv[2])
    .digest('hex')
    .toUpperCase();
let prefix = hashedPassword.slice(0, 5);
let apiCall = `https://api.pwnedpasswords.com/range/${prefix}`;

let hashes = '';
https.get(apiCall, function (res) {
    res.setEncoding('utf8');
    res.on('data', (chunk) => hashes += chunk);
    res.on('end', onEnd);
}).on('error', function (err) {
    console.error(`Error: ${err}`);
});

function onEnd() {
    let res = hashes.split('\r\n').map((h) => {
        let sp = h.split(':');
        return {
            hash: prefix + sp[0],
            count: parseInt(sp[1])
        }
    });

    let found = res.find((h) => h.hash === hashedPassword);
    if (found) {
        console.log(`Found ${found.count} matches! Password vulnarable!`);
    } else {
        console.log('No matches found!');
    }
}