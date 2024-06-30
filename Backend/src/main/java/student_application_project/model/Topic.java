package student_application_project.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Topic {
    @Id
    private String id;
    private String name;
    private String description;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME, fallbackPatterns = { "M/d/yy", "dd.MM.yyyy" })
    private LocalDate createdDate = LocalDate.now();
    private String courseId;
    private List<Video> videos;
    private List<Assignment> assignments;
    private List<Material> materials;
}
