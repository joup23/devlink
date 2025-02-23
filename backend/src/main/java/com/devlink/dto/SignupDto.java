package com.devlink.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.devlink.entity.User;

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

    public static SignupDto from(User user) {
        SignupDto signupDto = new SignupDto();
        signupDto.setEmail(user.getEmail());
        signupDto.setName(user.getName());
        signupDto.setBirthDate(user.getBirthDate());
        signupDto.setLocation(user.getLocation());
        signupDto.setPhone(user.getPhone());
        signupDto.setEducation(user.getEducation());
        return signupDto;
    }
} 