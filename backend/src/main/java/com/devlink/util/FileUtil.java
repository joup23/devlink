package com.devlink.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.devlink.service.storage.SupabaseStorageService;

import java.io.IOException;

/**
 * 파일 업로드 및 관리를 위한 유틸리티 클래스
 * 이 클래스는 Supabase 스토리지 서비스를 사용하여 파일을 업로드하고 관리합니다.
 */
@Component
public class FileUtil {

    private final SupabaseStorageService supabaseStorageService;

    @Autowired
    public FileUtil(SupabaseStorageService supabaseStorageService) {
        this.supabaseStorageService = supabaseStorageService;
    }

    /**
     * 이미지 파일을 업로드합니다.
     *
     * @param file 업로드할 이미지 파일
     * @param folder 저장할 폴더 (예: "profiles", "projects")
     * @return 업로드된 파일의 URL
     */
    public String uploadImage(MultipartFile file, String folder) {
        try {
            return supabaseStorageService.uploadImage(file, folder);
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 중 오류 발생: " + e.getMessage(), e);
        }
    }

    /**
     * 이미지 파일을 삭제합니다.
     *
     * @param fileName 삭제할 파일 이름
     * @param folder 파일이 저장된 폴더
     * @return 삭제 성공 여부
     */
    public boolean deleteImage(String fileName, String folder) {
        String fileUrl = supabaseStorageService.getPublicUrl() + "/" + folder + "/" + fileName;
        return supabaseStorageService.deleteFile(fileUrl);
    }

    /**
     * 파일 URL을 삭제합니다.
     *
     * @param fileUrl 삭제할 파일의 URL
     * @return 삭제 성공 여부
     */
    public boolean deleteFileByUrl(String fileUrl) {
        return supabaseStorageService.deleteFile(fileUrl);
    }
}
