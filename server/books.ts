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
      title: record.title,
      author: record.author,
      genre: record.genre,
      subgenre: record.subgenre || undefined,
      description: record.description,
      year: parseInt(record.year, 10),
      pages: parseInt(record.pages, 10),
      rating: parseFloat(record.rating),
      imageUrl: record.imageUrl,
    }));

    booksCache = books;
    return books;
  } catch (error) {
    console.error("Error loading books:", error);
    
    // Return fallback data if CSV loading fails
    return getFallbackBooks();
  }
}

// Fallback book data
function getFallbackBooks(): Book[] {
  return [
    {
      id: 1,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Psychological Thriller",
      description: "A woman shoots her husband and then never speaks another word. A psychological thriller that explores the mind of a psychotherapist determined to get her to talk.",
      year: 2019,
      pages: 336,
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Gone Girl",
      author: "Gillian Flynn",
      genre: "Psychological Thriller",
      description: "A woman disappears on her fifth wedding anniversary. As the investigation unfolds, it becomes clear that nothing is as it seems in this twisted psychological thriller.",
      year: 2012,
      pages: 432,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "The Woman in the Window",
      author: "A.J. Finn",
      genre: "Psychological Thriller",
      description: "An agoraphobic woman witnesses a crime in a neighboring house but no one believes her. Twists and turns abound in this Hitchcockian thriller.",
      year: 2018,
      pages: 427,
      rating: 4.1,
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Sharp Objects",
      author: "Gillian Flynn",
      genre: "Mystery/Thriller",
      description: "A reporter returns to her hometown to cover the murders of two preteen girls. A dark psychological thriller exploring family trauma.",
      year: 2006,
      pages: 254,
      rating: 4.3,
      imageUrl: "https://images.unsplash.com/photo-1603162525937-92a836033412?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "The Girl on the Train",
      author: "Paula Hawkins",
      genre: "Psychological Thriller",
      description: "A commuter fantasizes about a seemingly perfect couple she sees during her daily train ride until she becomes entangled in a missing persons investigation.",
      year: 2015,
      pages: 316,
      rating: 4.0,
      imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2095c6?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Before I Go to Sleep",
      author: "S.J. Watson",
      genre: "Psychological Thriller",
      description: "A woman with anterograde amnesia wakes up every day with no memory of who she is. Through her journal, she tries to reconstruct her life with shocking discoveries.",
      year: 2011,
      pages: 359,
      rating: 4.2,
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop"
    }
  ];
}

// Recommend books using Google Gemini AI
export async function recommendBooks(query: string, model: GenerativeModel): Promise<Book[]> {
  try {
    const books = await loadBooks();
    
    // If no API key is provided, perform a simple keyword search as fallback
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      return performKeywordSearch(query, books);
    }
    
    // Prepare books data for the AI prompt
    const booksData = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      subgenre: book.subgenre,
      year: book.year,
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
      // Handle potential formatting issues in the AI response
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
      console.log("AI response text:", text);
      // Fall back to keyword search if AI response can't be parsed
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

// Fallback keyword-based search
function performKeywordSearch(query: string, books: Book[]): Book[] {
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  // Score each book based on how many search terms it matches
  const scoredBooks = books.map(book => {
    const bookText = `${book.title} ${book.author} ${book.genre} ${book.subgenre || ''} ${book.description}`.toLowerCase();
    
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
