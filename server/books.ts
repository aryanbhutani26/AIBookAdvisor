import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { Book } from "@shared/schema";
import { GenerativeModel } from "@google/generative-ai";

// In-memory cache for books data
let booksCache: Book[] | null = null;

// Load books from CSV file
async function loadBooks(): Promise<Book[]> {
  if (booksCache) return booksCache;

  try {
    const filePath = path.resolve(import.meta.dirname, "data", "books.csv");
    const fileContent = await fs.readFile(filePath, "utf-8");

    const parsedData = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Convert CSV data to Book objects
    const books: Book[] = parsedData.map((record: any, index: number) => ({
      id: index + 1,
      isbn13: record.isbn13 || null,
      isbn10: record.isbn10 || null,
      title: record.title,
      authors: record.authors,
      categories: record.categories,
      thumbnail: record.thumbnail,
      description: record.description,
      published_year: record.published_year ? parseFloat(record.published_year) : null,
      average_rating: record.average_rating ? parseFloat(record.average_rating) : null,
      num_pages: record.num_pages ? parseFloat(record.num_pages) : null,
      ratings_count: record.ratings_count ? parseFloat(record.ratings_count) : null
    }));

    booksCache = books;
    return books;
  } catch (error) {
    console.error("Error loading books:", error);
    return [];
  }
}

// Recommend books using search or AI
export async function recommendBooks(query: string, model: GenerativeModel): Promise<Book[]> {
  try {
    const books = await loadBooks();

    // If no API key is provided, perform a simple keyword search
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      return performKeywordSearch(query, books);
    }

    // Prepare books data for the AI prompt
    const booksData = books.map(book => ({
      id: book.id,
      title: book.title,
      authors: book.authors,
      categories: book.categories,
      description: book.description.substring(0, 100) + "..."  // Truncate for prompt size
    }));

    // Create a structured prompt for the AI
    const prompt = `
    I want you to recommend books based on a user's preference. The user is looking for: "${query}".

    Below is a list of books in our database:
    ${JSON.stringify(booksData, null, 2)}

    Based on the user's preference, return ONLY a JSON array of book IDs (numbers) that match the user's preference. 
    Do not include any explanation or additional text, just the JSON array of numbers. 
    Choose the 6 most relevant books for this request. 
    Example response: [1, 4, 15, 23, 9, 17]
    `;

    // Generate response using the Gemini model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse the JSON array from the AI response
    let bookIds: number[] = [];
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;

      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonText = text.substring(jsonStart, jsonEnd);
        bookIds = JSON.parse(jsonText);
      } else {
        throw new Error("Could not find JSON array in AI response");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return performKeywordSearch(query, books);
    }

    // Find the corresponding books from the database
    const recommendedBooks = bookIds
      .map(id => books.find(book => book.id === id))
      .filter((book): book is Book => book !== undefined);

    // If AI didn't return enough results, fall back to keyword search
    if (recommendedBooks.length < 3) {
      return performKeywordSearch(query, books);
    }

    return recommendedBooks;
  } catch (error) {
    console.error("Error in book recommendation:", error);
    const books = await loadBooks();
    return performKeywordSearch(query, books);
  }
}

// Keyword-based search
function performKeywordSearch(query: string, books: Book[]): Book[] {
  const searchTerms = query.toLowerCase().split(/\s+/);

  // Score each book based on how many search terms it matches
  const scoredBooks = books.map(book => {
    const bookText = `${book.title} ${book.authors} ${book.categories} ${book.description}`.toLowerCase();

    // Count how many search terms match this book
    const score = searchTerms.reduce((count, term) => {
      return bookText.includes(term) ? count + 1 : count;
    }, 0);

    return { book, score };
  });

  // Sort by score (descending) and return top 6 books
  return scoredBooks
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.book);
}

export { loadBooks };