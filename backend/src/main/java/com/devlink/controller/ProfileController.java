package com.devlink.controller;

import com.devlink.entity.Profile;
import com.devlink.service.ProfileService;
import com.devlink.dto.ProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // 프로필 작성
    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String bio = (String) body.get("bio");
        int careerYears = (int) body.get("careerYears");
        String githubUrl = (String) body.get("githubUrl");
        
        // 프로젝트와 스킬 정보 추출
        List<Map<String, String>> projects = (List<Map<String, String>>) body.get("projects");
        List<String> skills = (List<String>) body.get("skills");

        Profile profile = profileService.createProfile(title, bio, careerYears, githubUrl, projects, skills);
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
    @PutMapping("/{profileId}")
    public ResponseEntity<ProfileDto> updateProfile(
            @PathVariable Long profileId,
            @RequestBody Map<String, Object> body) {
        // 현재 로그인한 사용자 확인
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        String title = (String) body.get("title");
        String bio = (String) body.get("bio");
        int careerYears = (int) body.get("careerYears");
        String githubUrl = (String) body.get("githubUrl");
        List<String> skills = (List<String>) body.get("skills");
        List<Map<String, String>> projects = (List<Map<String, String>>) body.get("projects");

        Profile updatedProfile = profileService.updateProfile(
            profileId, username, title, bio, careerYears, githubUrl, skills, projects);
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
