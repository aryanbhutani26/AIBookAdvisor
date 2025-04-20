import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  genre: text("genre").notNull(),
  subgenre: text("subgenre"),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  pages: integer("pages").notNull(),
  rating: doublePrecision("rating").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export const bookResponseSchema = z.object({
  books: z.array(z.object({
    id: z.number(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    subgenre: z.string().optional(),
    description: z.string(),
    year: z.number(),
    pages: z.number(),
    rating: z.number(),
    imageUrl: z.string()
  }))
});

export type BookResponse = z.infer<typeof bookResponseSchema>;
