import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const MyPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        birthDate: '',
        location: '',
        phone: '',
        education: ''
    });

    useEffect(() => {
        fetchProfiles();
        fetchUserInfo();
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await apiClient.get('/profiles');
            setProfiles(response.data);
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await apiClient.get('/users/me');
            setUserInfo(response.data);
            setEditForm({
                name: response.data.name,
                birthDate: response.data.birthDate,
                location: response.data.location,
                phone: response.data.phone,
                education: response.data.education
            });
        } catch (error) {
            console.error('사용자 정보 로딩 실패:', error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put('/users/me', editForm);
            setUserInfo(prev => ({ ...prev, ...editForm }));
            setIsEditing(false);
            alert('정보가 수정되었습니다.');
        } catch (error) {
            console.error('정보 수정 실패:', error);
            alert('정보 수정에 실패했습니다.');
        }
    };

    const handleDeleteProfile = async (profileId) => {
        if (window.confirm('프로필을 삭제하시겠습니까?')) {
            try {
                await apiClient.delete(`/profiles/${profileId}`);
                alert('프로필이 삭제되었습니다.');
                fetchProfiles();
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
                
                {/* 사용자 정보 섹션 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">기본 정보</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                수정
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">이름</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">생년월일</label>
                                <input
                                    type="date"
                                    value={editForm.birthDate}
                                    onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">위치</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">연락처</label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">학력</label>
                                <input
                                    type="text"
                                    value={editForm.education}
                                    onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    저장
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <p><span className="font-semibold">이메일:</span> {userInfo?.email}</p>
                            <p><span className="font-semibold">이름:</span> {userInfo?.name}</p>
                            <p><span className="font-semibold">생년월일:</span> {userInfo?.birthDate}</p>
                            <p><span className="font-semibold">위치:</span> {userInfo?.location}</p>
                            <p><span className="font-semibold">연락처:</span> {userInfo?.phone}</p>
                            <p><span className="font-semibold">학력:</span> {userInfo?.education}</p>
                        </div>
                    )}
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
                                    <h3 className="font-semibold mb-2">프로젝트</h3>
                                    <div className="space-y-2">
                                        {profile.projects.map((project) => (
                                            <div key={project.projectId} className="border p-4 rounded">
                                                <h4 className="font-bold">{project.title}</h4>
                                                <p className="text-gray-600 mb-2">{project.description}</p>
                                                {/* 프로젝트 스킬 표시 */}
                                                {project.skills && project.skills.length > 0 && (
                                                    <div className="mb-2">
                                                        <p className="text-sm font-medium mb-1">사용 기술:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.skills.map((skill, index) => (
                                                                <span 
                                                                    key={index}
                                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {project.link && (
                                                    <a href={project.link} className="text-blue-500 hover:underline" target="_blank">
                                                        프로젝트 링크
                                                    </a>
                                                )}
                                            </div>
                                        ))}
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