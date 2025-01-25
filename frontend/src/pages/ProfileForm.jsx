import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileForm = () => {
    const { profileId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!profileId;

    const [profile, setProfile] = useState({
        title: '',
        bio: '',
        careerYears: 0,
        githubUrl: '',
        skills: [],
        projects: []
    });

    const [newSkill, setNewSkill] = useState('');
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        link: ''
    });

    useEffect(() => {
        if (isEdit) {
            fetchProfile();
        }
    }, [profileId]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`/api/profiles/${profileId}`);
            setProfile(response.data);
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`/api/profiles/${profileId}`, {
                    title: profile.title,
                    bio: profile.bio,
                    careerYears: profile.careerYears,
                    githubUrl: profile.githubUrl
                });
                alert('프로필이 수정되었습니다.');
            } else {
                await axios.post('/api/profiles', {
                    title: profile.title,
                    bio: profile.bio,
                    careerYears: profile.careerYears,
                    githubUrl: profile.githubUrl
                });
                alert('프로필이 등록되었습니다.');
            }
            navigate('/mypage');
        } catch (error) {
            console.error('프로필 저장 실패:', error);
            alert('프로필 저장에 실패했습니다.');
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        try {
            await axios.post(`/api/skill/${profileId}`, {
                name: newSkill
            });
            setNewSkill('');
            fetchProfile();
        } catch (error) {
            console.error('스킬 추가 실패:', error);
        }
    };

    const handleRemoveSkill = async (skillName) => {
        try {
            await axios.delete(`/api/skill/${profileId}/${skillName}`);
            fetchProfile();
        } catch (error) {
            console.error('스킬 삭제 실패:', error);
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/project/${profileId}`, newProject);
            setNewProject({ title: '', description: '', link: '' });
            fetchProfile();
        } catch (error) {
            console.error('프로젝트 추가 실패:', error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await axios.delete(`/api/project/${projectId}`);
            fetchProfile();
        } catch (error) {
            console.error('프로젝트 삭제 실패:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                {isEdit ? '프로필 수정' : '프로필 등록'}
            </h1>
            
            {/* 프로필 기본 정보 폼 */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <label className="block mb-2">제목</label>
                    <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">소개</label>
                    <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="border p-2 w-full rounded"
                        rows="4"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">경력 연차</label>
                    <input
                        type="number"
                        value={profile.careerYears}
                        onChange={(e) => setProfile({...profile, careerYears: parseInt(e.target.value)})}
                        className="border p-2 rounded"
                        min="0"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">GitHub URL</label>
                    <input
                        type="url"
                        value={profile.githubUrl}
                        onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {isEdit ? '수정하기' : '등록하기'}
                </button>
            </form>

            {/* 스킬 섹션 (수정 모드에서만 표시) */}
            {isEdit && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">스킬</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {profile.skills.map((skill) => (
                            <div key={skill.id} className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2">
                                <span>{skill.name}</span>
                                <button
                                    onClick={() => handleRemoveSkill(skill.name)}
                                    className="text-red-500 hover:text-red-700"
                                    type="button"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddSkill} className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="border p-2 rounded flex-grow"
                            placeholder="새로운 스킬"
                        />
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            추가
                        </button>
                    </form>
                </div>
            )}

            {/* 프로젝트 섹션 (수정 모드에서만 표시) */}
            {isEdit && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">프로젝트</h2>
                    <div className="grid gap-4 mb-4">
                        {profile.projects.map((project) => (
                            <div key={project.id} className="border p-4 rounded">
                                <h3 className="font-bold">{project.title}</h3>
                                <p className="text-gray-600">{project.description}</p>
                                <a href={project.link} className="text-blue-500 hover:underline" target="_blank">
                                    프로젝트 링크
                                </a>
                                <button
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="mt-2 text-red-500 hover:text-red-700"
                                    type="button"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddProject} className="border p-4 rounded">
                        <div className="mb-4">
                            <label className="block mb-2">프로젝트 제목</label>
                            <input
                                type="text"
                                value={newProject.title}
                                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                className="border p-2 w-full rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">설명</label>
                            <textarea
                                value={newProject.description}
                                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                className="border p-2 w-full rounded"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">프로젝트 링크</label>
                            <input
                                type="url"
                                value={newProject.link}
                                onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                                className="border p-2 w-full rounded"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            프로젝트 추가
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfileForm; 