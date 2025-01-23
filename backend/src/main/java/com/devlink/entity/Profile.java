package com.devlink.entity;

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
}