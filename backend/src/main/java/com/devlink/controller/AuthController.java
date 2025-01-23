package com.devlink.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devlink.dto.AuthStatusResponse;
import com.devlink.dto.LoginRequest;
import com.devlink.dto.MessageResponse;
import com.devlink.service.AuthService;
import com.devlink.util.security.JwtUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.getOrDefault("role", "USER");
        String message = authService.registerUser(name, email, password, role);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        // 로그인 검증 로직...
        
        String token = jwtUtils.generateToken(loginRequest.getEmail());
        
        // 쿠키 생성
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS만 사용
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 24시간
        
        response.addCookie(cookie);
        
        return ResponseEntity.ok(new MessageResponse("로그인 성공"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        
        response.addCookie(cookie);
        
        return ResponseEntity.ok(new MessageResponse("로그아웃 성공"));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    if (jwtUtils.validateToken(token)) {
                        return ResponseEntity.ok(new AuthStatusResponse(true));
                    }
                }
            }
        }
        
        // 401 대신 200으로 응답하되, 인증 상태만 다르게 전달
        return ResponseEntity.ok(new AuthStatusResponse(false));
    }
}
