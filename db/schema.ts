import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  account: text().notNull(),
  pw: text().notNull(),
  logo: text().notNull(),
  note: text().notNull(),
});