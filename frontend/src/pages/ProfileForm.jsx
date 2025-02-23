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
        imageUrl: ''
    });

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // 프로젝트와 경력 상태 관리
    const [myProjects, setMyProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [myCareers, setMyCareers] = useState([]);
    const [selectedCareers, setSelectedCareers] = useState([]);

    useEffect(() => {
        if (isEdit) {
            fetchProfile();
        }
        fetchMyProjects();
        fetchMyCareers();
    }, [profileId]);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get(`/profiles/${profileId}`);
            const profileData = response.data;
            setProfile(profileData);
            // 기존 스킬들을 selectedSkills에 설정
            setSelectedSkills(profileData.skills || []);
            setSelectedProjects(profileData.selectedProjectIds || []);
            setSelectedCareers(profileData.selectedCareerIds || []);
        } catch (error) {
            console.error('프로필 로딩 실패:', error);
        }
    };

    const fetchMyProjects = async () => {
        try {
            const response = await apiClient.get('/projects/my');
            setMyProjects(response.data);
        } catch (error) {
            console.error('프로젝트 로딩 실패:', error);
        }
    };

    const fetchMyCareers = async () => {
        try {
            const response = await apiClient.get('/careers/my');
            setMyCareers(response.data);
        } catch (error) {
            console.error('경력 로딩 실패:', error);
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
            
            const profileData = {
                ...profile,
                // 스킬 객체 전체를 전송 (skillId와 name 포함)
                skills: selectedSkills.map(skill => ({
                    skillId: skill.skillId,
                    name: skill.name
                }))
            };

            if (imageFile) {
                formData.append('image', imageFile);
            }

            // JSON 데이터를 문자열로 변환하여 추가
            formData.append('profile', JSON.stringify(profileData));
            
            // 선택된 프로젝트와 경력 ID 추가
            if (selectedProjects.length > 0) {
                formData.append('projectIds', JSON.stringify(selectedProjects));
            }
            if (selectedCareers.length > 0) {
                formData.append('careerIds', JSON.stringify(selectedCareers));
            }

            const response = await apiClient({
                method: isEdit ? 'put' : 'post',
                url: isEdit ? `/profiles/${profileId}` : '/profiles',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert(isEdit ? '프로필이 수정되었습니다.' : '프로필이 등록되었습니다.');
            navigate('/mypage');
        } catch (error) {
            console.error('프로필 저장 실패:', error);
            alert('프로필 저장에 실패했습니다.');
        }
    };

    const handleSkillSelect = (skill) => {
        // 문자열로 입력된 경우 스킬 객체로 변환
        const skillObject = typeof skill === 'string' 
            ? { 
                skillId: null,  // 새로운 스킬은 ID가 없음
                name: skill     // 입력된 문자열을 name으로 사용
            } 
            : skill;

        setSelectedSkills(prev => 
            prev.some(s => s.name === skillObject.name)  // 이름으로 중복 체크
                ? prev.filter(s => s.name !== skillObject.name)
                : [...prev, skillObject]
        );
    };

    const handleProjectSelect = (projectId) => {
        setSelectedProjects(prev => 
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const handleCareerSelect = (careerId) => {
        setSelectedCareers(prev => 
            prev.includes(careerId)
                ? prev.filter(id => id !== careerId)
                : [...prev, careerId]
        );
    };

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

            {/* 스킬 섹션 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">스킬</h2>
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

            {/* 프로젝트 선택 섹션 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">프로젝트 선택</h2>
                <div className="grid gap-4">
                    {myProjects.map((project) => (
                        <div 
                            key={project.projectId} 
                            className={`border rounded-lg p-4 cursor-pointer ${
                                selectedProjects.includes(project.projectId) 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'hover:border-gray-400'
                            }`}
                            onClick={() => handleProjectSelect(project.projectId)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{project.title}</h3>
                                    <p className="text-gray-600">{project.description}</p>
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
                                <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(project.projectId)}
                                    onChange={() => handleProjectSelect(project.projectId)}
                                    className="h-5 w-5 text-blue-600"
                                    onClick={e => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 경력 선택 섹션 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">경력 선택</h2>
                <div className="grid gap-4">
                    {myCareers.map((career) => (
                        <div 
                            key={career.careerId} 
                            className={`border rounded-lg p-4 cursor-pointer ${
                                selectedCareers.includes(career.careerId) 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'hover:border-gray-400'
                            }`}
                            onClick={() => handleCareerSelect(career.careerId)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{career.companyName}</h3>
                                    <p className="text-gray-600">
                                        {career.department} - {career.position}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(career.startDate).toLocaleDateString()} ~ 
                                        {career.endDate ? new Date(career.endDate).toLocaleDateString() : '현재'}
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedCareers.includes(career.careerId)}
                                    onChange={() => handleCareerSelect(career.careerId)}
                                    className="h-5 w-5 text-blue-600"
                                    onClick={e => e.stopPropagation()}
                                />
                            </div>

                            {/* 프로젝트 목록 */}
                            <div className="mt-4 space-y-2">
                                {career.projects.map((project, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded">
                                        <h4 className="font-semibold">{project.projectName}</h4>
                                        <p className="text-sm text-gray-600">{project.description}</p>
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
                        </div>
                    ))}
                </div>
            </div>

            {/* 최종 제출 버튼 */}
            <button 
                type="submit" 
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
                {isEdit ? '수정 완료' : '프로필 등록'}
            </button>
        </div>
    );
};

export default ProfileForm; 