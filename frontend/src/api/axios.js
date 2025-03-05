import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 백엔드 주소
    withCredentials: true  // 쿠키 전송을 위해 필요
});

// 기존 토큰 관련 interceptor 제거
export default apiClient;