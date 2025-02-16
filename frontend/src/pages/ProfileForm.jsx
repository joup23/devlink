import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import SkillAutocomplete from '../components/SkillAutocomplete';

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
        projects: [],
        imageUrl: ''
    });

    const [newSkill, setNewSkill] = useState('');
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        link: '',
        skills: []
    });

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchProfile();
        }
    }, [profileId]);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get(`/profiles/${profileId}`);
            setProfile(response.data);
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 이미지 업로드를 위한 FormData 생성
            const formData = new FormData();
            if (imageFile) {
                formData.append('image', imageFile);
            }
            formData.append('title', profile.title);
            formData.append('bio', profile.bio);
            formData.append('careerYears', profile.careerYears);
            formData.append('githubUrl', profile.githubUrl);
            formData.append('skills', JSON.stringify(selectedSkills));
            formData.append('projects', JSON.stringify(profile.projects));

            if (isEdit) {
                await apiClient.put(`/profiles/${profileId}`, formData);
                alert('프로필이 수정되었습니다.');
            } else {
                await apiClient.post('/profiles', formData);
                alert('프로필이 등록되었습니다.');
            }
            navigate('/mypage');
        } catch (error) {
            console.error('프로필 저장 실패:', error);
            alert('프로필 저장에 실패했습니다.');
        }
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        setProfile(prev => ({
            ...prev,
            skills: [...prev.skills, { name: newSkill }]
        }));
        setNewSkill('');
    };

    const handleAddSkillToServer = async () => {
        try {
            await apiClient.post(`/skill/${profileId}`, {
                name: newSkill
            });
            setNewSkill('');
            fetchProfile();
        } catch (error) {
            console.error('스킬 추가 실패:', error);
        }
    };

    const handleRemoveSkill = (skillName) => {
        if (isEdit) {
            handleRemoveSkillFromServer(skillName);
        } else {
            setProfile(prev => ({
                ...prev,
                skills: prev.skills.filter(skill => skill.name !== skillName)
            }));
        }
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        setProfile(prev => ({
            ...prev,
            projects: [...prev.projects, { ...newProject }]
        }));
        setNewProject({ title: '', description: '', link: '', skills: [] });
    };

    const handleDeleteProject = (projectId) => {
        setProfile(prev => ({
            ...prev,
            projects: prev.projects.filter(project => project.id !== projectId)
        }));

    };

    const handleSkillSelect = (skill) => {
        setSelectedSkills(prev => 
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    useEffect(() => {
        if (isEdit && profile.skills) {
            setSelectedSkills(profile.skills.map(skill => skill.name));
        }
    }, [profile.skills, isEdit]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                {isEdit ? '프로필 수정' : '프로필 등록'}
            </h1>
            
            {/* 이미지 업로드 섹션 */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    프로필 이미지
                </label>
                <div className="flex items-center space-x-4">
                    {(imagePreview || profile.imageUrl) && (
                        <img
                            src={imagePreview || profile.imageUrl}
                            alt="프로필 이미지"
                            className="w-32 h-32 object-cover rounded-full"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border p-2 rounded"
                    />
                </div>
            </div>

            {/* 프로필 기본 정보 입력 필드들 */}
            <div className="mb-8">
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
            </div>

            {/* 스킬 섹션  */}
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        스킬
                    </label>
                    <SkillAutocomplete
                        onSkillSelect={handleSkillSelect}
                        selectedSkills={selectedSkills}
                    />
                </div>
            </div>

            {/* 프로젝트 섹션  */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">프로젝트</h2>
                <div className="grid gap-4 mb-4">
                    {profile.projects.map((project) => (
                        <div key={project.id} className="border p-4 rounded">
                            <h3 className="font-bold">{project.title}</h3>
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
                                <a href={project.link} className="text-blue-500 hover:underline block mb-2">
                                    프로젝트 링크
                                </a>
                            )}
                            <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-500 hover:text-red-700"
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
                            type="text"
                            value={newProject.link}
                            onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                            className="border p-2 w-full rounded"
                            
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">프로젝트 스킬</label>
                        <SkillAutocomplete
                            onSkillSelect={(skill) => {
                                setNewProject(prev => ({
                                    ...prev,
                                    skills: prev.skills.includes(skill)
                                        ? prev.skills.filter(s => s !== skill)
                                        : [...prev.skills, skill]
                                }));
                            }}
                            selectedSkills={newProject.skills}
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

            {/* 최종 제출 버튼 */}
            <form onSubmit={handleSubmit} className="mt-8">
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    {isEdit ? '수정 완료' : '프로필 등록'}
                </button>
            </form>
        </div>
    );
};

export default ProfileForm; 