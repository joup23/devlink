package com.devlink.repository;

import com.devlink.entity.Project;
import com.devlink.entity.User;
import com.devlink.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUser(User user);
    
    @Query("SELECT pp.project FROM ProfileProject pp WHERE pp.profile = :profile")
    List<Project> findProjectsByProfile(@Param("profile") Profile profile);
}
