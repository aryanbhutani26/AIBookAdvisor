import React, { useState } from "react";
import axios from "axios";

function SearchForm() {
  const [input, setInput] = useState("");
  const [books, setBooks] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/recommend", {
        user_interest: input,
      });
      setBooks(res.data.recommendations);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };
  // Utility function to remove markdown bold (i.e., **text**)
  const cleanResponse = (text) => {
    return text.replace(/\*\*/g, "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📚 AI Book Recommender
      </h1>

      <div className="w-full max-w-xl flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="e.g., time travel and emotions"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={getRecommendations}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Get Recommendations
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading recommendations...</p>
      ) : (
        books && (
          // <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 whitespace-pre-wrap text-gray-800">
          //   {books}
          // </div>
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 whitespace-pre-wrap text-gray-800">
            {cleanResponse(books)}
          </div>
        )
      )}
    </div>
  );
}

export default SearchForm;
