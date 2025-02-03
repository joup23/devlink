import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import apiClient from '../api/axios';

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
        fetchLikeCount();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get(`/profiles/${id}`);
            setProfile(response.data);
            if (isLoggedIn) {
                const likeResponse = await apiClient.get(`/profiles/${id}/isLiked`);
                setIsLiked(likeResponse.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
            setLoading(false);
        }
    };

    const fetchLikeCount = async () => {
        try {
            const response = await apiClient.get(`/profiles/${id}/likes`);
            setLikeCount(response.data);
        } catch (error) {
            console.error('좋아요 개수 로딩 실패:', error);
        }
    };

    const handleLike = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await apiClient.post(`/profiles/${id}/like`);
            setIsLiked(!isLiked);
            setProfile(prev => ({
                ...prev,
                likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1
            }));
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    if (loading) return <div className="text-center py-8">로딩 중...</div>;
    if (!profile) return <div className="text-center py-8">프로필을 찾을 수 없습니다.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* 프로필 이미지 */}
                {profile.imageUrl && (
                    <div className="mb-6 flex justify-center">
                        <img
                            src={profile.imageUrl}
                            alt="프로필 이미지"
                            className="w-32 h-32 object-cover rounded-full"
                        />
                    </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold">{profile.title}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            조회수: {profile.viewCount}
                        </div>
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded ${
                                isLiked 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <span>{isLiked ? '❤️' : '🤍'}</span>
                            <span>{likeCount}</span>
                        </button>
                    </div>
                </div>

                {/* 기존 프로필 내용 */}
                <div className="mb-6">
                    <p className="text-gray-700">{profile.bio}</p>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600">경력 {profile.careerYears}년</p>
                    {profile.githubUrl && (
                        <a 
                            href={profile.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            GitHub
                        </a>
                    )}
                </div>

                {/* 스킬 섹션 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">보유 스킬</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                            <span 
                                key={skill.skillId}
                                className="bg-gray-100 px-3 py-1 rounded"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 프로젝트 섹션 */}
                <div>
                    <h2 className="text-xl font-bold mb-3">프로젝트</h2>
                    <div className="space-y-4">
                        {profile.projects.map((project) => (
                            <div 
                                key={project.projectId}
                                className="border rounded p-4"
                            >
                                <h3 className="font-bold">{project.title}</h3>
                                <p className="text-gray-600">{project.description}</p>
                                {project.link && (
                                    <a 
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        프로젝트 링크
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
