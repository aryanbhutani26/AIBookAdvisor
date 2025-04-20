import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import BookCard from "@/components/BookCard";
import FeaturesSection from "@/components/FeaturesSection";
import FutureFeatures from "@/components/FutureFeatures";
import Footer from "@/components/Footer";
import { Book, BookResponse, FilterType } from "@/lib/types";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/recommend", { query });
      return response.json() as Promise<BookResponse>;
    },
    onSuccess: (data) => {
      setBooks(data.books);
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    mutate(query);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const filteredBooks = books.filter(book => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Fiction") return !book.genre.includes("Non-Fiction");
    if (activeFilter === "Non-Fiction") return book.genre.includes("Non-Fiction");
    if (activeFilter === "Newest") return book.year >= 2015;
    return true;
  });

  const hasResults = books.length > 0;

  return (
    <div className="bg-gray-50 font-inter text-gray-800 min-h-screen flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900 mb-4">
              Discover Your Next Favorite Book
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Powered by AI to understand your unique reading preferences
            </p>

            <SearchForm onSearch={handleSearch} />
          </div>
        </section>

        <section id="results-section">
          {isPending && (
            <div>
              <div className="mb-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
              <p className="text-center text-gray-600 animate-pulse">
                Searching the literary universe for your perfect matches...
              </p>

              <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-72 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isPending && hasResults && (
            <div>
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3 className="text-2xl font-playfair font-semibold text-gray-900">
                  Recommended Books
                </h3>

                <div className="flex space-x-2 overflow-x-auto pb-1">
                  <button 
                    onClick={() => handleFilterChange("All")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeFilter === "All" 
                        ? "bg-primary-100 text-primary-800 font-medium" 
                        : "bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    } transition-colors`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => handleFilterChange("Fiction")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeFilter === "Fiction" 
                        ? "bg-primary-100 text-primary-800 font-medium" 
                        : "bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    } transition-colors`}
                  >
                    Fiction
                  </button>
                  <button 
                    onClick={() => handleFilterChange("Non-Fiction")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeFilter === "Non-Fiction" 
                        ? "bg-primary-100 text-primary-800 font-medium" 
                        : "bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    } transition-colors`}
                  >
                    Non-Fiction
                  </button>
                  <button 
                    onClick={() => handleFilterChange("Newest")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeFilter === "Newest" 
                        ? "bg-primary-100 text-primary-800 font-medium" 
                        : "bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    } transition-colors`}
                  >
                    Newest
                  </button>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {filteredBooks.length > 0 && (
                <div className="mt-8 text-center">
                  <button className="px-6 py-2 bg-white border border-primary-300 text-primary-700 rounded-full hover:bg-primary-50 transition-colors font-montserrat font-medium">
                    Load More Books
                  </button>
                </div>
              )}
              
              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
                  <p className="mt-2 text-sm text-gray-500">No matches found for the current filter. Try another category.</p>
                </div>
              )}
            </div>
          )}

          {!isPending && !hasResults && !isError && (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your search criteria or explore suggested categories.</p>
              <div className="mt-6">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Browse Popular Books
                </button>
              </div>
            </div>
          )}

          {isError && (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-red-800">Something went wrong</h3>
              <p className="mt-2 text-sm text-red-700">
                {error instanceof Error ? error.message : "We couldn't process your request. Please try again later."}
              </p>
              <div className="mt-6">
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => searchQuery && mutate(searchQuery)}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </section>

        <FeaturesSection />
        <FutureFeatures />
      </main>

      <Footer />
    </div>
  );
}
