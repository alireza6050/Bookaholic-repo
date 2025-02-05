import React from "react";
import "./Header.css";
import logo from "../../assets/images/logo.png";

const Header = () => {
    return (
      <header className="header">
        <div className="header-content">
          <div className="left-logo">
            <img src={logo} alt="App Logo" className="logo" />
          </div>
          <div className="center-title">
            <h1 className="app-title">Bookaholic</h1>
          </div>
        </div>
      </header>
    );
  };

export default Header;
