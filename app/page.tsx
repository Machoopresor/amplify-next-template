"use client";

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsconfig from '../exports';
import { Authenticator, AuthenticatorProps, ThemeProvider, defaultTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import AddPage from './AddPage';
import UploadPage from './UploadPage';
import FavoritesPage from './FavoritesPage';
import './app.css';
import './HomePage.css';

Amplify.configure(awsconfig);

const formFields: AuthenticatorProps['formFields'] = {
  signUp: {
    email: {
      placeholder: 'Enter your email',
      isRequired: true,
    },
    username: {
      placeholder: 'Enter your username',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your password',
      isRequired: true,
    },
    confirm_password: {
      placeholder: 'Please confirm your password',
      isRequired: true,
    },
  },
};

const theme = {
  name: 'custom-theme',
  tokens: {
    components: {
      authenticator: {
        container: {},
      },
    },
  },
};

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <ThemeProvider theme={{ ...defaultTheme, ...theme }}>
      <Router>
        <Routes>
          <Route path="/" element={
            <Authenticator formFields={formFields}>
              {({ signOut, user }) => {
                if (user) {
                  setIsAuthenticated(true);
                } else {
                  setIsAuthenticated(false);
                }
                return !isAuthenticated ? (
                  <div className="auth-container">
                    <div className="auth-form">
                      {/* Aquí puedes agregar más contenido si es necesario */}
                    </div>
                  </div>
                ) : (
                  <HomePage signOut={signOut} />
                );
              }}
            </Authenticator>
          } />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default Page;
