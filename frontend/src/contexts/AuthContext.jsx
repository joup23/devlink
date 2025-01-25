import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/axios'; // API 요청 클라이언트

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/auth/check');
        setIsLoggedIn(response.data.authenticated);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);
  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 실패');
    }
  };

  const login = () => setIsLoggedIn(true);
  const logout = () => handleLogout();

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
