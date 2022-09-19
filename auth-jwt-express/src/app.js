const express = require('express');
require('dotenv').config();
require('./config/mongo.database.config')
const createError = require('http-errors');
const AuthRoute =require('../src/routes/auth.route');
const {verifyAccessToken} =require('./config/jwt.config')

require('./config/redis.config');


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.get('/',verifyAccessToken,async (req, res,next) => {
    console.log(req.payload);
    res.send('Hello from express application..');
});

app.use('/auth',AuthRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.send({
        error: {
            status: err.status || 5000,
            message: err.message

        }
    });
});



app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});