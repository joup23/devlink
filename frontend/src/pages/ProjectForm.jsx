import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axios';
import SkillAutocomplete from '../components/SkillAutocomplete';

const ProjectForm = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!projectId;

    const [project, setProject] = useState({
        title: '',
        description: '',
        link: '',
        skills: []
    });

    const [selectedSkills, setSelectedSkills] = useState([]);

    useEffect(() => {
        if (isEdit) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const response = await apiClient.get(`/projects/my/${projectId}`);
            setProject(response.data);
            setSelectedSkills(response.data.skills);
        } catch (error) {
            console.error('프로젝트 로딩 실패:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...project,
                skills: selectedSkills
            };

            if (isEdit) {
                await apiClient.put(`/projects/${projectId}`, projectData);
                alert('프로젝트가 수정되었습니다.');
            } else {
                await apiClient.post('/projects', projectData);
                alert('프로젝트가 등록되었습니다.');
            }
            navigate('/mypage');
        } catch (error) {
            console.error('프로젝트 저장 실패:', error);
            alert('프로젝트 저장에 실패했습니다.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? '프로젝트 수정' : '프로젝트 등록'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">프로젝트명</label>
                    <input
                        type="text"
                        value={project.title}
                        onChange={(e) => setProject({...project, title: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">설명</label>
                    <textarea
                        value={project.description}
                        onChange={(e) => setProject({...project, description: e.target.value})}
                        className="w-full border rounded p-2"
                        rows="4"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">링크</label>
                    <input
                        type="url"
                        value={project.link}
                        onChange={(e) => setProject({...project, link: e.target.value})}
                        className="w-full border rounded p-2"
                        placeholder="GitHub 링크나 배포 URL"
                    />
                </div>

                <div>
                    <label className="block mb-2">스킬</label>
                    <SkillAutocomplete
                        onSkillSelect={(skill) => {
                            setSelectedSkills(prev => 
                                prev.includes(skill)
                                    ? prev.filter(s => s !== skill)
                                    : [...prev, skill]
                            );
                        }}
                        selectedSkills={selectedSkills}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {isEdit ? '수정 완료' : '프로젝트 등록'}
                </button>
            </form>
        </div>
    );
};

export default ProjectForm; 