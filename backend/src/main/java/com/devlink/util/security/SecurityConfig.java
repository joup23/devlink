package com.devlink.util.security;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.devlink.config.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtFilter;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsString;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource()).and() // CORS 설정 활성화
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // 로그인/회원가입은 인증 없이 허용
                .requestMatchers(HttpMethod.GET, "/api/profiles/**").permitAll() // GET 요청만 허용
                .requestMatchers(HttpMethod.GET, "/api/projects/**").permitAll() // GET 요청만 허용
                .requestMatchers(HttpMethod.GET, "/api/career/**").permitAll() // GET 요청만 허용
                .requestMatchers(HttpMethod.GET, "/api/skill/**").permitAll() // GET 요청만 허용
                .requestMatchers(HttpMethod.GET, "/images/**").permitAll() // GET 요청만 허용
                .anyRequest().authenticated()           // 그 외 요청은 인증 필요
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // 필터 추가

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 쉼표로 구분된 문자열을 리스트로 변환
        List<String> allowedOrigins = Arrays.stream(allowedOriginsString.split(","))
                                           .map(String::trim)
                                           .collect(Collectors.toList());
        
        configuration.setAllowedOrigins(allowedOrigins); // 프론트엔드 주소들
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}