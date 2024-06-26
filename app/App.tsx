import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyComponent from './page'; // Asegúrate de que esta es la ruta correcta
import SearchPage from './SearchPage';
import AddPage from './AddPage';
import UploadPage from './UploadPage';
import FavoritesPage from './FavoritesPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyComponent />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
