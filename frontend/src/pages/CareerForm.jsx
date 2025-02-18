import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import SkillAutocomplete from '../components/SkillAutocomplete';

const CareerForm = () => {
    const navigate = useNavigate();
    const [career, setCareer] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/careers', career);
            alert('경력이 추가되었습니다.');
            navigate('/mypage');
        } catch (error) {
            console.error('경력 추가 실패:', error);
            alert('경력 추가에 실패했습니다.');
        }
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        setCareer(prev => ({
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">경력 추가</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">기본 정보</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <label className="block mb-2">직위</label>
                            <input
                                type="text"
                                value={career.position}
                                onChange={(e) => setCareer({...career, position: e.target.value})}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
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
                                value={career.endDate}
                                onChange={(e) => setCareer({...career, endDate: e.target.value})}
                                className="w-full border rounded p-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">프로젝트</h2>
                    
                    {/* 추가된 프로젝트 목록 */}
                    <div className="mb-6 space-y-4">
                        {career.projects.map((project, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{project.projectName}</h3>
                                        <p className="text-sm text-gray-600">{project.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(project.startDate).toLocaleDateString()} ~ 
                                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : '진행중'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCareer(prev => ({
                                            ...prev,
                                            projects: prev.projects.filter((_, i) => i !== index)
                                        }))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        삭제
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 새 프로젝트 추가 폼 */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-4">새 프로젝트 추가</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">프로젝트명</label>
                                <input
                                    type="text"
                                    value={newProject.projectName}
                                    onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2">설명</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                    className="w-full border rounded p-2"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">시작일</label>
                                <input
                                    type="date"
                                    value={newProject.startDate}
                                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">종료일</label>
                                <input
                                    type="date"
                                    value={newProject.endDate}
                                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2">사용 기술</label>
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
                        </div>
                        <button
                            type="button"
                            onClick={handleAddProject}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            프로젝트 추가
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
                >
                    경력 저장
                </button>
            </form>
        </div>
    );
};

export default CareerForm; 