package com.devlink.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.devlink.entity.CareerProject;
import com.devlink.entity.Skill;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CareerProjectDto {
    private Long careerProjectId;
    private String projectName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> skills;

    public static CareerProjectDto from(CareerProject project) {
        CareerProjectDto dto = new CareerProjectDto();
        dto.setCareerProjectId(project.getCareerProjectId());
        dto.setProjectName(project.getProjectTitle());
        dto.setDescription(project.getProjectDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setSkills(project.getSkills().stream()
            .map(Skill::getName)
            .collect(Collectors.toList()));
        return dto;
    }
} 