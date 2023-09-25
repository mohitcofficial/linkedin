import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middleware/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config({
  path: "./config/config.env",
});

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.0.100:5173",
      "http://192.168.125.1:5173",
      "http://192.168.0.110:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

import user from "./routes/userRoutes.js";
import conversation from "./routes/conversationRoutes.js";
import message from "./routes/messageRoutes.js";
import image from "./routes/imageRoutes.js";

app.use("/api/", user);
app.use("/api/", conversation);
app.use("/api/", message);
app.use("/api/", image);

app.use(ErrorMiddleware);
export default app;
