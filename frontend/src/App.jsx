import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProfileForm from './pages/ProfileForm';
import MyPage from './pages/MyPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profiles/new" element={<ProfileForm />} />
          <Route path="/profiles/:profileId/edit" element={<ProfileForm />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;