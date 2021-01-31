require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const intoleranceRouter = require('./routes/intolerances')
const recipesRoute = require('./routes/recipes')
const app = express();
const uri = 'mongodb://localhost/foodies';

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/intolerances', intoleranceRouter);
app.use('/api/recipes', recipesRoute)

//Database config
const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true}
await mongoose.connect(process.env.MONGODB_URL || uri, options)


app.listen(process.env.PORT || 2400, () => {
    console.log('server started : 2400')
});

module.exports = app;
