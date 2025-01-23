package com.devlink.controller;

import com.devlink.entity.Profile;
import com.devlink.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // 프로필 작성
    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String bio = (String) body.get("bio");
        int careerYears = (int) body.get("careerYears");
        String githubUrl = (String) body.get("githubUrl");

        Profile profile = profileService.createProfile(title, bio, careerYears, githubUrl);
        return ResponseEntity.ok(profile);
    }

    // 프로필 조회
    @GetMapping
    public ResponseEntity<List<Profile>> getProfiles() {
        List<Profile> profiles = profileService.getProfiles();
        return ResponseEntity.ok(profiles);
    }
}
