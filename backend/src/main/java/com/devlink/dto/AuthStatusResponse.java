package com.devlink.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthStatusResponse {
    private boolean authenticated;
} 