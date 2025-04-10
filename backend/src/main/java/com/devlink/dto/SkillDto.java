package com.devlink.dto;

import java.io.Serializable;

import com.devlink.entity.Skill;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SkillDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long skillId;
    private String name;

    public static SkillDto from(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setSkillId(skill.getSkillId());
        dto.setName(skill.getName());
        return dto;
    }
}
