package com.devlink.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "project")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @Column(nullable = false)
    private String title; // 프로젝트 제목

    private String description; // 프로젝트 설명

    private String link; // 프로젝트 관련 링크 (GitHub, 배포 URL 등)

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile; // 프로젝트가 연결된 프로필
}
