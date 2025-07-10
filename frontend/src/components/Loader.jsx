import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text">UrbanTrove is loading...</p>
      </div>
    </div>
  );
};

export default Loader;
