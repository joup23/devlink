import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios';

const ProfileListPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const page = parseInt(searchParams.get('page') || '0');
    const size = 9; // 한 페이지당 보여줄 프로필 수

    useEffect(() => {
        fetchSkills();
        fetchProfiles();
    }, [page, selectedSkills]);

    const fetchSkills = async () => {
        try {
            const response = await apiClient.get('/skill');
            setSkills(response.data);
        } catch (error) {
            console.error('스킬 목록 로딩 실패:', error);
        }
    };

    const fetchProfiles = async () => {
        try {
            // 선택된 스킬이 있으면 쿼리 파라미터에 추가
            const skillParams = selectedSkills.length > 0 
                ? `&skills=${selectedSkills.join(',')}`
                : '';
            
            const response = await apiClient.get(
                `/profiles/list?page=${page}&size=${size}${skillParams}`
            );
            setProfiles(isHomePage ? response.data.content.slice(0, 3) : response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('프로필 목록 로딩 실패:', error);
            setError('프로필 목록을 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage.toString() });
    };

    const handleSkillSelect = (skillName) => {
        setSelectedSkills(prev => 
            prev.includes(skillName)
                ? prev.filter(skill => skill !== skillName)
                : [...prev, skillName]
        );
    };

    if (loading) return <div className="text-center py-8">로딩 중...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className={`container mx-auto ${!isHomePage && 'p-4'}`}>
            {!isHomePage && (
                <>
                    <h1 className="text-2xl font-bold mb-6">개발자 프로필 목록</h1>
                    
                    {/* 스킬 필터 */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">스킬 필터</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <button
                                    key={skill.skillId}
                                    onClick={() => handleSkillSelect(skill.name)}
                                    className={`px-3 py-1 rounded ${
                                        selectedSkills.includes(skill.name)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    {skill.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                    <div key={profile.profileId} className="bg-white rounded-lg shadow-md p-6">
                        {/* 프로필 이미지 */}
                        {profile.imageUrl && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={profile.imageUrl}
                                    alt="프로필 이미지"
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">{profile.title}</h2>
                            <p className="text-gray-600 mt-2">{profile.bio}</p>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">경력 {profile.careerYears}년</p>
                            {profile.githubUrl && (
                                <a 
                                    href={profile.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm"
                                >
                                    {profile.githubUrl}
                                </a>
                            )}
                        </div>

                        {/* 스킬 표시 */}
                        {profile.skills && profile.skills.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <span 
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Link 
                            to={`/profile/${profile.profileId}`}
                            className="mt-4 block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            자세히 보기
                        </Link>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 UI */}
            {!isHomePage && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        이전
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-4 py-2 rounded ${
                                page === i ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileListPage; 