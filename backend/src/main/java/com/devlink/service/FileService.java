package com.devlink.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.devlink.service.storage.SupabaseStorageService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @Value("${app.file.base-url}")
    private String baseUrl;
    
    private final SupabaseStorageService supabaseStorageService;
    
    @Autowired
    public FileService(SupabaseStorageService supabaseStorageService) {
        this.supabaseStorageService = supabaseStorageService;
    }

    /**
     * 이미지 파일을 업로드합니다.
     * Supabase 스토리지를 사용하여 파일을 저장합니다.
     *
     * @param file 업로드할 이미지 파일
     * @param folder 저장할 폴더 (예: "profiles", "projects")
     * @return 업로드된 파일의 URL
     * @throws IOException 파일 처리 중 오류 발생 시
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        // Supabase 스토리지에 파일 업로드
        return supabaseStorageService.uploadImage(file, folder);
    }
    
    /**
     * 이미지 파일을 로컬에 업로드합니다. (백업용)
     *
     * @param file 업로드할 이미지 파일
     * @param folder 저장할 폴더 (예: "profiles", "projects")
     * @return 업로드된 파일의 URL
     * @throws IOException 파일 처리 중 오류 발생 시
     */
    public String uploadImageToLocal(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        // 폴더 경로 생성
        String folderPath = uploadDir + File.separator + folder;
        Path directoryPath = Paths.get(folderPath);
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);
        }

        // 파일 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // 고유한 파일명 생성
        String fileName = UUID.randomUUID().toString() + extension;
        String filePath = folderPath + File.separator + fileName;

        // 파일 저장
        file.transferTo(new File(filePath));

        // 파일 URL 반환
        return baseUrl + "/" + folder + "/" + fileName;
    }

    /**
     * 파일을 삭제합니다.
     *
     * @param fileUrl 삭제할 파일의 URL
     * @return 삭제 성공 여부
     */
    public boolean deleteFile(String fileUrl) {
        // Supabase 스토리지에서 파일 삭제
        return supabaseStorageService.deleteFile(fileUrl);
    }
    
    /**
     * 로컬 파일을 삭제합니다. (백업용)
     *
     * @param fileUrl 삭제할 파일의 URL
     * @return 삭제 성공 여부
     */
    public boolean deleteLocalFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return false;
        }

        // URL에서 파일 경로 추출
        String filePath = fileUrl.replace(baseUrl, uploadDir);
        filePath = filePath.replace("/", File.separator);

        // 파일 삭제
        File file = new File(filePath);
        return file.exists() && file.delete();
    }
} 