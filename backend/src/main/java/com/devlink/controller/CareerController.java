package com.devlink.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.devlink.service.CareerService;
import com.devlink.dto.CareerDto;
import com.devlink.entity.Career;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;


@RestController
@RequestMapping("/api/careers")
public class CareerController {
    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @PostMapping("/profile/{profileId}")
    public ResponseEntity<Career> addCareer(
            @PathVariable Long profileId,
            @RequestBody CareerDto careerDto) {
        Career career = careerService.addCareerToProfile(profileId, careerDto);
        return ResponseEntity.ok(career);
    }

    @PutMapping("/{careerId}")
    public ResponseEntity<Career> updateCareer(
            @PathVariable Long careerId,
            @RequestBody CareerDto careerDto) {
        Career career = careerService.updateCareer(careerId, careerDto);
        return ResponseEntity.ok(career);
    }

    @DeleteMapping("/{careerId}")
    public ResponseEntity<Void> deleteCareer(@PathVariable Long careerId) {
        careerService.deleteCareer(careerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Career> createCareer(@RequestBody CareerDto careerDto) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Career career = careerService.createCareer(userEmail, careerDto);
        return ResponseEntity.ok(career);
    }

    @GetMapping("/my")
    public ResponseEntity<List<CareerDto>> getMyCareers() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CareerDto> careers = careerService.getUserCareers(userEmail);
        return ResponseEntity.ok(careers);
    }

    @PutMapping("/{careerId}/assign/{profileId}")
    public ResponseEntity<Void> assignToProfile(
            @PathVariable Long careerId,
            @PathVariable Long profileId) {
        careerService.assignCareerToProfile(careerId, profileId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{careerId}/remove-from-profile")
    public ResponseEntity<Void> removeFromProfile(@PathVariable Long careerId) {
        careerService.removeCareerFromProfile(careerId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<List<CareerDto>> getCareersByProfileId(@PathVariable Long profileId) {
        List<CareerDto> careerDtos = careerService.getCareersByProfileId(profileId);
        return ResponseEntity.ok(careerDtos);
    }

    @GetMapping("/my/{careerId}")
    public ResponseEntity<CareerDto> getCareerById(@PathVariable Long careerId) {
        CareerDto careerDto = careerService.getCareerById(careerId);
        return ResponseEntity.ok(careerDto);
    }
} 