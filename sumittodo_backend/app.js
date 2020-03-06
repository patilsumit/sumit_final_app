const express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

let usersRouter = require('./routes/users.route');
let todoRouter = require('./routes/todos.route');


app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


//DB Config
const DB = require('./config/db_connection').MongoURI;

//Connect To Mongo
mongoose.connect(DB, {useNewUrlParser: true})
    .then(() => console.log('Database Connected...'))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use('/api', todoRouter.router);
app.use('/api', usersRouter.router);

app.use('/api', function (req, res, next) {
    res.status(404).send({error: false, message: 'API Does Not Found'});

});

module.exports = app;

