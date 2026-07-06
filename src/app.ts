import express from "express"
import { errorHandler } from "./middleware/errorHandler"
import routes from "./routes/index"
const app=express()

app.set("trust proxy", true);
app.use(express.json())
app.use(routes)
app.use(errorHandler)

export default app;