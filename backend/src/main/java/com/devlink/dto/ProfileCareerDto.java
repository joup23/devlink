package com.devlink.dto;

import com.devlink.entity.ProfileCareer;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.devlink.entity.Career;
import java.io.Serializable;

@Getter
@Setter
public class ProfileCareerDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long careerId;
    private String companyName;
    private String department;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private List<CareerProjectDto> projects;

    public static ProfileCareerDto from(ProfileCareer profileCareer) {
        ProfileCareerDto dto = new ProfileCareerDto();
        Career career = profileCareer.getCareer();
        
        dto.setCareerId(career.getCareerId());
        dto.setCompanyName(career.getCompanyName());
        dto.setDepartment(career.getDepartment());
        dto.setPosition(career.getPosition());
        dto.setStartDate(career.getStartDate());
        dto.setEndDate(career.getEndDate());
        dto.setDescription(career.getDescription());
        dto.setProjects(career.getProjects().stream()
            .map(CareerProjectDto::from)
            .collect(Collectors.toList()));
        
        return dto;
    }
} 