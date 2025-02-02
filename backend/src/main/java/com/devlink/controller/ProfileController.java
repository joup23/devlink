package com.devlink.controller;

import com.devlink.entity.Profile;
import com.devlink.service.ProfileService;
import com.devlink.dto.ProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;
    private final ObjectMapper objectMapper;

    public ProfileController(ProfileService profileService, ObjectMapper objectMapper) {
        this.profileService = profileService;
        this.objectMapper = objectMapper;
    }

    // 프로필 작성
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProfileDto> createProfile(
        @RequestPart(value = "image", required = false) MultipartFile image,
        @RequestParam("title") String title, 
        @RequestParam("bio") String bio,
        @RequestParam("careerYears") String careerYears,
        @RequestParam("githubUrl") String githubUrl,
        @RequestParam("skills") String skillsJson,
        @RequestParam("projects") String projectsJson
    ) throws IOException {
        // JSON 문자열을 객체로 변환
        List<String> skills = objectMapper.readValue(skillsJson, new TypeReference<List<String>>() {});
        List<Map<String, String>> projects = objectMapper.readValue(projectsJson, new TypeReference<List<Map<String, String>>>() {});

        // 이미지 처리 및 프로필 생성
        Profile profile = profileService.createProfile(
            title, bio, Integer.parseInt(careerYears), githubUrl,
            projects, skills, image
        );
        
        return ResponseEntity.ok(ProfileDto.from(profile));
    }

    // 프로필 조회
    @GetMapping
    public ResponseEntity<List<ProfileDto>> getProfiles() {
        List<Profile> profiles = profileService.getProfiles();
        List<ProfileDto> profileDtos = profiles.stream()
            .map(ProfileDto::from)
            .collect(Collectors.toList()); 
        return ResponseEntity.ok(profileDtos);
    }

    // 프로필 수정
    @PutMapping(value = "/{profileId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProfileDto> updateProfile(
        @PathVariable Long profileId,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @RequestParam("title") String title,
        @RequestParam("bio") String bio,
        @RequestParam("careerYears") String careerYears,
        @RequestParam("githubUrl") String githubUrl,
        @RequestParam("skills") String skillsJson,
        @RequestParam("projects") String projectsJson
    ) throws IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        List<String> skills = objectMapper.readValue(skillsJson, new TypeReference<List<String>>() {});
        List<Map<String, String>> projects = objectMapper.readValue(projectsJson, new TypeReference<List<Map<String, String>>>() {});

        Profile updatedProfile = profileService.updateProfile(
            profileId, username, title, bio, Integer.parseInt(careerYears), githubUrl, skills, projects, image
        );
        return ResponseEntity.ok(ProfileDto.from(updatedProfile));
    }

    // 특정 프로필 조회
    @GetMapping("/{profileId}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long profileId) {
        // 조회수 증가
        profileService.incrementViewCount(profileId);
        
        Profile profile = profileService.getProfile(profileId);
        return ResponseEntity.ok(ProfileDto.from(profile));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProfileDto>> getAllProfiles(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size,
        @RequestParam(required = false) List<String> skills
    ) {
        Page<Profile> profilePage = profileService.getAllProfiles(PageRequest.of(page, size), skills);
        Page<ProfileDto> profileDtos = profilePage.map(ProfileDto::from);
        return ResponseEntity.ok(profileDtos);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ProfileDto>> getRecentProfiles() {
        List<Profile> profiles = profileService.getRecentProfiles(3);
        List<ProfileDto> profileDtos = profiles.stream()
            .map(ProfileDto::from)
            .collect(Collectors.toList());
        return ResponseEntity.ok(profileDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProfileDto>> searchProfiles(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) List<String> skills
    ) {
        List<Profile> profiles = profileService.searchProfiles(keyword, skills);
        List<ProfileDto> profileDtos = profiles.stream()
            .map(ProfileDto::from)
            .collect(Collectors.toList());
        return ResponseEntity.ok(profileDtos);
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long profileId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        profileService.deleteProfile(profileId, username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{profileId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long profileId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        profileService.toggleLike(profileId, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{profileId}/isLiked")
    public ResponseEntity<Boolean> isLikedByUser(@PathVariable Long profileId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isLiked = profileService.isLikedByUser(profileId, username);
        return ResponseEntity.ok(isLiked);
    }

}
