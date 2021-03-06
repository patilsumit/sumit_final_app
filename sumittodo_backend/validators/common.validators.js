const randomstring = require('randomstring');

function validFiledCheck(postBody, todoSchema) {


    let message = '';

    Object.keys(postBody).map((key) => {
        if (!todoSchema[key]) {

            message = `${key} Filed Not Applicable`;
        }
    });

    if (!message) {
        return false;
    }
    return {message}
}


let generate_number_random = () => {
    return randomstring.generate(11)
};


function positive_number(limit, skip, sort) {
    let message = '';
    let numRegx = new RegExp('^\d*[0-9]\\d*$');
    let sortRegx = new RegExp('^[-1-1 ]+$');

    if (!numRegx.test(limit)) {
        message = 'Limit Type Invalid';
    } else if (!numRegx.test(skip)) {
        message = 'Skip Type Invalid';
    } else if (!sortRegx.test(sort)) {
        message = 'Sort Type Invalid'
    } else {
        return false
    }

    return {message};
}


module.exports = {validFiledCheck, positive_number, generate_number_random};
