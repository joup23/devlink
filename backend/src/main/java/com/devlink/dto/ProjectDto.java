package com.devlink.dto;

import com.devlink.entity.Project;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProjectDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long projectId;
    private String title;
    private String description;
    private List<SkillDto> skills;
    private List<String> imageUrls;
    private String githubUrl;
    private String projectUrl;
    private String startDate;
    private String endDate;

    public static ProjectDto from(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setProjectId(project.getProjectId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setSkills(project.getSkills().stream()
            .map(SkillDto::from)
            .collect(Collectors.toList()));
        dto.setImageUrls(project.getImageUrls());
        dto.setGithubUrl(project.getGithubUrl());
        dto.setProjectUrl(project.getProjectUrl());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        return dto;
    }
} 