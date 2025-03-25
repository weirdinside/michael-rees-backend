const express = require("express");
const path = require('path');
require("dotenv").config();
const cors = require("cors");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const router = require("./routes/index");
const { errorHandler } = require("./middlewares/error-handler");

const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const app = express();
const port = 3001;

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.on("open", () => console.log("connected to database"));

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 1000,
//     standardHeaders: 'draft-7',
//     legacyHeaders: false,
// });

const corsOptions = {
  origin: ['https://www.rees.club', 'https://rees.club', 'https://weirdinside.github.io'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

// app.use(limiter);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use('/api/thumbnails', (req, res, next) => {
  const requestedFile = path.join(__dirname, 'thumbnails', req.url.split('/').pop());
  console.log(`Attempting to serve file: ${requestedFile}`);
  next();
});

app.use("/api/thumbnails", express.static(path.join(__dirname, 'thumbnails'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', 'https://www.rees.club');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use("/api", router);

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});