const express = require("express");
require('dotenv').config();
const cors = require("cors");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const router = require("./routes/index");
const { errorHandler } = require('./middlewares/error-handler')

const app = express();
const port = 3001;

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.on('open', ()=> console.log('connected to database'))

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use(requestLogger);

app.use(cors());
app.use('/', router)

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})