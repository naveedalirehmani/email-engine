// import * as path from "path";
import cors from "cors";
import express, { Express } from "express";
import deserializeUser from "./middlewares/deserializeUsers";
import cookieParser from "cookie-parser";

import Api1 from "./routes/api";
import morgan from "morgan";
import { corsOptions } from "./config/cors.config";

const app: Express = express();

app.use(cookieParser());
app.use(deserializeUser);
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("combined"));

// for serving static files.
// app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/v1", Api1);

export default app;
