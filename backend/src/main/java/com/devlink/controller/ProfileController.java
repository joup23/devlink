package com.devlink.controller;

import com.devlink.entity.Profile;
import com.devlink.service.ProfileService;
import com.devlink.dto.ProfileDto;
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

        Profile profile = profileService.createProfile(title, bio, careerYears, githubUrl);
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

        Profile updatedProfile = profileService.updateProfile(profileId, username, title, bio, careerYears, githubUrl);
        return ResponseEntity.ok(ProfileDto.from(updatedProfile));
    }

    // 특정 프로필 조회
    @GetMapping("/{profileId}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long profileId) {
        Profile profile = profileService.getProfile(profileId);
        return ResponseEntity.ok(ProfileDto.from(profile));
    }

}
