require('dotenv').config();
const express = require('express');

const user_router = require('./users');

const app = express();

app.use('/users', user_router);

app.get('/', function (req, res) {
    res.send(
        "This url now works!"
    );
})

app.get('/*', (req, res) => {
    res.send({"detail": "The requested resouce couldn't be found."}).status(404);
})

app.listen(process.env.PORT, () => {
    console.log('This server is now listening. Go give it a whirl!');
})