package com.devlink.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import com.devlink.service.ProjectService;
import com.devlink.dto.ProjectDto;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        ProjectDto created = projectService.createProject(userEmail, projectDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectDto>> getMyProjects() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ProjectDto> projects = projectService.getUserProjects(userEmail);
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectDto projectDto) {
        ProjectDto updated = projectService.updateProject(projectId, projectDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
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

    @GetMapping("/my/{projectId}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long projectId) {
        ProjectDto projectDto = projectService.getProjectById(projectId);
        return ResponseEntity.ok(projectDto);
    }
}
