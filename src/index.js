import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Root container not found. Make sure <div id='root'></div> exists in public/index.html");
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
