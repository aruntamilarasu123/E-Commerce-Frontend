import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './context/ContextProvider.jsx';
import { LoginProvider } from './context/LoginContext.jsx';
import { WishlistContext, WishlistProvider } from './context/WishlistContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ContextProvider>
      <WishlistProvider>
      <LoginProvider>
        <App />
      </LoginProvider>
      </WishlistProvider>
    </ContextProvider>
  </BrowserRouter>
);
