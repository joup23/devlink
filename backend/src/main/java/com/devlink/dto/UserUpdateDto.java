package com.devlink.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDto {
    private String name;
    private LocalDate birthDate;
    private String location;
    private String phone;
    private String education;
} 