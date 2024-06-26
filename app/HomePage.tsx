import React, { useState } from 'react';
import { FaBars, FaSearch, FaPlus, FaUpload, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

interface HomePageProps {
  signOut?: (data?: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ signOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-container">
      <div className="menu-container">
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars size={30} />
        </div>
        {isMenuOpen && (
          <div className="menu-dropdown">
            <ul>
              <li><button onClick={() => alert('Opción 1')}>Opción 1</button></li>
              <li><button onClick={() => alert('Opción 2')}>Opción 2</button></li>
              <li><button onClick={() => signOut && signOut()}>Cerrar sesión</button></li>
            </ul>
          </div>
        )}
      </div>
      <div className="logo-container">
        {/* Puedes agregar el logo aquí si es necesario */}
      </div>
      <div className="icon-container">
        <button className="icon-button" onClick={() => navigate('/search')}>
          <FaSearch size={60} />
          <p>Búsqueda general</p>
        </button>
        <button className="icon-button" onClick={() => navigate('/add')}>
          <FaPlus size={60} />
          <p>Agregar materia o tema</p>
        </button>
        <button className="icon-button" onClick={() => navigate('/upload')}>
          <FaUpload size={60} />
          <p>Subir tema</p>
        </button>
        <button className="icon-button" onClick={() => navigate('/favorites')}>
          <FaStar size={60} />
          <p>Favoritos</p>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
