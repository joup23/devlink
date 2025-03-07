package com.devlink.dto;

import com.devlink.entity.ProfileProject;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;
import com.devlink.entity.Project;

@Getter
@Setter
public class ProfileProjectDto {
    private Long projectId;
    private String title;
    private String description;
    private String link;
    private List<SkillDto> skills;
    private List<String> imageUrls;

    public static ProfileProjectDto from(ProfileProject profileProject) {
        ProfileProjectDto dto = new ProfileProjectDto();
        Project project = profileProject.getProject();
        
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