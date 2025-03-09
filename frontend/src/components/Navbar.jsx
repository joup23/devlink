import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">DevLink</Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className="text-gray-600 hover:text-gray-900">마이페이지</Link>
                <button 
                  onClick={logout}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">로그인</Link>
                {/* <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  회원가입
                </Link> */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 