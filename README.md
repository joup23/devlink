# DevLink - 개발자 포트폴리오 플랫폼

DevLink는 개발자들이 자신의 포트폴리오를 쉽게 만들고 공유할 수 있는 웹 플랫폼입니다.

## 주요 기능

- **프로필 관리**
  - 개인 정보 및 자기소개 작성
  - 기술 스택 관리
  - 프로필 이미지 업로드

- **프로젝트 관리**
  - 프로젝트 정보 등록
  - 프로젝트 이미지 업로드
  - GitHub 저장소 연동
  - 프로젝트 URL 관리

- **경력 관리**
  - 경력 정보 등록
  - 회사 정보 및 기간 관리
  - 직무 및 역할 설명

- **소셜 기능**
  - 프로필 좋아요
  - 조회수 통계
  - 스킬 기반 프로필 검색

## 기술 스택

### 백엔드
- Java 17
- Spring Boot 3.4.1
- Spring Security
- Spring Data JPA
- PostgreSQL
- Redis (캐싱)
- JWT (인증)

### 프론트엔드
- React
- Tailwind CSS
- Supabase (이미지 스토리지)
- Axios

## 시작하기

### 백엔드 실행
```bash
cd backend
./gradlew bootRun
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 환경 설정

### 백엔드
- `application.properties` 파일에서 데이터베이스 및 Redis 설정
- JWT 시크릿 키 설정

### 프론트엔드
- `.env` 파일에서 API 엔드포인트 및 Supabase 설정

## 배포
- 백엔드: Google Cloud Platform (GCP) VM 인스턴스
  - Ubuntu 22.04 LTS
  - Docker 컨테이너화
  - Spring Boot 내장 톰캣 사용
- 프론트엔드: Vercel
  - 자동 배포 (GitHub 연동)
  - CDN을 통한 정적 파일 서빙
  - 환경 변수 관리

## 배포 프로세스

### 백엔드 배포 (GCP VM)
1. VM 인스턴스 생성 및 설정
2. Docker 설치 및 설정
3. 애플리케이션 배포 및 실행

### 프론트엔드 배포 (Vercel)
1. GitHub 저장소 연동
2. 환경 변수 설정
3. 자동 배포 설정
4. 도메인 설정

## 라이선스
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 