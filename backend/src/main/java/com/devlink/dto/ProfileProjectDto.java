package com.devlink.dto;

import com.devlink.entity.ProfileProject;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;
import com.devlink.entity.Project;
import java.io.Serializable;

@Getter
@Setter
public class ProfileProjectDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long projectId;
    private String title;
    private String description;
    private List<SkillDto> skills;
    private String githubUrl;
    private String projectUrl;
    private String startDate;
    private String endDate;
    private List<String> imageUrls;

    public static ProfileProjectDto from(ProfileProject profileProject) {
        ProfileProjectDto dto = new ProfileProjectDto();
        Project project = profileProject.getProject();
        
        dto.setProjectId(project.getProjectId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setSkills(project.getSkills().stream()
            .map(SkillDto::from)
            .collect(Collectors.toList()));
        dto.setGithubUrl(project.getGithubUrl());
        dto.setProjectUrl(project.getProjectUrl());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setImageUrls(project.getImageUrls());
        
        return dto;
    }
} 