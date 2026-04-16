
import { IRequestUser } from "./user.interface";


declare global {
	namespace Express {
		interface Request {
			user: IRequestUser
		}
	}
}
