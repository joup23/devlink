package com.devlink.service;

import com.devlink.entity.Profile;
import com.devlink.entity.User;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.UserRepository;
import com.devlink.util.security.JwtUtils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository, JwtUtils jwtUtils) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
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

    // 특정 프로필 조회
    public Profile getProfile(Long profileId) {
        return profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
    }

    public Profile updateProfile(Long profileId, String username, String title, String bio, int careerYears, String githubUrl) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        
        // 프로필 소유자 확인
        if (!profile.getUser().getEmail().equals(username)) {
            throw new RuntimeException("프로필을 수정할 권한이 없습니다.");
        }
        
        profile.setTitle(title);
        profile.setBio(bio);
        profile.setCareerYears(careerYears);
        profile.setGithubUrl(githubUrl);
        
        return profileRepository.save(profile);
    }

    // 사용자 이메일로 프로필 조회
    public Profile getProfileByUsername(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return profileRepository.findByUser(user)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
    }
}