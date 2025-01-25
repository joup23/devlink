package com.devlink.controller;

import com.devlink.entity.Profile;
import com.devlink.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/skill")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping("/{profileId}")
    public ResponseEntity<Profile> addSkill(@PathVariable Long profileId, @RequestBody Map<String, String> body) {
        String skillName = body.get("name");

        Profile profile = skillService.addSkillToProfile(profileId, skillName);
        return ResponseEntity.ok(profile);
    }

    // 스킬 삭제
    @DeleteMapping("/{profileId}/{skillName}")
    public ResponseEntity<Profile> removeSkill(
            @PathVariable Long profileId,
            @PathVariable String skillName) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Profile profile = skillService.removeSkillFromProfile(profileId, username, skillName);
        return ResponseEntity.ok(profile);
    }
}