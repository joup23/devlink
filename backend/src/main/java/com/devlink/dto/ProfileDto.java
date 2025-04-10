package com.devlink.dto;

import com.devlink.entity.Profile;
import com.devlink.entity.User;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;
import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
public class ProfileDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long profileId;
    private String title;
    private String bio;
    private int careerYears;
    private String githubUrl;
    private String userEmail;  // 프로필 소유자 이메일
    private List<ProfileProjectDto> projects;
    private List<ProfileCareerDto> careers;
    private List<SkillDto> skills;  // 스킬 변환
    //private int likeCount; 
    private int viewCount;
    private boolean isLiked;  // 현재 사용자의 좋아요 여부
    private String imageUrl;
    private List<Long> selectedProjectIds;  // 선택된 프로젝트 ID 리스트
    private List<Long> selectedCareerIds;   // 선택된 경력 ID 리스트
    private User user;

    // 사용자 기본 정보를 위한 필드들 추가
    private String name;
    private String email;
    private LocalDate birthDate;
    private String location;
    private String phone;
    private String education;

    public static ProfileDto from(Profile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setProfileId(profile.getProfileId());
        dto.setTitle(profile.getTitle());
        dto.setBio(profile.getBio());
        dto.setCareerYears(profile.getCareerYears());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setUserEmail(profile.getUser().getEmail());

        // 선택된 프로젝트 ID 리스트 설정
        dto.setSelectedProjectIds(profile.getProfileProjects().stream()
            .map(pp -> pp.getProject().getProjectId())
            .collect(Collectors.toList()));

        // 선택된 경력 ID 리스트 설정
        dto.setSelectedCareerIds(profile.getProfileCareers().stream()
            .map(pc -> pc.getCareer().getCareerId())
            .collect(Collectors.toList()));

        // 프로젝트 변환
        dto.setProjects(profile.getProfileProjects().stream()
            .map(ProfileProjectDto::from)
            .collect(Collectors.toList()));
        
        // 경력 변환
        dto.setCareers(profile.getProfileCareers().stream()
            .map(ProfileCareerDto::from)
            .collect(Collectors.toList()));

        // 스킬 변환
        dto.setSkills(profile.getSkills().stream()
            .map(SkillDto::from)
            .collect(Collectors.toList()));
        
        // 좋아요, 조회수 정보
        //dto.setLikeCount(profile.getLikeCount());
        dto.setViewCount(profile.getViewCount());
        
        dto.setImageUrl(profile.getImageUrl());
        
        // 사용자 정보 매핑
        User user = profile.getUser();
        if (user != null) {
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setBirthDate(user.getBirthDate());
            dto.setLocation(user.getLocation());
            dto.setPhone(user.getPhone());
            dto.setEducation(user.getEducation());
        }
        
        return dto;
    }
} 