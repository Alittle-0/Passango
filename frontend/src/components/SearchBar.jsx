import React, { useState, useEffect, useRef } from 'react';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // === BACKEND/API/DATABASE INTEGRATION POINT 1: Fetch Suggestions ===
  // Replace with your API call to the database (e.g., MongoDB, Firebase).
  // Example: https://your-api.com/songs?query=${query}
  const fetchSuggestions = async (query = '') => {
    try {
      const response = await fetch(`/api/songs?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      return data; // Expecting [{ id, title, image }, ...]
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  // Load previous searches from localStorage
  const getPreviousSearches = () => {
    const searches = localStorage.getItem('previousSearches');
    return searches ? JSON.parse(searches) : [];
  };

  // Save search to localStorage
  const saveSearch = (term) => {
    if (!term.trim()) return;
    const searches = getPreviousSearches();
    if (!searches.includes(term)) {
      searches.unshift(term);
      localStorage.setItem('previousSearches', JSON.stringify(searches.slice(0, 5)));
    }
  };

  // Handle input change and suggestions
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions(getPreviousSearches());
    } else {
      const fetchedSuggestions = await fetchSuggestions(value);
      const filtered = fetchedSuggestions.filter((song) =>
        song.title.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearch(searchTerm);
      console.log('Searching for:', searchTerm);
      setShowSuggestions(false);
    }
  };

  // Handle search icon click
  const handleSearchIconClick = () => {
    if (searchTerm.trim()) {
      saveSearch(searchTerm);
      console.log('Search icon clicked, searching for:', searchTerm);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    saveSearch(suggestion.title);
    setShowSuggestions(false);
    console.log('Selected:', suggestion.title);
  };

  // Show suggestions on input focus
  const handleFocus = async () => {
    setShowSuggestions(true);
    if (!searchTerm.trim()) {
      setSuggestions(getPreviousSearches());
    } else {
      const fetchedSuggestions = await fetchSuggestions(searchTerm);
      const filtered = fetchedSuggestions.filter((song) =>
        song.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} ref={searchRef} className="search-form">
      <div className="search">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
        />
        <span className="search-icon">
          <img
            src="/images/searchicon.svg"
            alt="Search"
            onClick={handleSearchIconClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchIconClick()}
          />
        </span>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list" id="suggestions-list" role="listbox">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id || index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                role="option"
                aria-selected="false"
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export default SearchBar;