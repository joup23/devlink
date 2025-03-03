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
        skills: [],
        imageUrls: []
    });

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        if (isEdit) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const response = await apiClient.get(`/projects/my/${projectId}`);
            const projectData = response.data;
            
            setProject({
                title: projectData.title,
                description: projectData.description,
                link: projectData.link || ''
            });
            
            setSelectedSkills(projectData.skills || []);
            
            // 기존 이미지 설정
            if (projectData.imageUrls && projectData.imageUrls.length > 0) {
                setExistingImages(projectData.imageUrls);
            }
        } catch (error) {
            console.error('프로젝트 정보를 불러오는데 실패했습니다:', error);
            alert('프로젝트 정보를 불러올 수 없습니다.');
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        
        // 이미지 미리보기 생성
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreview(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageUrl) => {
        // 삭제할 이미지 목록에 추가
        setImagesToDelete(prev => [...prev, imageUrl]);
        // 화면에서 이미지 제거
        setExistingImages(prev => prev.filter(url => url !== imageUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...project,
                skills: selectedSkills
            };
            
            // 수정 시에만 삭제할 이미지 목록 추가
            if (isEdit && imagesToDelete.length > 0) {
                projectData.imagesToDelete = imagesToDelete;
                console.log("삭제할 이미지:", imagesToDelete); // 로그 추가
            }

            // FormData 생성
            const formData = new FormData();
            formData.append('project', JSON.stringify(projectData));
            
            
            // 이미지 추가
            if (images.length > 0) {
                images.forEach(image => {
                    formData.append('images', image);
                });
            }

            if (isEdit) {
                await apiClient.put(`/projects/${projectId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('프로젝트가 수정되었습니다.');
            } else {
                await apiClient.post('/projects', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('프로젝트가 생성되었습니다.');
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
                                prev.some(s => s.name === skill.name)
                                    ? prev.filter(s => s.name !== skill.name)
                                    : [...prev, skill]
                            );
                        }}
                        selectedSkills={selectedSkills}
                    />
                </div>

                {/* 이미지 업로드 섹션 */}
                <div>
                    <label className="block mb-2">프로젝트 이미지</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full border rounded p-2"
                    />
                    
                    {/* 이미지 미리보기 */}
                    {imagePreview.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {imagePreview.map((src, index) => (
                                <div key={index} className="relative">
                                    <img 
                                        src={src} 
                                        alt={`미리보기 ${index}`} 
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 기존 이미지 표시 (수정 시) */}
                {isEdit && existingImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">기존 이미지</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {existingImages.map((imageUrl, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img
                                        src={imageUrl}
                                        alt={`프로젝트 이미지 ${index + 1}`}
                                        className="object-cover w-full h-32 rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(imageUrl)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="이미지 삭제"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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