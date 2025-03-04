import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import apiClient from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import CareerCard from '../components/CareerCard';
import { formatFullDate } from '../utils/dateUtils';

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
                //await apiClient.post(`/profiles/${id}/view`);
                
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

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    if (!profile) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold text-gray-700">프로필을 찾을 수 없습니다</h2>
            <button 
                onClick={() => navigate(-1)} 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
                돌아가기
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                {/* 프로필 헤더 섹션 */}
                <div className="bg-gray-100">
                    {/* 상단 배너 */}
                    <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    
                    <div className="container mx-auto px-4 -mt-24">
                        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
                            <div className="flex flex-col md:flex-row items-start">
                                {/* 프로필 이미지 */}
                                <div className="md:mr-8 mb-4 md:mb-0">
                                    <img
                                        src={profile.imageUrl || '/default-profile.png'}
                                        alt="프로필 이미지"
                                        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                                    />
                                </div>
                                
                                {/* 기본 정보 */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-extrabold text-gray-800">{profile.title || '제목 없음'}</h1>
                                            <p className="text-gray-600 mt-1 font-medium">{profile.name} · 경력 {profile.careerYears}년</p>
                                        </div>
                                        
                                        {/* 좋아요 버튼 */}
                                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                                            <button
                                                onClick={handleLike}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors font-semibold ${
                                                    isLiked 
                                                        ? 'bg-pink-500 text-white hover:bg-pink-600' 
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isLiked ? "0" : "1.5"}>
                                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                </svg>
                                                <span>{likeCount}</span>
                                            </button>
                                            <div className="text-gray-500 flex items-center gap-1 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                <span>{profile.viewCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* 스킬 태그 */}
                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 메인 콘텐츠 섹션 */}
                <div className="container mx-auto px-4 py-8 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* 왼쪽 사이드바 - 개인 정보 */}
                        <div className="lg:col-span-4">
                            {/* 개인 정보 */}
                            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">개인 정보</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium">이름</p>
                                            <p className="font-semibold">{profile?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium">이메일</p>
                                            <p className="font-semibold">{profile?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium">생년월일</p>
                                            <p className="font-semibold">{profile?.birthDate ? formatFullDate(profile.birthDate) : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium">지역</p>
                                            <p className="font-semibold">{profile?.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium">연락처</p>
                                            <p className="font-semibold">{profile?.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                                        </svg>
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium">학력</p>
                                            <p className="font-semibold">{profile?.education}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 자기소개 */}
                            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">자기소개</h2>
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed font-medium">{profile.bio}</p>
                            </div>
                            
                            {/* GitHub */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">GitHub</h2>
                                <a 
                                    href={profile.githubUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
                                >
                                    <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    {profile.githubUrl.replace('https://github.com/', '')}
                                </a>
                            </div>
                        </div>
                        
                        {/* 오른쪽 메인 컨텐츠 */}
                        <div className="lg:col-span-8">
                            {/* 경력 섹션 */}
                            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        경력
                                    </span>
                                </h2>
                                <div className="space-y-6">
                                    {careers.length > 0 ? (
                                        careers.map((career) => (
                                            <CareerCard key={career.careerId} career={career} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic font-medium">등록된 경력이 없습니다.</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* 프로젝트 섹션 */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                        </svg>
                                        프로젝트
                                    </span>
                                </h2>
                                <div className="space-y-6">
                                    {projects.length > 0 ? (
                                        projects.map((project) => (
                                            <ProjectCard key={project.projectId} project={project} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic font-medium">등록된 프로젝트가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
