import express from "express"
import { errorHandler } from "./middleware/errorHandler"
import pinoHttp from "pino-http"
import cors from "cors"
import routes from "./routes/index"
const app=express()

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json())
app.use(pinoHttp());
app.use(routes);

app.use(routes)
app.use(errorHandler)

export default app;