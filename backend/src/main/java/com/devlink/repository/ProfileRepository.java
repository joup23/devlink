package com.devlink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import com.devlink.entity.Profile;
import com.devlink.entity.User;
    
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByUser(User user);

    Optional<Profile> findByProfileId(Long profileId);

    List<Profile> findAllByOrderByCreatedAtDesc();
    
    @Query(value = "SELECT DISTINCT p FROM Profile p " +
        "LEFT JOIN FETCH p.user " +
        "LEFT JOIN FETCH p.projects " +
        "LEFT JOIN FETCH p.skills " +
        "ORDER BY p.updatedAt DESC",
        countQuery = "SELECT COUNT(p) FROM Profile p")
    Page<Profile> findAllByOrderByUpdatedAtDesc(Pageable pageable);

    List<Profile> findTop3ByOrderByCreatedAtDesc();

    List<Profile> findByTitleContainingOrBioContainingOrSkillsNameIn(
        String title, String bio, List<String> skillNames);

    @Modifying
    @Query("UPDATE Profile p SET p.viewCount = p.viewCount + 1 WHERE p.profileId = :profileId")
    void updateViewCount(@Param("profileId") Long profileId);

    // @Modifying
    // @Query("UPDATE Profile p SET p.likeCount = p.likeCount + 1 WHERE p.profileId = :profileId")
    // void updateLikeCount(@Param("profileId") Long profileId);

    @Query(value = "SELECT DISTINCT p FROM Profile p " +
        "LEFT JOIN FETCH p.user " +
        "LEFT JOIN FETCH p.projects " +
        "LEFT JOIN FETCH p.skills " +
        "WHERE p IN (SELECT p2 FROM Profile p2 JOIN p2.skills s WHERE s.name IN :skillNames) " +
        "ORDER BY p.updatedAt DESC",
        countQuery = "SELECT COUNT(DISTINCT p) FROM Profile p " +
        "WHERE p IN (SELECT p2 FROM Profile p2 JOIN p2.skills s WHERE s.name IN :skillNames)")
    Page<Profile> findBySkillsNameIn(@Param("skillNames") List<String> skillNames, Pageable pageable);
}
