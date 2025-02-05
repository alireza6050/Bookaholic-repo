import React from 'react';
import './SearchBar.css';
import SpeechToText from '../SpeechToText/SpeechToText';

const SearchBar = ({ onSendMessage, searchQuery, setSearchQuery }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSendMessage(searchQuery);
      setSearchQuery('');
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="search-input"
        />
        <div className="button-group">
          <SpeechToText onTranscribe={setSearchQuery} />
          <button type="submit" className="send-button">Send</button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
