package com.devlink.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devlink.entity.User;
import com.devlink.repository.UserRepository;
import com.devlink.util.security.JwtUtils;
import com.devlink.dto.SignupDto;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtils jwtUtils, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = new BCryptPasswordEncoder(); // 비밀번호 해싱
    }

    public String registerUser(SignupDto signupDto) {
        if (userRepository.findByEmail(signupDto.getEmail()).isPresent()) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        User user = new User();
        user.setEmail(signupDto.getEmail());
        user.setPassword(passwordEncoder.encode(signupDto.getPassword()));
        user.setName(signupDto.getName());
        user.setBirthDate(signupDto.getBirthDate());
        user.setLocation(signupDto.getLocation());
        user.setPhone(signupDto.getPhone());
        user.setEducation(signupDto.getEducation());
        user.setRole("USER");

        userRepository.save(user);
        return "회원가입이 완료되었습니다.";
    }

    public String loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // JWT 생성 후 반환
        return jwtUtils.generateToken(user.getEmail());
    }
}

