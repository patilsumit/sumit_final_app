const express = require('express');
const {todos} = require('../models/todo.model');
const {response, handleError, MongooseErrorHandle} = require('../utils/response.util');
const {validate} = require('../middleware/auth');
const {checkTodoStatus, checkRequiredFilled, todoCheckAttribute} = require('../validators/todoValidators');
const {validFiledCheck, positive_number, generate_number_random} = require('../validators/common.validators');


let router = express.Router();
let todoSchema = todos.schema.tree;

router.post('/todos', validate, (req, res) => {
    const currentTime = new Date();
    let {todoTask, todoDueDate, todoTime, todoStatus} = req.body;


    let errorMessage = '';

    let checkValidFiled = validFiledCheck(req.body, todoSchema);
    let checkRequired = checkRequiredFilled(req.body);
    let checkAttribute = todoCheckAttribute(req.body);
    let checkStatus = checkTodoStatus(req.body);
    if (checkValidFiled) {
        errorMessage = checkValidFiled.message;
    } else if (checkRequired) {
        errorMessage = checkRequired.message;
    } else if (checkAttribute) {
        errorMessage = checkAttribute.message;
    } else if (checkStatus) {
        errorMessage = checkStatus.message;
    }

    if (errorMessage) {
        return handleError(400, errorMessage, res);
    }


    let new_todo = new todos({
        _id: `${Date.now() + ((Math.random() * 100000).toFixed())}`,
        userId: req.user._id,
        todoTask: todoTask,
        todoDueDate: todoDueDate,
        todoTime: todoTime,
        todoStatus: todoStatus,
        createdAt: currentTime

    });

    new_todo.save((err, data) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }

        return response(201, data, res);
    })

});

router.get('/todos', validate, (req, res) => {

    let queryCheck = positive_number(req.query.limit, req.query.skip);
    if (queryCheck) {
        return handleError(400, queryCheck.message, res);
    }

    let pageNo = parseInt(req.query.skip);

    let limitSize = parseInt(req.query.limit);

    let sort = parseInt(req.query.sort);

    todos.countDocuments({userId: req.user._id}).exec((err, totalCount) => {
        todos.find({
            userId: req.user._id
        })
            .skip(pageNo)
            .limit(limitSize)
            .sort([['todoTask', sort]])
            .exec((err, data) => {
                if (err) {
                    return MongooseErrorHandle(err, res);
                }

                if (!data) {
                    return handleError(404, 'No user found', res);
                }

                return response(200, {data: data, totalCount: totalCount}, res);
            })
    })


});

router.get('/todos/search', validate, (req, res) => {

    let queryCheck = positive_number(req.query.limit, req.query.skip);
    if (queryCheck) {
        return handleError(400, queryCheck.message, res);
    }

    let todoTask = req.query.todotask;

    let skip = parseInt(req.query.skip);

    let limit = parseInt(req.query.limit);

    let sort = parseInt(req.query.sort);

    let searchQuery = new RegExp(todoTask, 'i');

    todos.countDocuments({userId: req.user._id, todoTask: searchQuery}).exec((err, totalCount) => {

        todos.find({
            userId: req.user._id,
            todoTask: searchQuery
        })
            .skip(skip)
            .sort([['todoTask', sort]])
            .limit(limit).exec((err, data) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }

            return response(200, {data: data, totalCount: totalCount}, res);
        })
    })

});


router.get('/todos/:id', validate, (req, res) => {
    let id = req.params.id;

    todos.findById({_id: id}).exec((err, data) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        if (!data) {
            return handleError(404, 'Id Not found', res);
        }

        return response(200, data, res);
    })
});


router.put('/todos/:id', validate, (req, res) => {
    let id = req.params.id;
    let {todoStatus} = req.body;
    const currentTime = new Date();
    let errorMessage = '';
    let checkValidFiled = validFiledCheck(req.body, todoSchema);
    let checkRequired = checkRequiredFilled(req.body);
    let checkAttribute = todoCheckAttribute(req.body);
    let checkStatus = checkTodoStatus(req.body);

    if (checkValidFiled) {
        errorMessage = checkValidFiled.message;
    } else if (checkRequired) {
        errorMessage = checkRequired.message;
    } else if (checkAttribute) {
        errorMessage = checkAttribute.message;
    } else if (checkStatus) {
        errorMessage = checkStatus.message;
    }

    if (errorMessage) {
        return handleError(400, errorMessage, res);
    }


    todos.findOneAndUpdate({
        _id: id
    }, {
        todoStatus: todoStatus,
        updatedAt: currentTime
    }).exec((err, data) => {

        if (err) {
            return MongooseErrorHandle(err, res);
        }

        if (!data) {
            return handleError(404, 'Id Not Found', res)
        }
        return response(200, data, res);
    });
});

router.delete('/todos/:id', validate, (req, res) => {
    let id = req.params.id;

    todos.findOneAndDelete({
        _id: id
    }).exec((err, data) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }

        if (!data) {
            return handleError(404, 'Id Not Found', res);
        }

        return response(200, 'Todo Delete Successfully', res);
    })


});


module.exports = {router};
