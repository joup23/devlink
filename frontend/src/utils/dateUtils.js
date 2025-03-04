/**
 * 날짜 포맷팅 유틸리티 함수 모음
 */

/**
 * 날짜 문자열을 YYYY-MM 형식으로 변환합니다.
 * @param {string} dateString - 변환할 날짜 문자열
 * @returns {string} YYYY-MM 형식의 날짜 문자열
 */
export const formatYearMonth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 변환합니다.
 * @param {string} dateString - 변환할 날짜 문자열
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const formatFullDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * 날짜 문자열을 로케일에 맞는 형식으로 변환합니다.
 * @param {string} dateString - 변환할 날짜 문자열
 * @param {boolean} withTime - 시간 포함 여부 (기본값: false)
 * @returns {string} 로케일 형식의 날짜 문자열
 */
export const formatDate = (dateString, withTime = false) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (withTime) {
        return date.toLocaleString();
    }
    return date.toLocaleDateString();
};

/**
 * 두 날짜 사이의 기간을 계산합니다.
 * @param {string} startDate - 시작 날짜 문자열
 * @param {string} endDate - 종료 날짜 문자열
 * @returns {string} 기간 문자열 (예: "2년 3개월")
 */
export const calculatePeriod = (startDate, endDate) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let totalMonths = years * 12 + months;
    if (end.getDate() < start.getDate()) {
        totalMonths--;
    }
    
    const calcYears = Math.floor(totalMonths / 12);
    const calcMonths = totalMonths % 12;
    
    let result = '';
    if (calcYears > 0) {
        result += `${calcYears}년 `;
    }
    if (calcMonths > 0 || calcYears === 0) {
        result += `${calcMonths}개월`;
    }
    
    return result.trim();
}; 