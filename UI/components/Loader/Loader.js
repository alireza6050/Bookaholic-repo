import React from "react";
import "./Loader.css";

const Loader = ({ isLoading, message = "Processing..." }) => {
  if (!isLoading) return null; // Don't render if not loading

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loader;
