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
  isbn13: text("isbn13"),
  isbn10: text("isbn10"),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  categories: text("categories").notNull(),
  thumbnail: text("thumbnail").notNull(),
  description: text("description").notNull(),
  published_year: doublePrecision("published_year"),
  average_rating: doublePrecision("average_rating"),
  num_pages: doublePrecision("num_pages"),
  ratings_count: doublePrecision("ratings_count")
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
    isbn13: z.string().nullable(),
    isbn10: z.string().nullable(),
    title: z.string(),
    authors: z.string(),
    categories: z.string(),
    thumbnail: z.string(),
    description: z.string(),
    published_year: z.number().nullable(),
    average_rating: z.number().nullable(),
    num_pages: z.number().nullable(),
    ratings_count: z.number().nullable()
  }))
});

export type BookResponse = z.infer<typeof bookResponseSchema>;