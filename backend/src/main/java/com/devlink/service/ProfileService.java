package com.devlink.service;

import com.devlink.entity.Profile;
import com.devlink.entity.User;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;
    private final ProjectService projectService;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository,
                         SkillService skillService, ProjectService projectService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.skillService = skillService;
        this.projectService = projectService;
    }

    // 프로필 작성
    public Profile createProfile(String title, String bio, int careerYears, String githubUrl,
                               List<Map<String, String>> projects, List<String> skills) {
        // 인증된 사용자 가져오기
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 프로필 생성
        Profile profile = new Profile();
        profile.setTitle(title);
        profile.setBio(bio);
        profile.setCareerYears(careerYears);
        profile.setGithubUrl(githubUrl);
        profile.setUser(user);
        
        // 프로필 저장
        profile = profileRepository.save(profile);
        
        // 스킬 추가
        if (skills != null) {
            for (String skillName : skills) {
                skillService.addSkillToProfile(profile.getProfileId(), skillName);
            }
        }
        
        // 프로젝트 추가
        if (projects != null) {
            for (Map<String, String> project : projects) {
                projectService.addProjectToProfile(
                    profile.getProfileId(),
                    project.get("title"),
                    project.get("description"),
                    project.get("link")
                );
            }
        }
        
        // 최종 프로필 조회 및 반환
        return profileRepository.findById(profile.getProfileId())
            .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    // 사용자 프로필 조회
    public List<Profile> getProfiles() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileRepository.findByUser(user);
    }

    // 특정 프로필 조회
    public Profile getProfile(Long profileId) {
        return profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
    }

    @Transactional
    public Profile updateProfile(Long profileId, String username, String title, String bio, 
                               int careerYears, String githubUrl, List<String> skills,
                               List<Map<String, String>> projects) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        
        // 프로필 소유자 확인
        if (!profile.getUser().getEmail().equals(username)) {
            throw new RuntimeException("프로필을 수정할 권한이 없습니다.");
        }
        
        // 기본 정보 업데이트
        profile.setTitle(title);
        profile.setBio(bio);
        profile.setCareerYears(careerYears);
        profile.setGithubUrl(githubUrl);
        
        // 스킬 업데이트
        profile.getSkills().clear();
        if (skills != null) {
            for (String skillName : skills) {
                skillService.addSkillToProfile(profileId, skillName);
            }
        }
        
        // 프로젝트 업데이트
        profile.getProjects().clear();
        if (projects != null) {
            for (Map<String, String> project : projects) {
                projectService.addProjectToProfile(
                    profileId,
                    project.get("title"),
                    project.get("description"),
                    project.get("link")
                );
            }
        }
        
        return profileRepository.save(profile);
    }

    // 사용자 이메일로 프로필 조회
    public Profile getProfileByUsername(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return profileRepository.findByUser(user)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
    }

    @Transactional(readOnly = true)
    public Page<Profile> getAllProfiles(Pageable pageable, List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return profileRepository.findAllByOrderByUpdatedAtDesc(pageable);
        }
        return profileRepository.findBySkillsNameIn(skills, pageable);
    }

    public List<Profile> getRecentProfiles(int limit) {
        return profileRepository.findTop3ByOrderByCreatedAtDesc();
    }

    public List<Profile> searchProfiles(String keyword, List<String> skills) {
        if (keyword == null && (skills == null || skills.isEmpty())) {
            return profileRepository.findAllByOrderByCreatedAtDesc();
        }
        
        return profileRepository.findByTitleContainingOrBioContainingOrSkillsNameIn(
            keyword == null ? "" : keyword,
            keyword == null ? "" : keyword,
            skills == null ? List.of() : skills
        );
    }

    @Transactional
    public void deleteProfile(Long profileId, String username) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        
        if (!profile.getUser().getEmail().equals(username)) {
            throw new RuntimeException("프로필을 삭제할 권한이 없습니다.");
        }
        
        // 연관된 데이터 먼저 삭제
        profile.getSkills().clear();  // 스킬 관계 제거
        profile.getLikedBy().clear(); // 좋아요 관계 제거
        profile.getProjects().clear(); // 프로젝트 관계 제거
        
        profileRepository.delete(profile);
    }

    @Transactional
    public void incrementViewCount(Long profileId) {
        // 조회수 증가를 위한 단일 쿼리 실행
        profileRepository.updateViewCount(profileId);
    }

    @Transactional
    public void toggleLike(Long profileId, String username) {
        Profile profile = getProfile(profileId);
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (profile.getLikedBy().contains(user)) {
            profile.removeLike(user);
        } else {
            profile.addLike(user);
        }
        
        profileRepository.updateLikeCount(profileId);
    }

    public boolean isLikedByUser(Long profileId, String username) {
        Profile profile = getProfile(profileId);
        return profile.getLikedBy().stream()
            .anyMatch(user -> user.getEmail().equals(username));
    }
}