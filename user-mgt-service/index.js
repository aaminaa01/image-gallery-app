require('dotenv').config();
const express = require('express');
const cors = require('cors');

const user_router = require('./users');

const app = express();
const port = process.env.PORT || 8080; // Use 8080 if PORT is not defined in the environment

app.use('/users', cors(), user_router);

app.get('/*', (req, res) => {
    res.status(404).send({"error": "The requested resource couldn't be found."});
});

app.listen(port, () => {
    console.log(`This server is now listening on port ${port}. Go give it a whirl!`);
});