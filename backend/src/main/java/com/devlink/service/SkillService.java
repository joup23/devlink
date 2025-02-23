package com.devlink.service;

import com.devlink.dto.SkillDto;
import com.devlink.entity.Profile;
import com.devlink.entity.Skill;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final ProfileRepository profileRepository;

    public SkillService(SkillRepository skillRepository, ProfileRepository profileRepository) {
        this.skillRepository = skillRepository;
        this.profileRepository = profileRepository;
    }

    // 프로필에 스킬 추가
    public Profile addSkillToProfile(Long profileId, String skillName) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Skill skill = skillRepository.findByName(skillName)
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(skillName);
                    return skillRepository.save(newSkill);
                });

        profile.getSkills().add(skill);
        return profileRepository.save(profile);
    }

    public Profile removeSkillFromProfile(Long profileId, String username, String skillName) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        
        // 프로필 소유자 확인
        if (!profile.getUser().getEmail().equals(username)) {
            throw new RuntimeException("스킬을 삭제할 권한이 없습니다.");
        }
        
        // 스킬 찾기
        Skill skillToRemove = profile.getSkills().stream()
            .filter(skill -> skill.getName().equals(skillName))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("스킬을 찾을 수 없습니다."));
        
        profile.getSkills().remove(skillToRemove);
        return profileRepository.save(profile);
    }

    public List<SkillDto> suggestSkills(String query) {
        return skillRepository.findByNameContainingIgnoreCase(query)
            .stream()
            .map(SkillDto::from)
            .collect(Collectors.toList());
    }

    public List<Skill> getAllSkillsByOrderByName() {
        return skillRepository.findAllByOrderByName();
    }
}
