import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import "./App.css";
import { withAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css"; 



function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content">
          <ChatWindow />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Cognito wrapper
export default withAuthenticator(App, { hideSignUp: false });