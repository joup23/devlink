import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProfileForm from './pages/ProfileForm';
import MyPage from './pages/MyPage';
import SignupPage from './pages/SignupPage';
import ProfileListPage from './pages/ProfileListPage';
import CareerForm from './pages/CareerForm';
import ProjectForm from './pages/ProjectForm';
import Footer from './components/Footer';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/:id" element={<ProfilePage />} />
          <Route path="/profiles/new" element={<ProfileForm />} />
          <Route path="/profiles/:profileId/edit" element={<ProfileForm />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profiles" element={<ProfileListPage />} />
          <Route path="/careers/new" element={<CareerForm />} />
          <Route path="/careers/:careerId/edit" element={<CareerForm />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:projectId/edit" element={<ProjectForm />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;