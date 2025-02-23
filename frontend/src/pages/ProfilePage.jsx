import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import apiClient from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import CareerCard from '../components/CareerCard';

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [careers, setCareers] = useState([]);
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
                setProjects(profileRes.data.projects || []);
                setCareers(profileRes.data.careers || []);
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
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-6">
                {/* 프로필 상단 섹션 */}
                <div className="flex gap-8 mb-8">
                    {/* 프로필 이미지 */}
                    <div className="w-48 h-48">
                        <img
                            src={profile.imageUrl || '/default-profile.png'}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>

                    {/* 기본 정보 */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-4">{profile.title || '제목 없음'}</h1>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">이름</p>
                                <p className="font-medium">{profile?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">이메일</p>
                                <p className="font-medium">{profile?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">생년월일</p>
                                <p className="font-medium">{profile?.birthDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">지역</p>
                                <p className="font-medium">{profile?.location}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">연락처</p>
                                <p className="font-medium">{profile?.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">학력</p>
                                <p className="font-medium">{profile?.education}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 자기소개 */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">자기소개</h2>
                    <p className="text-gray-700">{profile.bio}</p>
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

                {/* 경력 섹션 */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">경력</h2>
                    <div className="space-y-4">
                        {careers.map((career) => (
                            <CareerCard key={career.careerId} career={career} />
                        ))}
                    </div>
                </div>

                {/* 프로젝트 섹션 */}
                <div>
                    <h2 className="text-xl font-bold mb-4">프로젝트</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                            <ProjectCard key={project.projectId} project={project} />
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
