import { useState, useEffect } from 'react';
import apiClient from '../api/axios';

export const useSkillSuggestions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (searchTerm.trim()) {
            const fetchSuggestions = async () => {
                try {
                    const response = await apiClient.get(`/skill/suggest?query=${searchTerm}`);
                    setSuggestions(response.data);
                } catch (error) {
                    console.error('스킬 검색 실패:', error);
                    setSuggestions([]);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        suggestions,
        isOpen,
        setIsOpen
    };
}; 