package com.devlink.util;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {

    public String uploadImage(MultipartFile image) throws IOException {
        String uploadDir = "D:/toys/devlink/data/image/";
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        String filePath = uploadDir + fileName;
        
        // 파일 저장
        image.transferTo(new File(filePath));
        
        return "http://localhost:9090/images/" + fileName;  // URL 경로 반환
    }
}
