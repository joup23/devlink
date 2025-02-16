package com.devlink.service;

import com.devlink.entity.User;
import com.devlink.repository.UserRepository;
import com.devlink.dto.UserUpdateDto;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
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

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(Long id, User updated) {
        User user = getUser(id);
        user.setName(updated.getName());
        user.setEmail(updated.getEmail());
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(String email, UserUpdateDto updateDto) {
        User user = getUserByEmail(email);
        
        // null이 아닌 필드만 업데이트
        if (updateDto.getName() != null) {
            user.setName(updateDto.getName());
        }
        if (updateDto.getBirthDate() != null) {
            user.setBirthDate(updateDto.getBirthDate());
        }
        if (updateDto.getLocation() != null) {
            user.setLocation(updateDto.getLocation());
        }
        if (updateDto.getPhone() != null) {
            user.setPhone(updateDto.getPhone());
        }
        if (updateDto.getEducation() != null) {
            user.setEducation(updateDto.getEducation());
        }
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
