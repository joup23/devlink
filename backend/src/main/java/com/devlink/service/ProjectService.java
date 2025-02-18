package com.devlink.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devlink.entity.Profile;
import com.devlink.entity.Project;
import com.devlink.entity.User;
import com.devlink.entity.Skill;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.ProjectRepository;
import com.devlink.repository.UserRepository;
import com.devlink.repository.SkillRepository;
import com.devlink.dto.ProjectDto;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProfileRepository profileRepository;

    public ProjectService(ProjectRepository projectRepository,
                         UserRepository userRepository,
                         SkillRepository skillRepository,
                         ProfileRepository profileRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.profileRepository = profileRepository;
    }

    public List<ProjectDto> getProjectsByProfileId(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        List<Project> projects = projectRepository.findProjectsByProfile(profile);
        return projects.stream()
            .map(ProjectDto::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public ProjectDto createProject(String userEmail, ProjectDto projectDto) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setUser(user);
        project.setTitle(projectDto.getTitle());
        project.setDescription(projectDto.getDescription());
        project.setLink(projectDto.getLink());

        // 스킬 추가
        if (projectDto.getSkills() != null) {
            projectDto.getSkills().forEach(skillName -> {
                Skill skill = skillRepository.findByName(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = new Skill();
                        newSkill.setName(skillName);
                        return skillRepository.save(newSkill);
                    });
                project.getSkills().add(skill);
            });
        }

        return ProjectDto.from(projectRepository.save(project));
    }

    public List<ProjectDto> getUserProjects(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByUser(user)
            .stream()
            .map(ProjectDto::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public void assignProjectToProfile(Long projectId, Long profileId) {
        // 프로필에 프로젝트 할당 로직
    }

    @Transactional
    public void removeProjectFromProfile(Long projectId) {
        // 프로필에서 프로젝트 제거 로직
    }

    @Transactional
    public ProjectDto updateProject(Long projectId, ProjectDto projectDto) {
        // 프로젝트 수정 로직
        return null; // Placeholder return, actual implementation needed
    }

    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }
}