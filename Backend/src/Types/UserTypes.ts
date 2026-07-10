export type UserRole = "customer" | "agent" | "admin";

export interface IUser extends Document {
  name: string;

  email: string;

  password: string;

  role: UserRole;

  avatar?: string;

  createdAt: Date;
  isBlocked:boolean,
}
