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
        const fetchProfile = async () => {
            try {
                // 프로필과 좋아요 상태를 동시에 가져오기
                const [profileRes, likeCountRes, isLikedRes] = await Promise.all([
                    apiClient.get(`/profiles/${id}`),
                    apiClient.get(`/profiles/${id}/likes`),
                    isLoggedIn ? apiClient.get(`/profiles/${id}/isLiked`) : Promise.resolve({ data: false })
                ]);
                
                // 조회수 증가 API 비동기 호출
                await apiClient.post(`/profiles/${id}/view`);
                
                setProfile(profileRes.data);
                setLikeCount(likeCountRes.data);
                setIsLiked(isLikedRes.data);
                setLoading(false);
            } catch (error) {
                console.error('프로필 로딩 실패:', error);
                setLoading(false);
            }
        };
        
        fetchProfile();
    }, [id, isLoggedIn]);

    const handleLike = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await apiClient.post(`/profiles/${id}/like`);
            // 좋아요 상태와 카운트 즉시 업데이트
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!profile) return <div>프로필을 찾을 수 없습니다.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* 프로필 헤더 */}
                <div className="flex items-center space-x-4 mb-6">
                    {profile.imageUrl && (
                        <img
                            src={profile.imageUrl}
                            alt="프로필 이미지"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{profile.title}</h1>
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
                </div>

                {/* 소개 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">소개</h2>
                    <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                </div>

                {/* 스킬 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">스킬</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 프로젝트 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">프로젝트</h2>
                    <div className="space-y-4">
                        {profile.projects.map((project) => (
                            <div key={project.projectId} className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold">{project.title}</h3>
                                <p className="text-gray-600 mt-1">{project.description}</p>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                                    >
                                        프로젝트 링크
                                    </a>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 경력 */}
                <div>
                    <h2 className="text-xl font-bold mb-2">경력</h2>
                    <div className="space-y-4">
                        {profile.careers.map((career) => (
                            <div key={career.careerId} className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold">{career.companyName}</h3>
                                <p className="text-gray-600">
                                    {career.department} - {career.position}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(career.startDate).toLocaleDateString()} ~ 
                                    {career.endDate ? new Date(career.endDate).toLocaleDateString() : '현재'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 좋아요 버튼 */}
                <div className="mt-6 flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${
                            isLiked 
                                ? 'bg-red-500 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        <span>{isLiked ? '좋아요 취소' : '좋아요'}</span>
                        <span>{likeCount}</span>
                    </button>
                    <div className="text-gray-500">조회수: {profile.viewCount}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
