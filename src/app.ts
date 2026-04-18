import express, { Application, Request, Response } from "express";
import { indexRouter } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from 'cors';
import { envVars } from "./app/config/env";

const app: Application = express()

app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), './src/app/templates'))

app.use(cors({
	origin: [envVars.APP_URL, envVars.BETTER_AUTH_URL],
	credentials: true,
	methods: ["GET", 'POST', 'PATCH', 'PUT', 'DELETE'],
	allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use("/api/auth", toNodeHandler(auth))

app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(cookieParser())

// app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", indexRouter)

app.get('/', (req: Request, res: Response) => {

	res.send('Hello, TypeScript + Express!');
});

app.use(globalErrorHandler)
app.use(notFound)

export default app;