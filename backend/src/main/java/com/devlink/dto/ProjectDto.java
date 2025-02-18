package com.devlink.dto;

import com.devlink.entity.Project;
import com.devlink.entity.Skill;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProjectDto {
    private Long projectId;
    private String title;
    private String description;
    private String link;
    private Set<String> skills;

    public static ProjectDto from(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setProjectId(project.getProjectId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setLink(project.getLink());
        dto.setSkills(project.getSkills().stream()
            .map(Skill::getName)
            .collect(Collectors.toSet()));
        return dto;
    }
} 