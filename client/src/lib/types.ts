export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  subgenre?: string;
  description: string;
  year: number;
  pages: number;
  rating: number;
  imageUrl: string;
}

export interface BookResponse {
  books: Book[];
}

export type FilterType = "All" | "Fiction" | "Non-Fiction" | "Newest";
