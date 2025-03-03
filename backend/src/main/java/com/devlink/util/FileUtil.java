package com.devlink.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUtil {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @Value("${app.file.base-url}")
    private String fileBaseUrl;

    public String uploadImage(MultipartFile file, String subDirectory) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir, subDirectory);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            return fileBaseUrl + "/" + subDirectory + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }
    }

    /**
     * 파일 시스템에서 이미지 파일 삭제
     * @param fileName 삭제할 파일 이름
     * @param subDirectory 서브 디렉토리 (projects, profiles 등)
     * @return 삭제 성공 여부
     */
    public boolean deleteImage(String fileName, String subDirectory) {
        try {
            Path filePath = Paths.get(uploadDir, subDirectory, fileName);
            
            // 파일이 존재하는지 확인 후 삭제
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            }
            return false;
        } catch (IOException e) {
            throw new RuntimeException("이미지 삭제 실패: " + fileName, e);
        }
    }
}
