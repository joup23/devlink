# Java 17 JDK 기반 이미지 사용
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일을 컨테이너로 복사
COPY build/libs/*.jar app.jar

# 컨테이너에서 실행할 포트 지정
ENV PORT 8080
EXPOSE 8080

# 애플리케이션 실행 명령
CMD ["java", "-jar", "app.jar"]