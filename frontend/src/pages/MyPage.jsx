import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const MyPage = () => {
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        fetchMyProfiles();
    }, []);

    const fetchMyProfiles = async () => {
        try {
            const response = await apiClient.get('/profiles');
            setProfiles(response.data);
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
        }
    };

    const handleDeleteProfile = async (profileId) => {
        if (window.confirm('프로필을 삭제하시겠습니까?')) {
            try {
                await apiClient.delete(`/profiles/${profileId}`);
                alert('프로필이 삭제되었습니다.');
                fetchMyProfiles();
            } catch (error) {
                console.error('프로필 삭제 실패:', error);
                alert('프로필 삭제에 실패했습니다.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">내 프로필</h1>
                    <Link 
                        to="/profiles/new"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        새 프로필 만들기
                    </Link>
                </div>
                
                {profiles.length > 0 ? (
                    <div className="grid gap-6">
                        {profiles.map((profile) => (
                            <div key={profile.profileId} className="bg-white shadow rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    {profile.imageUrl && (
                                        <div className="mb-4 flex justify-center">
                                            <img
                                                src={profile.imageUrl}
                                                alt="프로필 이미지"
                                                className="w-24 h-24 object-cover rounded-full"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-bold">{profile.title}</h2>
                                        <p className="text-gray-600 mt-2">{profile.bio}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link 
                                            to={`/profiles/${profile.profileId}/edit`}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            수정
                                        </Link>
                                        <button 
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            onClick={() => handleDeleteProfile(profile.profileId)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="mb-2">경력: {profile.careerYears}년</p>
                                    <a 
                                        href={profile.githubUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-500 hover:underline"
                                    >
                                        GitHub
                                    </a>
                                </div>

                                {/* 스킬 섹션 */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold mb-2">보유 스킬</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.length > 0 ? (
                                            profile.skills.map((skill, index) => (
                                                <span 
                                                    key={index} 
                                                    className="bg-gray-100 px-3 py-1 rounded"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">등록된 스킬이 없습니다.</p>
                                        )}
                                    </div>
                                </div>

                                {/* 프로젝트 섹션 */}
                                <div>
                                    <h3 className="text-lg font-bold mb-2">프로젝트</h3>
                                    <div className="grid gap-4">
                                        {profile.projects.length > 0 ? (
                                            profile.projects.map((project) => (
                                                <div 
                                                    key={project.projectId} 
                                                    className="border p-4 rounded"
                                                >
                                                    <h4 className="font-bold">{project.title}</h4>
                                                    <p className="text-gray-600">{project.description}</p>
                                                    <a 
                                                        href={project.link} 
                                                        className="text-blue-500 hover:underline" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                    >
                                                        프로젝트 링크
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">등록된 프로젝트가 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="mb-4">아직 프로필이 없습니다.</p>
                        <Link 
                            to="/profiles/new"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            프로필 생성하기
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage; 