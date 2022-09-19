
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./src/config/db');

const app = express()
const port = 8055


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));



app.use('/api/auth', require('./src/routes/auth.rout'));
app.use('/api/notes', require('./src/routes/notes.rout'));

app.get('/', (req, res) => {
    res.json({ 'message': 'ok' });
});


app.listen(port, () => {
    console.log(`express app listening on port ${port}`)  
})