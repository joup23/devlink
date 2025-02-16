package com.devlink.service;

import com.devlink.entity.Profile;
import com.devlink.entity.Project;
import com.devlink.entity.Skill;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.ProjectRepository;
import com.devlink.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;

    public ProjectService(ProjectRepository projectRepository, ProfileRepository profileRepository, SkillRepository skillRepository) {
        this.projectRepository = projectRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public Project addProjectToProfile(Long profileId, String title, String description, String link, List<String> skillNames) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setLink(link);
        project.setProfile(profile);

        // 스킬 추가
        if (skillNames != null) {
            for (String skillName : skillNames) {
                Skill skill = skillRepository.findByName(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = new Skill();
                        newSkill.setName(skillName);
                        return skillRepository.save(newSkill);
                    });
                project.getSkills().add(skill);
            }
        }

        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long projectId, String username, String title, String description, String link, List<String> skillNames) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        
        // 프로젝트 소유자 확인
        if (!project.getProfile().getUser().getEmail().equals(username)) {
            throw new RuntimeException("프로젝트를 수정할 권한이 없습니다.");
        }
        
        project.setTitle(title);
        project.setDescription(description);
        project.setLink(link);

        // 스킬 업데이트
        project.getSkills().clear();
        if (skillNames != null) {
            for (String skillName : skillNames) {
                Skill skill = skillRepository.findByName(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = new Skill();
                        newSkill.setName(skillName);
                        return skillRepository.save(newSkill);
                    });
                project.getSkills().add(skill);
            }
        }
        
        return projectRepository.save(project);
    }

    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        
        // 프로젝트 소유자 확인
        if (!project.getProfile().getUser().getEmail().equals(username)) {
            throw new RuntimeException("프로젝트를 삭제할 권한이 없습니다.");
        }
        
        projectRepository.delete(project);
    }
}