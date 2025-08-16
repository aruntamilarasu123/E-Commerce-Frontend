import React, { useState } from 'react';

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-grow px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7f00] rounded-l-2xl"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-[#ff7f00] hover:bg-orange-600 text-white font-semibold rounded-r-2xl transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
