import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Toaster                          
        position="top-right"           
        toastOptions={{
          duration: 4000,              
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            borderRadius: '10px',
            padding: '12px 16px',
          },
          success: {
            style: {
              background: '#EDFAF5',
              color: '#0F6E56',
              border: '0.5px solid rgba(29,158,117,0.25)',
            },
            iconTheme: {
              primary: '#1D9E75',
              secondary: '#EDFAF5',
            },
          },
          error: {
            style: {
              background: '#FEF0F0',
              color: '#991B1B',
              border: '0.5px solid rgba(226,75,74,0.2)',
            },
            iconTheme: {
              primary: '#E24B4A',
              secondary: '#FEF0F0',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);