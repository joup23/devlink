package com.devlink.entity;

import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @Column(nullable = false)
    private String title; // 프로필 제목

    @Column(nullable = false)
    private String bio; // 사용자 소개

    private int careerYears; // 경력 (년)

    private String githubUrl; // GitHub URL

    // 사용자와 연결 (Many-to-One)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 프로필에 연결된 프로젝트들
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Project> projects; // 프로필에 연결된 프로젝트들

    // 프로필에 연결된 스킬들
    @ManyToMany
    @JoinTable(
            name = "profile_skill",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills; // 프로필에 연결된 스킬들
}