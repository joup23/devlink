import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    
    useEffect(() => {
        fetchProfile();
        fetchUserInfo();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/api/profiles/my');
            if (response.data.result === 'SUCCESS') {
                setProfile(response.data.data);
            }
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await apiClient.get('/api/users/me');
            if (response.data) {
                setUserInfo(response.data);
            }
        } catch (error) {
            console.error('사용자 정보 로딩 실패:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* 프로필 상단 섹션 */}
                <div className="flex gap-8 mb-8">
                    {/* 프로필 이미지 */}
                    <div className="w-48 h-48">
                        <img
                            src={profile?.imageUrl || '/default-profile.png'}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>

                    {/* 기본 정보 */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-4">{profile?.title || '제목 없음'}</h1>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">이름</p>
                                <p className="font-medium">{userInfo?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">이메일</p>
                                <p className="font-medium">{userInfo?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">생년월일</p>
                                <p className="font-medium">{userInfo?.birthDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">지역</p>
                                <p className="font-medium">{userInfo?.location}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">연락처</p>
                                <p className="font-medium">{userInfo?.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">학력</p>
                                <p className="font-medium">{userInfo?.education}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 기존 프로필 내용 */}
                // ... 기존 코드 유지 ...
            </div>
        </div>
    );
};

export default Profile; 