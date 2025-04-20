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
  isbn13: text("isbn13").notNull(),
  isbn10: text("isbn10").notNull(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  categories: text("categories").notNull(),
  thumbnail: text("thumbnail").notNull(),
  description: text("description").notNull(),
  published_year: integer("published_year").notNull(),
  average_rating: doublePrecision("average_rating").notNull(),
  num_pages: integer("num_pages").notNull(),
  ratings_count: integer("ratings_count").notNull()
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
