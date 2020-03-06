const {response, handleError, MongooseErrorHandle} = require('../utils/response.util');


function checkRequiredFilled(postBody) {

    let message = '';

    let validString = new RegExp('^[a-zA-Z\\-_]*$');
    let validDate = new RegExp('^(\\d{4})(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$');
    let validTime = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');

    if (postBody.todoTask === '') {
        message = 'Todo Task is required';
    } else if (postBody.todoDueDate === '') {
        message = 'Todo Due Date is required';
    } else if (postBody.todoTime === '') {
        message = 'Todo Time is required';
    } else if (postBody.todoStatus === '') {
        message = 'Todo Time is required';
    } else if (!validString.test(postBody.todoTask)) {
        message = 'Task Name is only string allow';
    } else if (!validDate.test(postBody.todoDueDate)) {
        message = 'Todo Due Date is Invalid Format';
    } else if (!validTime.test(postBody.todoTime)) {
        message = 'Todo Time format is Invalid'
    } else {
        return null;
    }

    return {message};

}



function todoCheckAttribute(postBody) {

    let validString = new RegExp('^[a-zA-Z\\-_]*$');
    let validDate = new RegExp('^(\\d{4})(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$');
    let validTime = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');

    let message = '';
    if (!validString.test(postBody.todoTask)) {
        message = 'Task Name is only string allow';
    }
    else if (!validDate.test(postBody.todoDueDate)) {
        message = 'Todo Due Date is Invalid Format';
    } else if (!validTime.test(postBody.todoTime)) {
        message = 'Todo Time format is Invalid'
    } else {
        return null;
    }

    return {message};
}


function checkTodoStatus(postBody) {
    let todoStatus = ['completed', 'pending'];

    if (todoStatus.indexOf(`${postBody.todoStatus}`) > -1) {
        return false;
    }
    return {message: 'Todo Status Not Match'};
}

module.exports = {checkTodoStatus, checkRequiredFilled,todoCheckAttribute};
