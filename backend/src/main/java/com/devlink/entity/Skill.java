package com.devlink.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "skill")
@Getter
@Setter
@NoArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillId;

    @Column(nullable = false, unique = true)
    private String name; // 스킬 이름 (e.g., "Java", "Spring Boot")

    @ManyToMany(mappedBy = "skills")
    private Set<Profile> profiles; // 연결된 프로필들
}