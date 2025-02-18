package com.devlink.service;

import com.devlink.entity.Career;
import com.devlink.entity.Profile;
import com.devlink.entity.Project;
import com.devlink.entity.Skill;
import com.devlink.entity.User;
import com.devlink.entity.ProfileProject;
import com.devlink.entity.ProfileCareer;
import com.devlink.repository.CareerRepository;
import com.devlink.repository.LikeRepository;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.ProjectRepository;
import com.devlink.repository.UserRepository;
import com.devlink.repository.SkillRepository;
import com.devlink.util.FileUtil;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final FileUtil fileUtil;
    private final LikeRepository likeRepository;
    private final ProjectRepository projectRepository;
    private final CareerRepository careerRepository;


    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository,
                         SkillRepository skillRepository, FileUtil fileUtil, LikeRepository likeRepository,
                         ProjectRepository projectRepository, CareerRepository careerRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.fileUtil = fileUtil;
        this.likeRepository = likeRepository;
        this.projectRepository = projectRepository;
        this.careerRepository = careerRepository;
    }

    // 프로필 작성
    @Transactional
    public Profile createProfile(String userEmail, MultipartFile imageFile, String profileJson, String careerIds, String projectIds) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode profileNode = mapper.readTree(profileJson);
            
            Profile profile = new Profile();
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
            profile.setUser(user);
            
            // 기본 프로필 정보 설정
            profile.setTitle(profileNode.get("title").asText());
            profile.setBio(profileNode.get("bio").asText());
            profile.setCareerYears(profileNode.get("careerYears").asInt());
            profile.setGithubUrl(profileNode.get("githubUrl").asText());
            
            // 이미지 처리
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileUtil.uploadImage(imageFile);
                profile.setImageUrl(imageUrl);
            }

            // 스킬 처리
            JsonNode skillsNode = profileNode.get("skills");
            if (skillsNode != null && skillsNode.isArray()) {
                skillsNode.forEach(skillNode -> {
                    String skillName = skillNode.asText();
                    Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(skillName);
                            return skillRepository.save(newSkill);
                        });
                    profile.getSkills().add(skill);
                });
            }

            // 프로필 저장
            Profile savedProfile = profileRepository.save(profile);

            // 프로젝트 연결
            if (projectIds != null && !projectIds.isEmpty()) {
                List<Long> projectIdList = mapper.readValue(projectIds, 
                    mapper.getTypeFactory().constructCollectionType(List.class, Long.class));
                
                projectIdList.forEach(projectId -> {
                    Project project = projectRepository.findById(projectId)
                        .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
                    if (!project.getUser().equals(user)) {
                        throw new RuntimeException("Project does not belong to user");
                    }
                    ProfileProject profileProject = new ProfileProject();
                    profileProject.setProfile(savedProfile);
                    profileProject.setProject(project);
                    savedProfile.getProfileProjects().add(profileProject);
                });
            }

            // 경력 연결
            if (careerIds != null && !careerIds.isEmpty()) {
                List<Long> careerIdList = mapper.readValue(careerIds, 
                    mapper.getTypeFactory().constructCollectionType(List.class, Long.class));
                
                careerIdList.forEach(careerId -> {
                    Career career = careerRepository.findById(careerId)
                        .orElseThrow(() -> new RuntimeException("Career not found: " + careerId));
                    if (!career.getUser().equals(user)) {
                        throw new RuntimeException("Career does not belong to user");
                    }
                    ProfileCareer profileCareer = new ProfileCareer();
                    profileCareer.setProfile(savedProfile);
                    profileCareer.setCareer(career);
                    savedProfile.getProfileCareers().add(profileCareer);
                });
            }

            return savedProfile;
        } catch (IOException e) {
            throw new RuntimeException("Failed to process profile data", e);
        }
    }

    // private void updateProfileFields(Profile profile, JsonNode profileNode) {
    //     profile.setTitle(profileNode.get("title").asText());
    //     profile.setBio(profileNode.get("bio").asText());
    //     profile.setCareerYears(profileNode.get("careerYears").asInt());
    //     profile.setGithubUrl(profileNode.get("githubUrl").asText());
        
    //     // 스킬 처리
    //     profile.getSkills().clear();
    //     JsonNode skillsNode = profileNode.get("skills");
    //     if (skillsNode != null && skillsNode.isArray()) {
    //         skillsNode.forEach(skillNode -> {
    //             String skillName = skillNode.asText();
    //             Skill skill = skillRepository.findByName(skillName)
    //                 .orElseGet(() -> {
    //                     Skill newSkill = new Skill();
    //                     newSkill.setName(skillName);
    //                     return skillRepository.save(newSkill);
    //                 });
    //             profile.getSkills().add(skill);
    //         });
    //     }
    // }

    // 사용자 프로필 조회
    public List<Profile> getProfiles() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    // 특정 프로필 조회
    public Profile getProfile(Long profileId) {
        return profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
    }

    @Transactional
    public Profile updateProfile(Long profileId, String userEmail, MultipartFile imageFile, 
                               String profileJson, String careerIds, String projectIds) {
        try {
            Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

            // 권한 체크
            if (!profile.getUser().getEmail().equals(userEmail)) {
                throw new RuntimeException("Not authorized to update this profile");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode profileNode = mapper.readTree(profileJson);
            
            // 기본 프로필 정보 업데이트
            profile.setTitle(profileNode.get("title").asText());
            profile.setBio(profileNode.get("bio").asText());
            profile.setCareerYears(profileNode.get("careerYears").asInt());
            profile.setGithubUrl(profileNode.get("githubUrl").asText());

            // 이미지 처리
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileUtil.uploadImage(imageFile);
                profile.setImageUrl(imageUrl);
            }

            // 스킬 처리
            profile.getSkills().clear();
            JsonNode skillsNode = profileNode.get("skills");
            if (skillsNode != null && skillsNode.isArray()) {
                skillsNode.forEach(skillNode -> {
                    String skillName = skillNode.asText();
                    Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(skillName);
                            return skillRepository.save(newSkill);
                        });
                    profile.getSkills().add(skill);
                });
            }

            // 프로젝트 연결
            if (projectIds != null && !projectIds.isEmpty()) {
                // 기존 프로젝트 연결 제거
                profile.getProfileProjects().clear();
                
                List<Long> projectIdList = mapper.readValue(projectIds, 
                    mapper.getTypeFactory().constructCollectionType(List.class, Long.class));
                
                projectIdList.forEach(projectId -> {
                    Project project = projectRepository.findById(projectId)
                        .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
                    ProfileProject profileProject = new ProfileProject();
                    profileProject.setProfile(profile);
                    profileProject.setProject(project);
                    profile.getProfileProjects().add(profileProject);
                });
            }

            // 경력 연결
            if (careerIds != null && !careerIds.isEmpty()) {
                // 기존 경력 연결 제거
                profile.getProfileCareers().clear();
                
                List<Long> careerIdList = mapper.readValue(careerIds, 
                    mapper.getTypeFactory().constructCollectionType(List.class, Long.class));
                
                careerIdList.forEach(careerId -> {
                    Career career = careerRepository.findById(careerId)
                        .orElseThrow(() -> new RuntimeException("Career not found: " + careerId));
                    ProfileCareer profileCareer = new ProfileCareer();
                    profileCareer.setProfile(profile);
                    profileCareer.setCareer(career);
                    profile.getProfileCareers().add(profileCareer);
                });
            }

            return profileRepository.save(profile);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process profile data", e);
        }
    }

    // 사용자 이메일로 프로필 조회
    public Profile getProfileByUsername(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return profileRepository.findByUserOrderByUpdatedAtDesc(user)
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
        likeRepository.deleteByProfile(profile); // 좋아요 관계 제거
        
        profileRepository.delete(profile);
    }

    @Transactional
    public void incrementViewCount(Long profileId) {
        // 조회수 증가를 위한 단일 쿼리 실행
        profileRepository.updateViewCount(profileId);
    }

    // @Transactional
    // public void toggleLike(Long profileId, String username) {
    //     Profile profile = getProfile(profileId);
    //     User user = userRepository.findByEmail(username)
    //         .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    //     if (profile.getLikedBy().contains(user)) {
    //         profile.removeLike(user);
    //     } else {
    //         profile.addLike(user);
    //     }
        
    //     profileRepository.updateLikeCount(profileId);
    // }

    // public boolean isLikedByUser(Long profileId, String username) {
    //     Profile profile = getProfile(profileId);
    //     return profile.getLikedBy().stream()
    //         .anyMatch(user -> user.getEmail().equals(username));
    // }

    @Transactional
    public void addProjectToProfile(Long profileId, Long projectId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        
        ProfileProject profileProject = new ProfileProject();
        profileProject.setProfile(profile);
        profileProject.setProject(project);
        profile.getProfileProjects().add(profileProject);
    }

    @Transactional
    public void removeProjectFromProfile(Long profileId, Long projectId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        profile.getProfileProjects().removeIf(p -> p.getProject().getProjectId().equals(projectId));
        profileRepository.save(profile);
    }

    @Transactional
    public void addCareerToProfile(Long profileId, Long careerId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        Career career = careerRepository.findById(careerId)
            .orElseThrow(() -> new RuntimeException("경력을 찾을 수 없습니다."));
        
        ProfileCareer profileCareer = new ProfileCareer();
        profileCareer.setProfile(profile);
        profileCareer.setCareer(career);
        profile.getProfileCareers().add(profileCareer);
    }

    @Transactional
    public void removeCareerFromProfile(Long profileId, Long careerId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        profile.getProfileCareers().removeIf(c -> c.getCareer().getCareerId().equals(careerId));
        profileRepository.save(profile);
    }

}