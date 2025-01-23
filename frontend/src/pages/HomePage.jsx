import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiClient from '../api/axios';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 서버에 인증 상태 확인 요청
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      {/* 히어로 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">개발자를 위한</span>
            <span className="block text-blue-600">소셜 네트워크</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            DevLink에서 다른 개발자들과 연결하고, 지식을 공유하고, 함께 성장하세요.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 특징 섹션 */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">프로필 공유</h3>
              <p className="mt-2 text-gray-500">
                자신의 기술 스택과 프로젝트 경험을 공유하세요.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">네트워킹</h3>
              <p className="mt-2 text-gray-500">
                같은 관심사를 가진 개발자들과 연결하세요.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">지식 공유</h3>
              <p className="mt-2 text-gray-500">
                경험과 지식을 공유하고 함께 성장하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 