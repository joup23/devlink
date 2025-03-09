package com.devlink;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.devlink.config.TestRedisConfig;

@SpringBootTest(properties = {
	"spring.main.allow-bean-definition-overriding=true"
})
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application.properties")
@Import(TestRedisConfig.class)
class DevlinkApplicationTests {

	@Test
	void contextLoads() {
		// 기본 컨텍스트 로드 테스트
	}

}
