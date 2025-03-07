package com.devlink.dto;

import com.devlink.entity.Project;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProjectDto {
    private Long projectId;
    private String title;
    private String description;
    private String link;
    private List<SkillDto> skills;
    private List<String> imageUrls;

    public static ProjectDto from(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setProjectId(project.getProjectId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setLink(project.getLink());
        dto.setSkills(project.getSkills().stream()
            .map(SkillDto::from)
            .collect(Collectors.toList()));
        dto.setImageUrls(project.getImageUrls());
        return dto;
    }
} 