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
    const [careers, setCareers] = useState([]);
    const [newCareer, setNewCareer] = useState({
        companyName: '',
        department: '',
        position: '',
        startDate: '',
        endDate: '',
        projects: []
    });
    const [newProject, setNewProject] = useState({
        projectName: '',
        description: '',
        startDate: '',
        endDate: '',
        skills: []
    });
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfiles();
        fetchUserInfo();
        fetchCareers();
        fetchProjects();
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

    const fetchCareers = async () => {
        try {
            const response = await apiClient.get('/careers/my');
            setCareers(response.data);
        } catch (error) {
            console.error('경력 로딩 실패:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await apiClient.get('/projects/my');
            setProjects(response.data);
        } catch (error) {
            console.error('프로젝트 로딩 실패:', error);
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

    const handleAddCareer = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/api/careers', newCareer);
            fetchCareers();
            setNewCareer({
                companyName: '',
                department: '',
                position: '',
                startDate: '',
                endDate: '',
                projects: []
            });
        } catch (error) {
            console.error('경력 추가 실패:', error);
        }
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        setNewCareer(prev => ({
            ...prev,
            projects: [...prev.projects, newProject]
        }));
        setNewProject({
            projectName: '',
            description: '',
            startDate: '',
            endDate: '',
            skills: []
        });
    };

    const handleDeleteCareer = async (careerId) => {
        if (window.confirm('경력을 삭제하시겠습니까?')) {
            try {
                await apiClient.delete(`/careers/${careerId}`);
                alert('경력이 삭제되었습니다.');
                fetchCareers();
            } catch (error) {
                console.error('경력 삭제 실패:', error);
                alert('경력 삭제에 실패했습니다.');
            }
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('프로젝트를 삭제하시겠습니까?')) {
            try {
                await apiClient.delete(`/projects/${projectId}`);
                alert('프로젝트가 삭제되었습니다.');
                fetchProjects();
            } catch (error) {
                console.error('프로젝트 삭제 실패:', error);
                alert('프로젝트 삭제에 실패했습니다.');
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

                {/* 프로필 섹션 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">프로필</h2>
                        <Link
                            to="/profiles/new"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            프로필 추가
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profiles.map((profile) => (
                            <div key={profile.profileId} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        {profile.imageUrl && (
                                            <img
                                                src={profile.imageUrl}
                                                alt="프로필 이미지"
                                                className="w-16 h-16 rounded-full object-cover rounded-lg"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-lg">{profile.title}</h3>
                                            <p className="text-gray-600 text-sm">경력 {profile.careerYears}년</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/profile/${profile.profileId}`)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            보기
                                        </button>
                                        <Link
                                            to={`/profiles/${profile.profileId}/edit`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            수정
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="text-gray-600 text-sm line-clamp-2">{profile.bio}</p>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {profile.skills.slice(0, 5).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                    {profile.skills.length > 5 && (
                                        <span className="text-gray-500 text-xs">
                                            +{profile.skills.length - 5}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-3 text-sm text-gray-500">
                                    <div>조회수: {profile.viewCount}</div>
                                    <div>좋아요: {profile.likeCount}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 경력 관리 섹션 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">경력 관리</h2>
                        <Link 
                            to="/careers/new"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            경력 추가
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {careers.map((career) => (
                            <div key={career.careerId} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{career.companyName}</h3>
                                        <p className="text-gray-600">
                                            {career.department} - {career.position}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(career.startDate).toLocaleDateString()} ~ 
                                            {career.endDate ? new Date(career.endDate).toLocaleDateString() : '현재'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/careers/${career.careerId}/edit`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            수정
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteCareer(career.careerId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">
                                        프로젝트: {career.projects.length}개
                                    </p>
                                </div>
                                {career.projects && career.projects.map((project, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded mt-2">
                                        <h4 className="font-semibold">{project.projectName}</h4>
                                        <p className="text-sm text-gray-600">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.skills && project.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 프로젝트 섹션 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">프로젝트</h2>
                        <Link
                            to="/projects/new"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            프로젝트 추가
                        </Link>
                    </div>
                    <div className="grid gap-4">
                        {projects.map((project) => (
                            <div key={project.projectId} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{project.title}</h3>
                                        <p className="text-gray-600">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.skills && project.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/projects/${project.projectId}/edit`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            수정
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteProject(project.projectId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage; 