/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import path from "node:path";
import ejs from 'ejs'

const transporter = nodemailer.createTransport({
	host: envVars.SMTP_HOST,
	secure: true,
	auth: {
		user: envVars.APP_USER,
		pass: envVars.APP_PASS
	},
	port: Number(envVars.SMTP_PORT)
})

interface SendEmailOptions {
	to: string;
	subject: string;
	templateName: string;
	templateData: Record<string, any>;
	attachments?: {
		filename: string;
		content: Buffer | string;
		contentType: string;
	}[]

}

export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: SendEmailOptions): Promise<void> => {


	try {
		const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`)

		const html = await ejs.renderFile(templatePath, templateData)
		const info = await transporter.sendMail({
			from: "Cineva",
			to: to,
			subject,
			html,
			attachments: attachments?.map(attachment => ({
				filename: attachment.filename,
				content: attachment.content,
				contentType: attachment.contentType
			}))
		})
		console.log(`Email sent to ${to}: ${info.messageId}`)

	} catch (error: any) {
		console.log("Email sending Error ", error.message)

	}

}