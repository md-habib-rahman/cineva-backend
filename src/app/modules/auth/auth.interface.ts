export interface IChangePasswordPayload {
	oldPassword: string;
	newPassword: string;
}

export interface RegisterUserPayload {
	name: string;
	email: string;
	password: string;
}
export interface ILoginUserPayload {
	email: string;
	password: string;
}