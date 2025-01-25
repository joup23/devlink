package com.devlink.dto;

import com.devlink.entity.Profile;
import com.devlink.entity.Project;
import com.devlink.entity.Skill;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProfileDto {
    private Long profileId;
    private String title;
    private String bio;
    private int careerYears;
    private String githubUrl;
    private String userEmail;  // 프로필 소유자 이메일
    private List<ProjectDto> projects;
    private List<String> skills;  // 스킬은 이름만 필요

    public static ProfileDto from(Profile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setProfileId(profile.getProfileId());
        dto.setTitle(profile.getTitle());
        dto.setBio(profile.getBio());
        dto.setCareerYears(profile.getCareerYears());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setUserEmail(profile.getUser().getEmail());
        
        // 프로젝트 변환
        dto.setProjects(profile.getProjects().stream()
            .map(ProjectDto::from)
            .collect(Collectors.toList()));
        
        // 스킬 이름만 추출
        dto.setSkills(profile.getSkills().stream()
            .map(Skill::getName)
            .collect(Collectors.toList()));
        
        return dto;
    }
} 