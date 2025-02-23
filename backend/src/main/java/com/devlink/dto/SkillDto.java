package com.devlink.dto;

import com.devlink.entity.Skill;

public record SkillDto(
    Long skillId,
    String name
) {
    public static SkillDto from(Skill skill) {
        return new SkillDto(
            skill.getSkillId(),
            skill.getName()
        );
    }
}
