
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Amplify } from 'aws-amplify';  // Import Amplify as a named export
import awsconfig from './aws-exports';  // Import Amplify configuration
import App from './App';  // Import the App component

Amplify.configure(awsconfig);

ReactDOM.render(<App />, document.getElementById('root'));

