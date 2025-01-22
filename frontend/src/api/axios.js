import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:9090/api', // 백엔드 주소
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청에 토큰 추가 (인증 시)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;