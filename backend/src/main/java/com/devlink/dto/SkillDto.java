package com.devlink.dto;

import com.devlink.entity.Skill;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SkillDto {
    private Long skillId;
    private String name;

    public static SkillDto from(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setSkillId(skill.getSkillId());
        dto.setName(skill.getName());
        return dto;
    }
}
