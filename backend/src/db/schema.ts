import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, datetime, serial, decimal, bigint } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: bigint({ mode: 'number' }).autoincrement().primaryKey(),
  username: varchar({ length: 255 }).unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 5, enum: ["user", "admin"] }).default("user")
});

export const records = mysqlTable("records", {
  id: bigint({ mode: 'number' }).autoincrement().primaryKey(),
  temperature: decimal({ precision: 10, scale: 2 }).notNull(),
  uploaded_by: bigint({ mode: 'number' }).notNull().references(() => users.id),
  uploaded_at: datetime().notNull().default(sql`CURRENT_TIMESTAMP`)
});
