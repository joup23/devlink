package com.devlink.controller;

import com.devlink.entity.Project;
import com.devlink.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/{profileId}")
    public ResponseEntity<Project> addProject(@PathVariable Long profileId, @RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        String link = (String) body.get("link");
        @SuppressWarnings("unchecked")
        List<String> skills = (List<String>) body.get("skills");

        Project project = projectService.addProjectToProfile(profileId, title, description, link, skills);
        return ResponseEntity.ok(project);
    }

    // 프로젝트 수정
    @PutMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(@PathVariable Long projectId, @RequestBody Map<String, Object> body) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        String link = (String) body.get("link");
        @SuppressWarnings("unchecked")
        List<String> skills = (List<String>) body.get("skills");

        Project project = projectService.updateProject(projectId, username, title, description, link, skills);
        return ResponseEntity.ok(project);
    }

    // 프로젝트 삭제
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        projectService.deleteProject(projectId, username);
        return ResponseEntity.ok().build();
    }
}
