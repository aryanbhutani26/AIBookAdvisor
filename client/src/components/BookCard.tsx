
import { Book } from "@shared/schema";
import { Star } from "lucide-react";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { title, authors, categories, description, published_year, num_pages, average_rating, thumbnail } = book;
  
  // Generate stars based on rating (scaled to 5 stars)
  const rating = average_rating || 0;
  const fullStars = Math.floor(rating);
  const remainingStars = 5 - fullStars;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg relative book-spine">
      <style jsx>{`
        .book-spine::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 8px;
          height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0));
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          z-index: 1;
        }
      `}</style>
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h4 className="font-playfair font-bold text-lg mb-1 text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mb-2">{authors}</p>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-500">
            {Array(fullStars).fill(0).map((_, i) => (
              <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
            ))}
            {Array(remainingStars).fill(0).map((_, i) => (
              <Star key={`empty-${i}`} className="w-4 h-4" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{categories}</p>
        <p className="text-sm text-gray-500 line-clamp-3">{description}</p>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>{published_year}</span>
          <span>{num_pages} pages</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
