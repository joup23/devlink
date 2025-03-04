package com.devlink.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devlink.entity.Career;
import com.devlink.entity.CareerProject;
import com.devlink.entity.Skill;
import com.devlink.entity.Profile;
import com.devlink.entity.User;
import com.devlink.entity.ProfileCareer;
import com.devlink.repository.CareerRepository;
import com.devlink.repository.ProfileRepository;
import com.devlink.repository.SkillRepository;
import com.devlink.repository.UserRepository;
import com.devlink.dto.CareerDto;
import com.devlink.dto.CareerProjectDto;
import com.devlink.dto.SkillDto;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashSet;
import java.util.Set;

@Service
public class CareerService {
    private final CareerRepository careerRepository;
    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public CareerService(CareerRepository careerRepository, 
                        ProfileRepository profileRepository,
                        SkillRepository skillRepository,
                        UserRepository userRepository) {
        this.careerRepository = careerRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    public CareerDto getCareerById(Long careerId) {
        Career career = careerRepository.findById(careerId)
            .orElseThrow(() -> new RuntimeException("경력사항을 찾을 수 없습니다."));
        return CareerDto.from(career);
    }

    public List<CareerDto> getCareersByProfileId(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다."));
            
        List<Career> careers = careerRepository.findCareersByProfile(profile);
        return careers.stream()
            .map(CareerDto::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public Career addCareerToProfile(Long profileId, CareerDto careerDto) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));

        Career career = new Career();
        career.setCompanyName(careerDto.getCompanyName());
        career.setDepartment(careerDto.getDepartment());
        career.setPosition(careerDto.getPosition());
        career.setStartDate(careerDto.getStartDate());
        career.setEndDate(careerDto.getEndDate());
        career.setDescription(careerDto.getDescription());

        // 프로젝트 추가
        if (careerDto.getProjects() != null) {
            for (CareerProjectDto projectDto : careerDto.getProjects()) {
                CareerProject project = new CareerProject();
                project.setProjectTitle(projectDto.getProjectName());
                project.setProjectDescription(projectDto.getDescription());
                project.setStartDate(projectDto.getStartDate());
                project.setEndDate(projectDto.getEndDate());
                project.setCareer(career);

                // 스킬 추가
                if (projectDto.getSkills() != null) {
                    for (SkillDto skillDto : projectDto.getSkills()) {
                        Skill skill = skillRepository.findByName(skillDto.getName())
                            .orElseGet(() -> {
                                Skill newSkill = new Skill();
                                newSkill.setName(skillDto.getName());
                                return skillRepository.save(newSkill);
                            });
                        project.getSkills().add(skill);
                    }
                }
                career.getProjects().add(project);
            }
        }

        return careerRepository.save(career);
    }

    @Transactional
    public Career updateCareer(Long careerId, CareerDto careerDto) {
        Career career = careerRepository.findById(careerId)
            .orElseThrow(() -> new RuntimeException("Career not found"));

        career.setCompanyName(careerDto.getCompanyName());
        career.setDepartment(careerDto.getDepartment());
        career.setPosition(careerDto.getPosition());
        career.setStartDate(careerDto.getStartDate());
        career.setEndDate(careerDto.getEndDate());
        career.setDescription(careerDto.getDescription());

        // 기존 프로젝트 삭제
        career.getProjects().clear();

        // 새 프로젝트 추가
        if (careerDto.getProjects() != null) {
            for (CareerProjectDto projectDto : careerDto.getProjects()) {
                CareerProject project = new CareerProject();
                project.setProjectTitle(projectDto.getProjectName());
                project.setProjectDescription(projectDto.getDescription());
                project.setStartDate(projectDto.getStartDate());
                project.setEndDate(projectDto.getEndDate());
                project.setCareer(career);

                // 스킬 추가
                if (projectDto.getSkills() != null) {
                    for (SkillDto skillDto : projectDto.getSkills()) {
                        Skill skill = skillRepository.findByName(skillDto.getName())
                            .orElseGet(() -> {
                                Skill newSkill = new Skill();
                                newSkill.setName(skillDto.getName());
                                return skillRepository.save(newSkill);
                            });
                        project.getSkills().add(skill);
                    }
                }
                career.getProjects().add(project);
            }
        }

        return careerRepository.save(career);
    }

    public void deleteCareer(Long careerId) {
        careerRepository.deleteById(careerId);
    }

    @Transactional
    public Career createCareer(String userEmail, CareerDto careerDto) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Career career = new Career();
        career.setUser(user);
        career.setCompanyName(careerDto.getCompanyName());
        career.setDepartment(careerDto.getDepartment());
        career.setPosition(careerDto.getPosition());
        career.setStartDate(careerDto.getStartDate());
        career.setEndDate(careerDto.getEndDate());
        career.setDescription(careerDto.getDescription());

        // 프로젝트 추가
        if (careerDto.getProjects() != null) {
            for (CareerProjectDto projectDto : careerDto.getProjects()) {
                CareerProject project = new CareerProject();
                project.setProjectTitle(projectDto.getProjectName());
                project.setProjectDescription(projectDto.getDescription());
                project.setStartDate(projectDto.getStartDate());
                project.setEndDate(projectDto.getEndDate());
                project.setCareer(career);

                // 스킬 추가
                if (projectDto.getSkills() != null) {
                    for (SkillDto skillDto : projectDto.getSkills()) {
                        Skill skill = skillRepository.findByName(skillDto.getName())
                            .orElseGet(() -> {
                                Skill newSkill = new Skill();
                                newSkill.setName(skillDto.getName());
                                return skillRepository.save(newSkill);
                            });
                        project.getSkills().add(skill);
                    }
                }
                career.getProjects().add(project);
            }
        }

        return careerRepository.save(career);
    }

    public List<CareerDto> getUserCareers(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return careerRepository.findByUserOrderByStartDateDesc(user)
            .stream()
            .map(CareerDto::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public void assignCareerToProfile(Long careerId, Long profileId) {
        Career career = careerRepository.findById(careerId)
            .orElseThrow(() -> new RuntimeException("Career not found"));
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        ProfileCareer profileCareer = new ProfileCareer();
        profileCareer.setProfile(profile);
        profileCareer.setCareer(career);
        profile.getProfileCareers().add(profileCareer);
        profileRepository.save(profile);
    }

    @Transactional
    public void removeCareerFromProfile(Long careerId) {
        Career career = careerRepository.findById(careerId)
            .orElseThrow(() -> new RuntimeException("Career not found"));
        career.getProfileCareers().clear();
        careerRepository.save(career);
    }
} 