package com.devlink.repository;

import com.devlink.entity.Like;
import com.devlink.entity.Profile;
import com.devlink.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByProfileAndUser(Profile profile, User user);
    void deleteByProfileAndUser(Profile profile, User user);
    int countByProfile(Profile profile);
    void deleteByProfile(Profile profile);
}