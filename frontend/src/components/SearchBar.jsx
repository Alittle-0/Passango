import React, { useState, useEffect, useRef } from 'react';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // === BACKEND/API/DATABASE INTEGRATION POINT 1: Fetch Suggestions ===
  // Replace this function with your API call to the database.
  // Example: Fetch from a REST API endpoint connected to your database (e.g., MongoDB, Firebase).
  const fetchSuggestions = async (query = '') => {
    try {
      // Configure your API endpoint here.
      // Example: const response = await fetch('https://your-api.com/songs?query=${encodeURIComponent(query)}');
      const response = await fetch(`/api/songs?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      return data; // Expecting array like [{ id, title, image }, ...]
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

  // Handle form submission (Enter or search icon click)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearch(searchTerm);
      console.log('Searching for:', searchTerm); // Replace with your action (e.g., play song)
      setShowSuggestions(false);
    }
  };

  // Handle search icon click
  const handleSearchIconClick = () => {
    if (searchTerm.trim()) {
      saveSearch(searchTerm);
      console.log('Search icon clicked, searching for:', searchTerm); // Replace with your action
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    saveSearch(suggestion.title);
    setShowSuggestions(false);
    console.log('Selected:', suggestion.title); // Replace with your action
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
    <form onSubmit={handleSubmit} ref={searchRef}>
      <div className="search">
        <span className="search-icon">
          <img
            src="/images/searchicon.svg"
            alt="Search"
            onClick={handleSearchIconClick} // Added click handler
            role="button" // Improve accessibility
            tabIndex={0} // Make clickable via keyboard
            onKeyDown={(e) => e.key === 'Enter' && handleSearchIconClick()} // Keyboard support
          />
        </span>
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