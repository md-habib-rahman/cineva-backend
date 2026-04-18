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

export type Session = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: string;
  status: string;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
};

export type SessionResponse = {
  session: Session;
  user: User;
} | null;