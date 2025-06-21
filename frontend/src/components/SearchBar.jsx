import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import './searchBar.css';

const SearchBar = () => {
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const navigate = useNavigate();
  const wrapperRef = useRef();

  useEffect(() => {
    if (term.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/search?query=${term}`
        );
        setSuggestions(res.data.slice(0, 5));
        setShowDropdown(true);
      } catch (err) {
        console.error('Suggestion error:', err);
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [term]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[highlightIndex];
      navigate(`/search?q=${selected.title}`);
      setShowDropdown(false);
      setTerm(selected.title);
      setHighlightIndex(-1);
    }
  };

  const handleSuggestionClick = (title) => {
    navigate(`/search?q=${title}`);
    setShowDropdown(false);
    setTerm(title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search?q=${term}`);
      setShowDropdown(false);
      setHighlightIndex(-1);
    }
  };

  const highlightMatch = (text) => {
    const match = term.trim();
    if (!match) return text;
    const regex = new RegExp(`(${match})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for products..."
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setHighlightIndex(-1);
          }}
          onKeyDown={handleKeyDown}
        />
        <FiSearch className="search-icon" onClick={handleSubmit} />
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((item, i) => (
            <li
              key={item._id}
              className={i === highlightIndex ? 'active' : ''}
              onClick={() => handleSuggestionClick(item.title)}
              dangerouslySetInnerHTML={{ __html: highlightMatch(item.title) }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
