import React, { useRef, useEffect } from 'react';
import { useSkillSuggestions } from '../hooks/useSkillSuggestions';

const SkillAutocomplete = ({ onSkillSelect, selectedSkills }) => {
    const {
        searchTerm,
        setSearchTerm,
        suggestions,
        isOpen,
        setIsOpen
    } = useSkillSuggestions();
    
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (skill) => {
        onSkillSelect(skill);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            e.preventDefault();
            handleSelect(searchTerm.trim());
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="스킬을 입력하세요 (Enter로 직접 추가)"
                    className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => searchTerm.trim() && handleSelect(searchTerm.trim())}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    type="button"
                >
                    추가
                </button>
            </div>
            
            {/* 선택된 스킬 표시 */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
                    >
                        {skill}
                        <button
                            onClick={() => onSkillSelect(skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

            {/* 추천 스킬 드롭다운 */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(suggestion)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkillAutocomplete; 