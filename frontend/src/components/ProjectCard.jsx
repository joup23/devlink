import React, { useState } from 'react';
import { formatYearMonth } from '../utils/dateUtils';

// 간단한 이미지 슬라이더 컴포넌트
const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    // 이미지가 없거나 빈 배열인 경우 렌더링하지 않음
    if (!images || images.length === 0) {
        return null;
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // 이미지 확대 보기
    const showFullscreen = (index) => {
        setFullscreenImage(images[index]);
    };

    // 확대 보기 닫기
    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <div className="relative">
            {/* 이미지 슬라이더 - 높이를 h-80으로 증가시키고 object-contain으로 변경 */}
            <div className="relative h-80 mb-4 bg-gray-100 rounded overflow-hidden">
                <button 
                    onClick={goToPrevious} 
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-colors"
                    aria-label="이전 이미지"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <img 
                    src={images[currentIndex]} 
                    alt={`슬라이드 ${currentIndex + 1}`} 
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => showFullscreen(currentIndex)}
                    onError={(e) => {
                        // e.target.src = '/default-project.png';
                    }}
                />
                
                <button 
                    onClick={goToNext} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-colors"
                    aria-label="다음 이미지"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* 이미지 인디케이터 */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 bg-white bg-opacity-70 px-3 py-1 rounded-full">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                                currentIndex === index ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                            aria-label={`이미지 ${index + 1}로 이동`}
                        />
                    ))}
                </div>
                
                {/* 현재 이미지 번호 표시 */}
                <div className="absolute top-3 right-3 bg-white bg-opacity-70 px-2 py-1 rounded-md text-xs font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* 확대 보기 모달 */}
            {fullscreenImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeFullscreen}>
                    <div className="relative max-w-5xl max-h-screen p-4">
                        <button 
                            className="absolute top-0 right-0 m-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                            onClick={closeFullscreen}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img 
                            src={fullscreenImage} 
                            alt="확대 이미지" 
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const ProjectCard = ({ project }) => {
    // 이미지 처리: 단일 이미지인 경우 배열로 변환, 배열인 경우 그대로 사용
    const images = project.imageUrls || (project.imageUrl ? [project.imageUrl] : []);
    
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* 이미지 슬라이더 */}
            {images.length > 0 && <ImageSlider images={images} />}
            
            <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                {/* 날짜 정보 추가 */}
                {project.startDate && (
                    <p className="text-sm text-gray-500 mt-1">
                        {formatYearMonth(project.startDate)} ~ {project.endDate ? formatYearMonth(project.endDate) : '현재'}
                    </p>
                )}
                <p className="text-gray-600 line-clamp-2 mt-1 whitespace-pre-line">{project.description}</p>
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
                
                {/* 프로젝트 링크가 있는 경우 표시 */}
                {project.link && (
                    <div className="mt-3">
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            프로젝트 링크
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard; 