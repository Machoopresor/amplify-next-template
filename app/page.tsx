"use client";

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsconfig from '../exports';
import { Authenticator, ThemeProvider, defaultTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import AddPage from './AddPage';
import UploadPage from './UploadPage';
import FavoritesPage from './FavoritesPage';
import './app.css';
import './HomePage.css';

Amplify.configure(awsconfig);

const formFields = {
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

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const Page: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <ThemeProvider theme={{ ...defaultTheme, ...theme }}>
      <Router>
        <Authenticator formFields={formFields}>
          {({ signOut, user }) => {
            if (user && !isAuthenticated) {
              setIsAuthenticated(true);
              return <Navigate to="/" />;
            }
            if (!user && isAuthenticated) {
              setIsAuthenticated(false);
            }
            return (
              <Routes>
                <Route path="/" element={<HomePage signOut={signOut} />} />
                <Route path="/search" element={<PrivateRoute isAuthenticated={!!user}><SearchPage /></PrivateRoute>} />
                <Route path="/add" element={<PrivateRoute isAuthenticated={!!user}><AddPage /></PrivateRoute>} />
                <Route path="/upload" element={<PrivateRoute isAuthenticated={!!user}><UploadPage signOut={signOut} /></PrivateRoute>} />
                <Route path="/favorites" element={<PrivateRoute isAuthenticated={!!user}><FavoritesPage /></PrivateRoute>} />
              </Routes>
            );
          }}
        </Authenticator>
      </Router>
    </ThemeProvider>
  );
};

export default Page;
