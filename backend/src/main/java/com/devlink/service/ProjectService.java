package com.devlink.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.devlink.entity.Profile;
import com.devlink.entity.Project;
import com.devlink.entity.User;
import com.devlink.entity.Skill;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.ProjectRepository;
import com.devlink.repository.UserRepository;
import com.devlink.repository.SkillRepository;
import com.devlink.dto.ProjectDto;
import com.devlink.util.FileUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProfileRepository profileRepository;
    private final FileUtil fileUtil;

    public ProjectService(ProjectRepository projectRepository,
                         UserRepository userRepository,
                         SkillRepository skillRepository,
                         ProfileRepository profileRepository,
                         FileUtil fileUtil) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.profileRepository = profileRepository;
        this.fileUtil = fileUtil;
    }

    public ProjectDto getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다: " + projectId));
        return ProjectDto.from(project);
    }

    public List<ProjectDto> getProjectsByProfileId(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        List<Project> projects = projectRepository.findProjectsByProfile(profile);
        return projects.stream()
            .map(ProjectDto::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public ProjectDto createProject(String userEmail, String projectJson, List<MultipartFile> images) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode projectNode = mapper.readTree(projectJson);

            Project project = new Project();
            project.setUser(user);
            project.setTitle(projectNode.get("title").asText());
            project.setDescription(projectNode.get("description").asText());
            project.setStartDate(projectNode.get("startDate").asText());
            project.setEndDate(projectNode.get("endDate").asText());
            project.setGithubUrl(projectNode.get("githubUrl").asText());
            project.setProjectUrl(projectNode.get("projectUrl").asText());

            // 스킬 설정
            if (projectNode.get("skills") != null && !projectNode.get("skills").isEmpty()) {
                projectNode.get("skills").forEach(skillDto -> {
                    Skill skill = skillRepository.findByName(skillDto.get("name").asText())
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(skillDto.get("name").asText());
                            return skillRepository.save(newSkill);
                        });
                    project.getSkills().add(skill);
                });
            }
            
            // 이미지 업로드
            List<String> imageUrls = new ArrayList<>();
            if (images != null && !images.isEmpty()) {
                for (MultipartFile image : images) {
                    String imageUrl = fileUtil.uploadImage(image, "projects");
                    imageUrls.add(imageUrl);
                }
                project.setImageUrls(imageUrls);
            }

            Project savedProject = projectRepository.save(project);
            return ProjectDto.from(savedProject);
        } catch (Exception e) {
            throw new RuntimeException("프로젝트 생성 실패: " + e.getMessage());
        }
    }

    public List<ProjectDto> getUserProjects(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userEmail));
        return projectRepository.findByUser(user)
            .stream()
            .map(ProjectDto::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public void assignProjectToProfile(Long projectId, Long profileId) {
        // 프로필에 프로젝트 할당 로직
    }

    @Transactional
    public void removeProjectFromProfile(Long projectId) {
        // 프로필에서 프로젝트 제거 로직
    }

    @Transactional
    public ProjectDto updateProject(String userEmail, Long projectId, String projectJson, List<MultipartFile> images) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        try {
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
            if (!project.getUser().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("이 프로젝트를 수정할 권한이 없습니다.");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode projectNode = mapper.readTree(projectJson);
            
            // 프로젝트 수정 로직
            project.setTitle(projectNode.get("title").asText());
            project.setDescription(projectNode.get("description").asText());
            project.setGithubUrl(projectNode.get("githubUrl").asText());
            project.setProjectUrl(projectNode.get("projectUrl").asText());
            project.setStartDate(projectNode.get("startDate").asText());
            project.setEndDate(projectNode.get("endDate").asText());

            // 기존 스킬 제거
            project.getSkills().clear();
            // 새로운 스킬 추가
            if (projectNode.get("skills") != null) {
                projectNode.get("skills").forEach(skillDto -> {
                    Skill skill = skillRepository.findByName(skillDto.get("name").asText())
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(skillDto.get("name").asText());
                            return skillRepository.save(newSkill);
                        });
                    project.getSkills().add(skill);
                });
            }
            
            JsonNode imagesToDeleteNode = projectNode.get("imagesToDelete");
            // 이미지 삭제 처리
            if (imagesToDeleteNode != null && !imagesToDeleteNode.isEmpty()) {
                List<String> currentImages = project.getImageUrls();
                if (currentImages != null) {
                    // 파일 시스템에서 이미지 파일 삭제
                    for (JsonNode imageUrlNode : imagesToDeleteNode) {
                        String imageUrl = imageUrlNode.asText();
                        try {
                            // 이미지 URL에서 파일명 추출 (/images/projects/filename.ext)
                            String fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                            fileUtil.deleteImage(fileName, "projects");
                        } catch (Exception e) {
                            // 파일 삭제 실패 로그 (실패해도 DB에서는 삭제)
                            System.err.println("이미지 삭제 중 오류 발생: " + imageUrl + " - " + e.getMessage());
                        }
                        
                        // DB의 이미지 URL 목록에서 삭제
                        currentImages.remove(imageUrl);
                    }
                }
            }
            
            // 이미지 처리
            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile image : images) {
                    String imageUrl = fileUtil.uploadImage(image, "projects");
                    imageUrls.add(imageUrl);
                }
                // 기존 이미지에 새 이미지 추가
                if (project.getImageUrls() == null) {
                    project.setImageUrls(imageUrls);
                } else {
                    project.getImageUrls().addAll(imageUrls);
                }
            }
            
            return ProjectDto.from(projectRepository.save(project));
        } catch (Exception e) {
            throw new RuntimeException("프로젝트 수정 실패: " + e.getMessage());
        }
    }

    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }

    @Transactional
    public ProjectDto uploadProjectImages(Long projectId, List<MultipartFile> images) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다: " + projectId));
        
        // 이미지 업로드
        List<String> imageUrls = new ArrayList<>();
        
        for (MultipartFile image : images) {
            try {
                String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                Path uploadPath = Paths.get("data/image/projects");
                
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                imageUrls.add("/images/projects/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("이미지 저장 실패", e);
            }
        }
        
        project.getImageUrls().addAll(imageUrls);
        return ProjectDto.from(projectRepository.save(project));
    }
}