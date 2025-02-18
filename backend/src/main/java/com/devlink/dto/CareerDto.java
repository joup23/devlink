package com.devlink.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.devlink.entity.Career;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CareerDto {
    private Long careerId;
    private String companyName;
    private String department;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<CareerProjectDto> projects;

    public static CareerDto from(Career career) {
        CareerDto dto = new CareerDto();
        dto.setCareerId(career.getCareerId());
        dto.setCompanyName(career.getCompanyName());
        dto.setDepartment(career.getDepartment());
        dto.setPosition(career.getPosition());
        dto.setStartDate(career.getStartDate());
        dto.setEndDate(career.getEndDate());
        
        // 프로젝트 정보만 변환
        if (career.getProjects() != null) {
            dto.setProjects(career.getProjects().stream()
                .map(CareerProjectDto::from)
                .collect(Collectors.toList()));
        }
        return dto;
    }
} 