package com.devlink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devlink.entity.Profile;
import com.devlink.entity.User;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByUser(User user);

    Optional<Profile> findByProfileId(Long profileId);
}
