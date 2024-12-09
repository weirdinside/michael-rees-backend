const express = require("express");
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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

const corsOptions = {
  origin: ['http://localhost:3000', 'https://rees.club', 'http://127.0.0.1:3000', '167.88.45.75:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use("/thumbnails", cors(), express.static("thumbnails", {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use("/", router);

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});