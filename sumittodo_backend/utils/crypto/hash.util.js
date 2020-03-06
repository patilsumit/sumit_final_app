const crypto = require('crypto');
const randomstring = require('randomstring');

let generate_salt = () => {
    return randomstring.generate(11)
};

function encrypt(password) {
    if (!password) {
        // throw new Error('Password cannot be blank or null');
        return  false;
    }

    let salt = generate_salt();
    let HmacMethod = 'sha512';

    let hash = crypto.createHmac(HmacMethod, salt);
    hash.update(password);

    return {
        hash: hash.digest('hex'),
        salt: salt
    }
}


function compare(p_hash, salt, password) {
    let HmacMethod = 'sha512';

    if (!password) {
        return  false;
    }

    let hash = crypto.createHmac(HmacMethod, salt);
    hash.update(password);

    if (hash.digest('hex') === p_hash)
        return true;
    else
        return false;
}

module.exports = {encrypt, compare};
