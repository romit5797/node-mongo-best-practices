import express from "express";
import userRouter from "./routes/userRouter.js";
import dotenv from "dotenv";
import appError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
dotenv.config({ path: "./config.env" });
const app = express();

//add rate limit to the app to prevent dos attack
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
//Securre http headers
app.use(helmet());

// parse application/json
app.use(express.json({ limit: "10kb" }));
// sanitize data to prevent from NoSql injection
app.use(mongoSanitize());
// sanitize data to prevent XSS, cross site scripting
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    whitelist: ["name", "email", "age", "password", "passwordConfirm", "role"],
  })
);

app.use("/api/v1/users", userRouter);

//Midleware to handle undefined routes
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
