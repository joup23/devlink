package com.devlink.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * Supabase 스토리지를 사용하여 파일을 업로드하고 관리하는 서비스
 */
@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    @Value("${supabase.storage.public-url}")
    private String publicUrl;

    private final RestTemplate restTemplate;

    public SupabaseStorageService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * 이미지 파일을 Supabase 스토리지에 업로드합니다.
     *
     * @param file 업로드할 이미지 파일
     * @param folder 저장할 폴더 경로 (예: "profiles", "projects")
     * @return 업로드된 파일의 공개 URL
     * @throws IOException 파일 처리 중 오류 발생 시
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        // 파일 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // 고유한 파일명 생성
        String fileName = UUID.randomUUID().toString() + extension;
        String filePath = folder + "/" + fileName;

        // Supabase Storage API 엔드포인트
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(MediaType.valueOf(file.getContentType()));

        // 요청 엔티티 생성
        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

        try {
            // API 호출하여 파일 업로드
            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                // 업로드 성공 시 공개 URL 반환
                return publicUrl + "/" + filePath;
            } else {
                throw new IOException("파일 업로드 실패: " + response.getBody());
            }
        } catch (Exception e) {
            throw new IOException("Supabase 스토리지 업로드 오류: " + e.getMessage(), e);
        }
    }

    /**
     * Supabase 스토리지에서 파일을 삭제합니다.
     *
     * @param fileUrl 삭제할 파일의 URL
     * @return 삭제 성공 여부
     */
    public boolean deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return false;
        }

        // 파일 경로 추출
        String filePath = fileUrl.replace(publicUrl + "/", "");

        // Supabase Storage API 엔드포인트
        String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);

        // 요청 엔티티 생성
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        try {
            // API 호출하여 파일 삭제
            ResponseEntity<String> response = restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    requestEntity,
                    String.class
            );

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Supabase 스토리지의 공개 URL을 반환합니다.
     *
     * @return 스토리지 공개 URL
     */
    public String getPublicUrl() {
        return publicUrl;
    }
} 