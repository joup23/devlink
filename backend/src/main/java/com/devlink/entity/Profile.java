package com.devlink.entity;

import java.util.Set;
import java.util.HashSet;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
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

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // 사용자와 연결 (Many-to-One)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 프로필에 연결된 프로젝트들
    @OneToMany(mappedBy = "profile", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Project> projects = new HashSet<>();

    // 프로필에 연결된 스킬들
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "profile_skill", 
        joinColumns = @JoinColumn(name = "profile_id"), 
        inverseJoinColumns = @JoinColumn(name = "skill_id"))
    @OrderBy("name ASC")  // 스킬을 이름순으로 정렬
    private Set<Skill> skills = new HashSet<>();

    // @Column(name = "like_count")
    // private int likeCount = 0;

    @Column(nullable = false)
    private int viewCount = 0;
  
    @Column(name = "image_url")
    private String imageUrl;  // 이미지 URL 저장
}