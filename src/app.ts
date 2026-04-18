import express, { Application, Request, Response } from "express";
import { indexRouter } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";

const app: Application = express()

app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), './src/app/templates'))

app.use("/api/auth", toNodeHandler(auth))

app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(cookieParser())

app.use("/api/v1", indexRouter)

app.get('/', (req: Request, res: Response) => {

	res.send('Hello, TypeScript + Express!');
});

app.use(globalErrorHandler)
app.use(notFound)

export default app;