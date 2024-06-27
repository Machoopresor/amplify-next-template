import React, { useState, useEffect } from 'react';
import { FaBars, FaHome } from 'react-icons/fa';
import './css/UploadPage.css';
import { useQuery, gql } from '@apollo/client';
import client from '../src/apollo-client';
import { useNavigate } from 'react-router-dom';

const LIST_SUBJECTS = gql`
  query ListSubjects {
    listSubjects {
      items {
        id
        name
        topics {
          items {
            id
            name
          }
        }
      }
    }
  }
`;

interface Subject {
  id: string;
  name: string;
  topics: { items: { id: string; name: string; }[] };
}

interface UploadPageProps {
  signOut?: (data?: any) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ signOut }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [fileType, setFileType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(LIST_SUBJECTS, { client });

  useEffect(() => {
    if (data) {
      setSubjects(data.listSubjects.items);
    }
  }, [data]);

  useEffect(() => {
    if (selectedSubject && selectedTopic && fileType && ((fileType !== 'Enlace' && file) || (fileType === 'Enlace' && linkUrl))) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedSubject, selectedTopic, fileType, file, linkUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
    setSelectedTopic('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ selectedSubject, selectedTopic, fileType, file, linkUrl });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="upload-page-container">
      <div className="top-bar">
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars size={30} />
        </div>
        <div className="home-icon" onClick={navigateToHome}>
          <FaHome size={30} />
        </div>
      </div>

      {isMenuOpen && (
        <div className="menu-dropdown">
          <ul>
            <li><button onClick={() => alert('Opción 1')}>Opción 1</button></li>
            <li><button onClick={() => alert('Opción 2')}>Opción 2</button></li>
            <li><button onClick={signOut}>Cerrar sesión</button></li>
          </ul>
        </div>
      )}

      <div className="upload-form-container">
        <form onSubmit={handleSubmit}>
          <label>
            Elige la materia:
            <select 
              value={selectedSubject} 
              onChange={handleSubjectChange} 
              required
            >
              <option value="" disabled>Seleccionar materia</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </label>
          <label>
            Elige el tema:
            <select 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value)} 
              required
              disabled={!selectedSubject}
            >
              <option value="" disabled>Seleccionar tema</option>
              {subjects
                .find(subject => subject.id === selectedSubject)?.topics.items.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
            </select>
          </label>
          <fieldset>
            <legend>Escoge el tipo de archivo (obligatorio)</legend>
            <label>
              <input 
                type="radio" 
                value="PDF" 
                checked={fileType === 'PDF'} 
                onChange={(e) => setFileType(e.target.value)} 
                required 
              />
              PDF
            </label>
            <label>
              <input 
                type="radio" 
                value="Imagen" 
                checked={fileType === 'Imagen'} 
                onChange={(e) => setFileType(e.target.value)} 
                required 
              />
              Imagen
            </label>
            <label>
              <input 
                type="radio" 
                value="Codigo QR" 
                checked={fileType === 'Codigo QR'} 
                onChange={(e) => setFileType(e.target.value)} 
                required 
              />
              Codigo QR (Activar cámara)
            </label>
            <label>
              <input 
                type="radio" 
                value="Enlace" 
                checked={fileType === 'Enlace'} 
                onChange={(e) => setFileType(e.target.value)} 
                required 
              />
              Enlace
            </label>
          </fieldset>
          
          {(fileType === 'PDF' || fileType === 'Imagen') && (
            <div>
              <label>
                Subir archivo:
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept={fileType === 'PDF' ? '.pdf' : 'image/*'}
                  required 
                />
              </label>
            </div>
          )}

          {fileType === 'Codigo QR' && (
            <div>
              <label>
                Escanear Código QR (activar cámara):
                <input 
                  type="file" 
                  capture="environment" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required 
                />
              </label>
            </div>
          )}

          {fileType === 'Enlace' && (
            <div>
              <label>
                URL del enlace:
                <input 
                  type="url" 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)} 
                  required 
                />
              </label>
            </div>
          )}

          <button type="submit" className={`submit-button ${isFormValid ? '' : 'disabled'}`} disabled={!isFormValid}>
            Subir archivo
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
