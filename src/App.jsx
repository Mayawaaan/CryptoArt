import React from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Router from './app/router';

import { ThemeProvider } from './context/ThemeContext';
import { LenisProvider } from './context/LenisContext';

// Pages

const App = () => {
  return (
    <LenisProvider>
      <ThemeProvider>
        <Navbar />
          <Router/>
        <Footer />
      </ThemeProvider>
    </LenisProvider>
  );
};

export default App;