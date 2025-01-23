import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:9090/api', // 백엔드 주소
    withCredentials: true  // 쿠키 전송을 위해 필요
});

// 기존 토큰 관련 interceptor 제거
export default apiClient;