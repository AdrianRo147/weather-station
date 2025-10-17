import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { records, users } from "../db/schema";
import { Request } from "express";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type UserWithoutPassword = Omit<User, "password">;

export type Record = InferSelectModel<typeof records>;
export type NewRecord = InferInsertModel<typeof records>;
export type RecordWithUsername = Omit<Record, "uploaded_by"> & { username: string | null };

export interface AuthenticatedRequest extends Request {
  userId: number
};
