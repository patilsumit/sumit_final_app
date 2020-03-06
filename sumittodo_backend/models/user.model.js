const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');


const userSchema = new Schema({
    _id: {
        type: String,
        // default: shortid.generate,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPassword: {
        hash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    },
    userStatus:{
        type: Number,
        required: true
    }

});


 const users = mongoose.model('users', userSchema);

module.exports = {users};
