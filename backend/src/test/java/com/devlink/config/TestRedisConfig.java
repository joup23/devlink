package com.devlink.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

import com.devlink.service.storage.SupabaseStorageService;

import static org.mockito.Mockito.mock;

/**
 * 테스트 환경에서 외부 서비스를 모의 객체로 대체하는 설정 클래스
 */
@TestConfiguration
public class TestRedisConfig {

    /**
     * Redis 연결 팩토리를 모의 객체로 대체
     */
    @Bean
    @Primary
    public RedisConnectionFactory redisConnectionFactory() {
        return mock(RedisConnectionFactory.class);
    }

    /**
     * Redis 템플릿을 모의 객체로 대체
     */
    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        return redisTemplate;
    }
    
    /**
     * Supabase 스토리지 서비스를 모의 객체로 대체
     */
    @Bean
    @Primary
    public SupabaseStorageService supabaseStorageService() {
        return mock(SupabaseStorageService.class);
    }
} 