const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');


const todoSchema = new Schema({

    _id: {
        type: String,
        // default: shortid.generate,
        required: true
    },
    userId: {
        type: mongoose.SchemaTypes.String,
        ref: 'users',
        required: true,
    },
    todoTask: {
        type: String,
        required: true
    },
    todoDueDate: {
        type: String,
        required: true
    },
    todoTime: {
        type: String,
        required: true
    },
    todoStatus: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: false
    },
    updatedAt: {
        type: String,
        required: false
    }

});


const todos = mongoose.model('todos', todoSchema);

module.exports = {todos};
