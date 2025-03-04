package com.devlink.entity;

import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.Data;

@Entity
@Table(name = "profile")
@Data
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

    @Column(columnDefinition = "TEXT")
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 프로필-프로젝트 관계
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileProject> profileProjects = new ArrayList<>();

    // 프로필-경력 관계
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileCareer> profileCareers = new ArrayList<>();

    // 프로필-스킬 관계
    @ManyToMany
    @JoinTable(
        name = "profile_skills",
        joinColumns = @JoinColumn(name = "profile_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @OrderBy("name ASC")
    private Set<Skill> skills = new HashSet<>();

    // @Column(name = "like_count")
    // private int likeCount = 0;

    @Column(nullable = false)
    private int viewCount = 0;
  
    @Column(name = "image_url")
    private String imageUrl;  // 이미지 URL 저장

    @ManyToMany
    @JoinTable(
        name = "profile_likes",
        joinColumns = @JoinColumn(name = "profile_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> likedBy = new HashSet<>();

    public void addLike(User user) {
        this.likedBy.add(user);
        user.getLikedProfiles().add(this);
    }

    public void removeLike(User user) {
        this.likedBy.remove(user);
        user.getLikedProfiles().remove(this);
    }
}