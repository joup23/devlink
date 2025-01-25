package com.devlink.service;

import com.devlink.entity.Profile;
import com.devlink.entity.Project;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.ProjectRepository;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProfileRepository profileRepository;

    public ProjectService(ProjectRepository projectRepository, ProfileRepository profileRepository) {
        this.projectRepository = projectRepository;
        this.profileRepository = profileRepository;
    }

    // 프로젝트 추가
    public Project addProjectToProfile(Long profileId, String title, String description, String link) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setLink(link);
        project.setProfile(profile);

        return projectRepository.save(project);
    }

    public Project updateProject(Long projectId, String username, String title, String description, String link) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        
        // 프로젝트 소유자 확인
        if (!project.getProfile().getUser().getEmail().equals(username)) {
            throw new RuntimeException("프로젝트를 수정할 권한이 없습니다.");
        }
        
        project.setTitle(title);
        project.setDescription(description);
        project.setLink(link);
        
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