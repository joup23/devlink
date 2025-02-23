import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axios';
import SkillAutocomplete from '../components/SkillAutocomplete';

const CareerForm = () => {
    const { careerId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!careerId;

    const [career, setCareer] = useState({
        companyName: '',
        department: '',
        position: '',
        startDate: '',
        endDate: '',
        projects: [{
            projectName: '',
            description: '',
            skills: []
        }]
    });

    useEffect(() => {
        if (isEdit) {
            fetchCareer();
        }
    }, [careerId]);

    const fetchCareer = async () => {
        try {
            const response = await apiClient.get(`/careers/my/${careerId}`);
            setCareer(response.data);
        } catch (error) {
            console.error('경력 로딩 실패:', error);
        }
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...career.projects];
        updatedProjects[index] = {
            ...updatedProjects[index],
            [field]: value
        };
        setCareer({ ...career, projects: updatedProjects });
    };

    const handleSkillSelect = (index, skill) => {
        const updatedProjects = [...career.projects];
        const currentSkills = updatedProjects[index].skills || [];
        
        updatedProjects[index] = {
            ...updatedProjects[index],
            skills: currentSkills.includes(skill)
                ? currentSkills.filter(s => s !== skill)
                : [...currentSkills, skill]
        };
        
        setCareer({ ...career, projects: updatedProjects });
    };

    const addProject = () => {
        setCareer({
            ...career,
            projects: [
                ...career.projects,
                { projectName: '', description: '', skills: [] }
            ]
        });
    };

    const removeProject = (index) => {
        const updatedProjects = career.projects.filter((_, i) => i !== index);
        setCareer({ ...career, projects: updatedProjects });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const careerData = {
                ...career,
                projects: career.projects.map(project => ({
                    ...project,
                    skills: project.skills.map(skill => ({
                        skillId: skill.skillId,
                        name: skill.name
                    }))
                }))
            };

            const response = await apiClient({
                method: isEdit ? 'put' : 'post',
                url: isEdit ? `/careers/${careerId}` : '/careers',
                data: careerData
            });

            alert(isEdit ? '경력이 수정되었습니다.' : '경력이 등록되었습니다.');
            navigate('/mypage');
        } catch (error) {
            console.error('경력 저장 실패:', error);
            alert('경력 저장에 실패했습니다.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? '경력 수정' : '경력 등록'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">회사명</label>
                    <input
                        type="text"
                        value={career.companyName}
                        onChange={(e) => setCareer({...career, companyName: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">부서</label>
                    <input
                        type="text"
                        value={career.department}
                        onChange={(e) => setCareer({...career, department: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">직책</label>
                    <input
                        type="text"
                        value={career.position}
                        onChange={(e) => setCareer({...career, position: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">시작일</label>
                        <input
                            type="date"
                            value={career.startDate}
                            onChange={(e) => setCareer({...career, startDate: e.target.value})}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">종료일</label>
                        <input
                            type="date"
                            value={career.endDate || ''}
                            onChange={(e) => setCareer({...career, endDate: e.target.value})}
                            className="w-full border rounded p-2"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">프로젝트</h2>
                        <button
                            type="button"
                            onClick={addProject}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            프로젝트 추가
                        </button>
                    </div>

                    {career.projects.map((project, index) => (
                        <div key={index} className="border p-4 rounded space-y-4">
                            <div className="flex justify-between">
                                <h3 className="font-semibold">프로젝트 {index + 1}</h3>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeProject(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">프로젝트명</label>
                                <input
                                    type="text"
                                    value={project.projectName}
                                    onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">설명</label>
                                <textarea
                                    value={project.description}
                                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                    className="w-full border rounded p-2"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">스킬</label>
                                <SkillAutocomplete
                                    onSkillSelect={(skill) => handleSkillSelect(index, skill)}
                                    selectedSkills={project.skills || []}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {isEdit ? '수정 완료' : '경력 등록'}
                </button>
            </form>
        </div>
    );
};

export default CareerForm; 