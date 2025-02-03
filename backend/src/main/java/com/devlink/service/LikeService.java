package com.devlink.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devlink.entity.Like;
import com.devlink.entity.Profile;
import com.devlink.entity.User;
import com.devlink.repository.LikeRepository;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Boolean> redisTemplate;

    private String getLikeKey(Long profileId, String username) {
        return "like:" + profileId + ":" + username;
    }

    @Transactional
    public void toggleLike(Long profileId, String username) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Optional<Like> existingLike = likeRepository.findByProfileAndUser(profile, user);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            redisTemplate.opsForValue().set(getLikeKey(profileId, username), false);
        } else {
            likeRepository.save(new Like(profile, user));
            redisTemplate.opsForValue().set(getLikeKey(profileId, username), true);
        }
    }

    public boolean isLikedByUser(Long profileId, String username) {
        Boolean cachedLike = redisTemplate.opsForValue().get(getLikeKey(profileId, username));
        if (cachedLike != null) {
            return cachedLike;
        }

        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        boolean liked = likeRepository.findByProfileAndUser(profile, user).isPresent();
        redisTemplate.opsForValue().set(getLikeKey(profileId, username), liked);
        return liked;
    }

    public int getLikeCount(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
        return likeRepository.countByProfile(profile);
    }
}
