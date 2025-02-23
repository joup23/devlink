package com.devlink.repository;

import com.devlink.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByName(String name); // 스킬 이름으로 조회
    List<Skill> findByNameContainingIgnoreCase(String query);
    List<Skill> findAllByOrderByName();
}
