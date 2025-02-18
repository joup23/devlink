package com.devlink.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class SignupDto {
    private String email;
    private String password;
    private String name;
    private LocalDate birthDate;
    private String location;
    private String phone;
    private String education;
} 