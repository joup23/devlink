package com.devlink.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.devlink.entity.Career;
import com.devlink.entity.User;
import com.devlink.entity.Profile;

@Repository
public interface CareerRepository extends JpaRepository<Career, Long> {
    List<Career> findByUserOrderByStartDateDesc(User user);
    
    // findByProfile 대신 ProfileCareer를 통해 조회
    @Query("SELECT pc.career FROM ProfileCareer pc WHERE pc.profile = :profile")
    List<Career> findCareersByProfile(@Param("profile") Profile profile);
} 