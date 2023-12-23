require('dotenv').config();
const express = require('express');

const user_router = require('./users');

const app = express();

app.use('/users', user_router);
app.get('/routes', (req, res) => {
    let routes = [];
    user_router.stack.forEach((object) => {
        if(object.route) routes.push(object.route.path);
    })
    console.log(routes);
    res.status(200).json(routes);
});

app.get('/*', (req, res) => {
    res.status(404).send({"error": "The requested resouce couldn't be found."});
})

app.listen(process.env.PORT, () => {
    console.log(`This server is now listening on port ${process.env.PORT}. Go give it a whirl!`);
})