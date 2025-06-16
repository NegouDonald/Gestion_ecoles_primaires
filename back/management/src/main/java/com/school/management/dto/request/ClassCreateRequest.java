package com.school.management.dto.request;

import com.school.management.entity.enums.Language;
import com.school.management.entity.enums.Section;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassCreateRequest {
    @NotBlank(message = "Le nom de la classe est requis")
    private String name;

    @NotBlank(message = "Le niveau est requis")
    private String level;

    @NotNull(message = "La section est requise")
    private Section section;

    @NotNull(message = "La langue est requise")
    private Language language;

    @NotBlank(message = "L'année académique est requise")
    private String academicYear;

    private Integer maxCapacity;
}