package com.devlink.service;

import com.devlink.entity.Profile;
import com.devlink.entity.User;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // 프로필 작성
    public Profile createProfile(String title, String bio, int careerYears, String githubUrl) {
        // 인증된 사용자 가져오기
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 프로필 생성
        Profile profile = new Profile();
        profile.setTitle(title);
        profile.setBio(bio);
        profile.setCareerYears(careerYears);
        profile.setGithubUrl(githubUrl);
        profile.setUser(user);

        return profileRepository.save(profile);
    }

    // 사용자 프로필 조회
    public List<Profile> getProfiles() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileRepository.findByUser(user);
    }
}