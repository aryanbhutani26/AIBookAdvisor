import { Book } from "@/lib/types";
import { Star } from "lucide-react";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { title, author, genre, subgenre, description, year, pages, rating, imageUrl } = book;
  
  // Generate stars based on rating
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
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h4 className="font-playfair font-bold text-lg mb-1 text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mb-2">{author}</p>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-500">
            {Array(fullStars).fill(0).map((_, i) => (
              <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
            ))}
            {Array(remainingStars).fill(0).map((_, i) => (
              <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            ))}
          </div>
          <span className="text-xs ml-1 text-gray-600">({rating.toFixed(1)})</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {genre}{subgenre ? ` • ${subgenre}` : ""} • {year}
        </p>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary-700 font-medium text-sm">{pages} pages</span>
          <button className="text-sm px-3 py-1 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors">
            + Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
