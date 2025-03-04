import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProfileListPage from './ProfileListPage';
import Footer from '../components/Footer';

const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow">
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
              {isLoggedIn ? (
                <div className="rounded-md shadow">
                  <Link to="/mypage" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    프로필 관리하기
                  </Link>
                </div>
              ) : (
                <div className="rounded-md shadow">
                  <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    시작하기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 프로필 목록 섹션 */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">최근 등록된 프로필</h2>
            <Link 
              to="/profiles" 
              className="text-blue-500 hover:text-blue-600"
            >
              전체 보기 →
            </Link>
          </div>
          <ProfileListPage showFooter={false} />
        </div>
      </div>
      
      {/* 홈페이지 푸터 */}
      <Footer />
    </div>
  );
};

export default HomePage; 