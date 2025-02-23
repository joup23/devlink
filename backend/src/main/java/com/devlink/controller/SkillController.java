package com.devlink.controller;

import com.devlink.dto.SkillDto;
import com.devlink.entity.Profile;
import com.devlink.entity.Skill;
import com.devlink.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @GetMapping("/suggest")
    public ResponseEntity<List<SkillDto>> suggestSkills(@RequestParam String query) {
        List<SkillDto> suggestions = skillService.suggestSkills(query);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping
    public ResponseEntity<List<SkillDto>> skills() {
        List<Skill> skills = skillService.getAllSkillsByOrderByName();
        List<SkillDto> skillDtos = skills.stream()
            .map(SkillDto::from)
            .collect(Collectors.toList());
        return ResponseEntity.ok(skillDtos);
    }
}