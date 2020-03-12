const express = require('express');
const {users} = require('../models/user.model');
const {response, handleError, MongooseErrorHandle} = require('../utils/response.util');
const {validate} = require('../middleware/auth');
const {encrypt, compare} = require('../utils/crypto/hash.util');
const {sign, decode} = require('../utils/crypto/jwt.util');
const nodeMailer = require('nodemailer');
const {userRequiredFiled, userCheckAttribute} = require('../validators/userValidators');
const {validFiledCheck} = require('../validators/common.validators');

let router = express.Router();
let userSchemaDetails = users.schema.tree;

router.post('/users', (req, res) => {
    let {userName, userEmail, userPassword} = req.body;

    let errorMessage = '';
    let checkValidFiled = validFiledCheck(req.body, userSchemaDetails);
    let checkRequired = userRequiredFiled(req.body);
    let checkAttribute = userCheckAttribute(req.body);
    if (checkValidFiled) {
        errorMessage = checkValidFiled.message;
    } else if (checkRequired) {
        errorMessage = checkRequired.message;
    } else if (checkAttribute) {
        errorMessage = checkAttribute.message;
    }

    if (errorMessage) {
        return handleError(400, errorMessage, res);
    }

    users.findOne({
        userEmail: userEmail
    }).exec((err, data) => {

        if (err) {
            return MongooseErrorHandle(err, res);
        }

        if (data) {
            return handleError(409, 'userEmail already exists', res);
        }

        let new_user = new users({
            _id: `${Date.now() + ((Math.random() * 100000).toFixed())}`,
            userName: userName,
            userEmail: userEmail,
            userPassword: encrypt(userPassword),
            userStatus: 1
        });
        new_user.save((err, result) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }

            return response(201, result, res);
        })
    })
});

router.post('/users/login', (req, res) => {

    let {userEmail, userPassword} = req.body;

    let errorMessage = '';
    let checkValidFiled = validFiledCheck(req.body, userSchemaDetails);
    let requireCheck = userRequiredFiled(req.body);

    if (checkValidFiled) {
        errorMessage = checkValidFiled.message;
    } else if (requireCheck) {
        errorMessage = requireCheck.message
    }

    if (errorMessage) {
        return handleError(400, errorMessage, res);
    }


    users.findOne({
        userEmail: userEmail
    }).exec((err, data) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }

        if (!data) {
            return handleError(409, 'No user found', res);
        }

        if (data.userStatus === 0) {
            return handleError(401, 'Your Account Is Blocked', res);
        }

        if (!compare(data.userPassword.hash, data.userPassword.salt, userPassword)) {
            return response(403, 'userPassword is invalid', res)
        }


        sign(data._id).then((token) => {
            let resp_data = {
                token,
                userName: data.userName,
                userEmail: data.userEmail,
            };

            return response(200, resp_data, res)
        })
    })
});


router.get('/users/profile', validate, (req, res) => {
    users.findOne({
        _id: req.user._id
    }).exec((err, data) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }

        if (!data) {
            return handleError(404, 'No user found', res);
        }


        return response(200, data, res);
    })
});


router.post('/users/forget-password', (req, res) => {

    let {userEmail} = req.body;

    let errorMessage = '';
    let checkValidFiled = validFiledCheck(req.body, userSchemaDetails);
    let checkAttribute = userCheckAttribute(req.body);

    if (userEmail === '') {
        errorMessage = 'User Email is required';
    } else if (checkValidFiled) {
        errorMessage = checkValidFiled.message;
    } else if (checkAttribute) {
        errorMessage = checkAttribute.message;
    }

    if (errorMessage) {
        return handleError(400, errorMessage, res);
    }


    users.findOne({
        userEmail: userEmail
    }).exec((err, data) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }

        if (!data) {
            return handleError(409, 'Your Email is not registered', res);
        }

        if (data.userStatus === 0) {
            return handleError(401, 'Your Account Is Blocked', res);
        }

        sign(data._id).then((token) => {
            let response_data = {
                token
            };

            let transporter = nodeMailer.createTransport({

                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            let mailOptions = {
                from: 'patilsumit2020@gmail.com',
                to: req.body.userEmail,
                subject: 'Forget Password Reset Link',
                text: 'Click on this Link',
                html:
                    '<h4><b>Reset Password</b></h4>' +
                    '<p>To reset your password, complete this form:</p>' +
                    ' http://localhost:4200/users/reset-password?token=' + token + '">' +
                    '<br><br>' +
                    '<p>--Team Todo</p>'
            };

            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log('Error occurs', err);
                } else {
                    console.log('Email sent!!!');
                }
            });

            return response(200, response_data, res)
        });
    });
});


router.post('/users/reset-password', (req, res) => {

    let {userPassword, token} = req.body;
    let tokenDecode = decode(token);

    if (userPassword === '' || userPassword === undefined) {
        return handleError(400, 'userPassword is required', res);
    }

    tokenDecode.then((result) => {
        let decodeId = result.user_id;
        users.findOneAndUpdate({
            _id: decodeId
        }, {
            'userPassword': encrypt(userPassword)
        }).exec((err, data) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            if (!data) {
                return handleError(404, 'Id Not Found', res)
            }
            return response(200, 'Password Update Successfully', res);
        })
    }, error => {
        return handleError(400, error, res);
    });


});


module.exports = {router};
