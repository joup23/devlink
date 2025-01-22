package com.devlink.service;

import com.devlink.entity.User;
import com.devlink.repository.UserRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        // 비밀번호 해싱, 중복 이메일 체크 등 로직 필요시 추가
        return userRepository.save(user);
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User updated) {
        User user = getUser(id);
        user.setEmail(updated.getEmail());
        user.setName(updated.getName());
        user.setRole(updated.getRole());
        // 비밀번호 수정 로직 등
        return user;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
