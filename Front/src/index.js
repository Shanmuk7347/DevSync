import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="106475305662-1b9kl8quqrtafk5g10tffa1jmqfli1do.apps.googleusercontent.com">
  <React.StrictMode>
    <BrowserRouter><App /></BrowserRouter>
    
  </React.StrictMode>
  </GoogleOAuthProvider>
);

reportWebVitals();
