const {response, handleError, MongooseErrorHandle} = require('../utils/response.util');


function checkRequiredFilled(postBody) {

    let message = '';
    if (postBody.todoTask === '') {
        message = 'todoTask is required';
    } else if (postBody.todoDueDate === '') {
        message = 'todoDueDate is required';
    } else if (postBody.todoTime === '') {
        message = 'todoTime is required';
    } else if (postBody.todoStatus === '') {
        message = 'todoStatus is required';
    } else {
        return false
    }
    return {message};

}


function todoCheckAttribute(postBody) {

    let validString = new RegExp('^[a-zA-Z\\-_]*$');
    let validDate = new RegExp('^(\\d{4})(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$');
    let validTime = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');

    let message = '';
    if (postBody.todoTask === undefined || postBody.todoTime === undefined || postBody.todoDueDate === undefined || postBody.todoStatus === undefined) {
        return false
    } else {
        if (!validString.test(postBody.todoTask)) {
            message = 'taskName is only string allow';
        } else if (!validDate.test(postBody.todoDueDate)) {
            message = 'todoDueDate is Invalid Format';
        } else if (!validTime.test(postBody.todoTime)) {
            message = 'todoTime format is Invalid'
        } else {
            return false;
        }
    }


    return {message};

}


function checkTodoStatus(postBody) {
    let todoStatus = ['completed', 'pending'];

    if (postBody.todoStatus === undefined) {
        return false
    } else {
        if (todoStatus.indexOf(`${postBody.todoStatus}`) > -1) {
            return false;
        }
        return {message: 'todoStatus Not Match'};
    }


}

module.exports = {checkTodoStatus, checkRequiredFilled, todoCheckAttribute};
