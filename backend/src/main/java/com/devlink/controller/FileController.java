package com.devlink.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.devlink.dto.ApiResponse;
import com.devlink.service.FileService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    @Autowired
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    /**
     * 이미지 파일을 업로드합니다.
     *
     * @param file 업로드할 이미지 파일
     * @param folder 저장할 폴더 (기본값: "images")
     * @return 업로드된 파일의 URL
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "images") String folder) {
        
        try {
            // 파일 업로드 (Supabase 스토리지 사용)
            String fileUrl = fileService.uploadImage(file, folder);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "파일 업로드 성공", response));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("ERROR", "파일 업로드 실패: " + e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
}

    /**
     * 파일을 삭제합니다.
     *
     * @param fileUrl 삭제할 파일의 URL
     * @return 삭제 결과
     */
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@RequestParam("url") String fileUrl) {
        boolean deleted = fileService.deleteFile(fileUrl);
        
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "파일 삭제 성공", null));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("ERROR", "파일 삭제 실패", null));
        }
    }
} 