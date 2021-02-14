require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth');
const intoleranceRouter = require('./routes/intolerances')
const recipesRoute = require('./routes/recipes')
const app = express();
const uri = 'mongodb://localhost/foodies';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/intolerances', intoleranceRouter);
app.use('/api/recipes', recipesRoute)

app.set('view engine', 'pug');
app.get('/', (req, res) => res.render('index'))
app.get('/recipes', (req, res) => res.redirect('/'))

app.listen(process.env.PORT || 2400, async () => {
    console.log('server started : 2400')

    //Database config
    const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true}
    await mongoose.connect(process.env.MONGODB_URL || uri, options)
    console.log('Connected to DB successfully')
});

module.exports = app;
