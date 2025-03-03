package com.devlink.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import com.devlink.service.ProjectService;
import com.devlink.dto.ProjectDto;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/my/{projectId}")
    public ResponseEntity<ProjectDto> getMyProject(@PathVariable Long projectId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        ProjectDto projectDto = projectService.getProjectById(projectId);
        return ResponseEntity.ok(projectDto);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectDto>> getMyProjects() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ProjectDto> projects = projectService.getUserProjects(userEmail);
        return ResponseEntity.ok(projects);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProjectDto> createProject(
            @RequestPart("project") ProjectDto projectDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        ProjectDto createdProject = projectService.createProject(userEmail, projectDto, images);
        return ResponseEntity.ok(createdProject);
    }

    @PutMapping(value = "/{projectId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable Long projectId,
            @RequestPart("project") String projectJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        ProjectDto updatedProject = projectService.updateProject(userEmail, projectId, projectJson, images);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{projectId}/assign/{profileId}")
    public ResponseEntity<Void> assignToProfile(
            @PathVariable Long projectId,
            @PathVariable Long profileId) {
        projectService.assignProjectToProfile(projectId, profileId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{projectId}/remove-from-profile")
    public ResponseEntity<Void> removeFromProfile(@PathVariable Long projectId) {
        projectService.removeProjectFromProfile(projectId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByProfileId(@PathVariable Long profileId) {
        List<ProjectDto> projectDtos = projectService.getProjectsByProfileId(profileId);
        return ResponseEntity.ok(projectDtos);
    }
}
