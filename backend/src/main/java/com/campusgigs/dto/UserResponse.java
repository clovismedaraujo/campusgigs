package com.campusgigs.dto;

import com.campusgigs.model.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String institutionalEmail;
    private String phone;
    private String course;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .institutionalEmail(user.getInstitutionalEmail())
                .phone(user.getPhone())
                .course(user.getCourse())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
