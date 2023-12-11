import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider
    clientId={process.env.REACT_APP_PUBLIC_GOOGLE_OAUTH_API_TOKEN}
  >
    <Router>
    <App />
  </Router>
  </GoogleOAuthProvider>
);