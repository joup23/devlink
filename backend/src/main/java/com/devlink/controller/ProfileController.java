package com.devlink.controller;

import com.devlink.entity.Profile;
import com.devlink.entity.User;
import com.devlink.service.LikeService;
import com.devlink.service.ProfileService;
import com.devlink.service.UserService;
import com.devlink.dto.ProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;
    private final LikeService likeService;
    private final UserService userService;

    public ProfileController(ProfileService profileService, LikeService likeService, UserService userService) {
        this.profileService = profileService;
        this.likeService = likeService;
        this.userService = userService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Profile> createProfile(
            @RequestPart(required = false) MultipartFile image,
            @RequestPart String profile,
            @RequestPart(required = false) String careerIds,
            @RequestPart(required = false) String projectIds) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Profile createdProfile = profileService.createProfile(userEmail, image, profile, careerIds, projectIds);
        return ResponseEntity.ok(createdProfile);
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

    // 특정 프로필 조회
    @GetMapping("/{profileId}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long profileId) {
        Profile profile = profileService.getProfile(profileId);
        return ResponseEntity.ok(ProfileDto.from(profile));
    }

    // 프로필 수정
    @PutMapping(value = "/{profileId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Profile> updateProfile(
            @PathVariable Long profileId,
            @RequestPart(required = false) MultipartFile image,
            @RequestPart String profile,
            @RequestPart(required = false) String careerIds,
            @RequestPart(required = false) String projectIds) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Profile updatedProfile = profileService.updateProfile(profileId, userEmail, image, profile, careerIds, projectIds);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProfileDto>> getAllProfiles(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size,
        @RequestParam(required = false) List<String> skills
    ) {
        Page<ProfileDto> profilePage = profileService.getAllProfiles(PageRequest.of(page, size), skills);
        
        return ResponseEntity.ok(profilePage);
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
        likeService.toggleLike(profileId, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{profileId}/isLiked")
    public ResponseEntity<Boolean> isLikedByUser(@PathVariable Long profileId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isLiked = likeService.isLikedByUser(profileId, username);
        return ResponseEntity.ok(isLiked);
    }

    @GetMapping("/{profileId}/likes")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long profileId) {
        long likeCount = likeService.getLikeCount(profileId);
        return ResponseEntity.ok(likeCount);
    }

    // 조회수 증가 API
    @PostMapping("/{profileId}/view")
    public ResponseEntity<?> incrementViewCount(@PathVariable Long profileId) {
        profileService.incrementViewCount(profileId);
        return ResponseEntity.ok().build();
    }

}
