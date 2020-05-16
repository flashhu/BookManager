const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());  /* 解决跨域问题 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// admin
app.use('/user', require('./route/user'));
app.use('/admin', require('./route/admin'));
app.use('/reader', require('./route/reader'));
app.use('/book', require('./route/book'));

app.listen(port, () => console.log(`> Running on localhost:${port}`))