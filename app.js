const createError = require("http-errors");
const express = require("express");
const path = require("node:path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./app_api/routes/users");
const jwtAuth = require("./middlewares/jwtAuth");

require("dotenv").config();
require("./db");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// const corsOptions = {
//     origin: ["http://localhost:8080"],
//     credentials: true
// };

// app.use(require("./middlewares/AcessControllMiddleware"));
app.use(cors());
// app.use((req, res, next) => {
//     const origin = req.headers.origin || "";
//     console.log("origin");
//     console.log(origin);
//     if (origin.includes("localhost")) {
//         res.setHeader("Access-Control-Allow-Origin", origin);
//         res.setHeader("Access-Control-Allow-Credentials", "true");
//         if (req.method === "OPTIONS") {
//             res.setHeader("Access-Control-Allow-Methods", "GET");
//             res.setHeader(
//                 "Access-Control-Allow-Headers",
//                 "x-requested-with, content-type"
//             );
//             res.status(204).end();
//             return;
//         }
//     }
//     next();
// });
// app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(jwtAuth);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
