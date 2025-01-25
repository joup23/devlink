package com.devlink.dto;

import com.devlink.entity.Project;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectDto {
    private Long projectId;
    private String title;
    private String description;
    private String link;

    public static ProjectDto from(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setProjectId(project.getProjectId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setLink(project.getLink());
        return dto;
    }
} 