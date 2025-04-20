import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Dark academia novels set in universities",
  "Science fiction with AI characters",
  "Cozy mysteries with baking themes",
];

interface SearchFormProps {
  onSearch: (query: string) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handlePromptClick = (prompt: string) => {
    setSearchQuery(prompt);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8">
      <form onSubmit={handleSubmit}>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2 text-left">
          Describe what you're looking for:
        </label>
        <div className="relative mt-1">
          <Input
            type="text"
            id="search"
            name="search"
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-md border-gray-300 rounded-lg py-3 px-4"
            placeholder="e.g. 'psychological thrillers with a female lead' or 'fantasy books like Lord of the Rings'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-primary-600 hover:bg-primary-700 rounded-r-lg transition-colors"
          >
            <span className="hidden sm:block font-montserrat mr-1">Recommend</span>
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          <span className="text-xs font-medium text-gray-500">Try:</span>
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              type="button"
              className="text-xs bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-600 px-2 py-1 rounded-full transition-colors"
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
