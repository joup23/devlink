package com.devlink.dto;

import com.devlink.entity.Profile;
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
    private List<SkillDto> skills;  // 스킬 변환
    //private int likeCount; 
    private int viewCount;
    private boolean isLiked;  // 현재 사용자의 좋아요 여부
    private String imageUrl;

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
        
        // 스킬 변환
        dto.setSkills(profile.getSkills().stream()
            .map(SkillDto::from)
            .collect(Collectors.toList()));
        
        // 좋아요, 조회수 정보
        //dto.setLikeCount(profile.getLikeCount());
        dto.setViewCount(profile.getViewCount());
        
        dto.setImageUrl(profile.getImageUrl());
        
        return dto;
    }
} 